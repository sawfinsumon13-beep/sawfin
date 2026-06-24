import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../app/app_theme.dart';
import '../app/routes.dart';
import '../models/app_user.dart';
import '../services/admin_repository.dart';
import '../services/auth_service.dart';
import '../services/user_repository.dart';
import '../widgets/casino_widgets.dart';
import 'admin/admin_dashboard_screen.dart';
import 'admin/admin_reports_screen.dart';
import 'admin/admin_settings_screen.dart';
import 'admin/admin_user_management_screen.dart';

class AdminScreen extends StatelessWidget {
  const AdminScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = AuthService();
    final repository = UserRepository();
    final currentUser = auth.currentUser;

    if (currentUser == null) {
      return const _AdminLoginScaffold();
    }

    return StreamBuilder<AppUser>(
      stream: repository.watchUser(currentUser.uid),
      builder: (context, snapshot) {
        final user = snapshot.data;
        if (user == null) {
          return const _AdminFrame(child: Center(child: CircularProgressIndicator()));
        }
        if (!user.isAdmin || !user.isActive) {
          return _AdminFrame(
            child: EmptyState(
              icon: Icons.admin_panel_settings_rounded,
              title: 'Admin only',
              message: user.isActive
                  ? 'Your account does not have the admin role.'
                  : 'This account is ${user.status} and cannot access admin tools.',
            ),
          );
        }
        return AdminControlPanel(admin: user);
      },
    );
  }
}

class AdminControlPanel extends StatefulWidget {
  const AdminControlPanel({required this.admin, super.key});

  final AppUser admin;

  @override
  State<AdminControlPanel> createState() => _AdminControlPanelState();
}

class _AdminControlPanelState extends State<AdminControlPanel> {
  final _adminRepository = AdminRepository();
  var _index = 0;
  var _loggedAccess = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_loggedAccess) {
      _loggedAccess = true;
      unawaited(_adminRepository.logAction(action: 'open_admin_panel', target: 'admin/control-panel'));
    }
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      AdminDashboardScreen(onOpenSection: (index) => setState(() => _index = index)),
      const AdminUserManagementScreen(),
      const AdminSettingsScreen(),
      const AdminReportsScreen(),
    ];

    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Text('Admin Control Panel'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Center(
              child: Text(
                widget.admin.displayName,
                style: const TextStyle(color: CasinoColors.gold, fontWeight: FontWeight.w800),
              ),
            ),
          ),
        ],
      ),
      body: PremiumBackground(child: SafeArea(top: false, child: pages[_index])),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_rounded), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.manage_accounts_rounded), label: 'Users'),
          NavigationDestination(icon: Icon(Icons.tune_rounded), label: 'Settings'),
          NavigationDestination(icon: Icon(Icons.bar_chart_rounded), label: 'Reports'),
        ],
      ),
    );
  }
}

class _AdminLoginScaffold extends StatefulWidget {
  const _AdminLoginScaffold();

  @override
  State<_AdminLoginScaffold> createState() => _AdminLoginScaffoldState();
}

class _AdminLoginScaffoldState extends State<_AdminLoginScaffold> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _auth = AuthService();
  final _users = UserRepository();
  var _loading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _loading = true);
    try {
      final credential = await _auth.login(
        email: _emailController.text,
        password: _passwordController.text,
      );
      final profile = await _users.userRef(credential.user!.uid).get();
      final admin = AppUser.fromFirestore(profile);
      if (!admin.isAdmin || !admin.isActive) {
        await _auth.signOut();
        throw FirebaseAuthException(
          code: 'permission-denied',
          message: 'Only active administrators can access this panel.',
        );
      }
      await AdminRepository().logAction(action: 'admin_login', target: 'admin/login');
      if (mounted) {
        Navigator.of(context).pushReplacementNamed(AppRoutes.admin);
      }
    } on FirebaseAuthException catch (error) {
      _showError(error.message ?? 'Admin login failed.');
    } catch (error) {
      _showError(error.toString());
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  void _showError(String message) {
    if (!mounted) {
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), behavior: SnackBarBehavior.floating),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PremiumBackground(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 460),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      'Secure Admin Login',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Role-based access control verifies your Firebase user profile before opening the panel.',
                      style: TextStyle(color: CasinoColors.muted),
                    ),
                    const SizedBox(height: 18),
                    CasinoCard(
                      child: Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            TextFormField(
                              controller: _emailController,
                              keyboardType: TextInputType.emailAddress,
                              decoration: const InputDecoration(
                                labelText: 'Admin email',
                                prefixIcon: Icon(Icons.email_rounded),
                              ),
                              validator: (value) => (value ?? '').contains('@') ? null : 'Enter an admin email.',
                            ),
                            const SizedBox(height: 14),
                            TextFormField(
                              controller: _passwordController,
                              obscureText: true,
                              decoration: const InputDecoration(
                                labelText: 'Password',
                                prefixIcon: Icon(Icons.lock_rounded),
                              ),
                              validator: (value) => (value ?? '').length >= 6 ? null : 'Enter your password.',
                              onFieldSubmitted: (_) => _login(),
                            ),
                            const SizedBox(height: 18),
                            FilledButton(
                              onPressed: _loading ? null : _login,
                              child: _loading
                                  ? const SizedBox.square(
                                      dimension: 18,
                                      child: CircularProgressIndicator(strokeWidth: 2),
                                    )
                                  : const Text('Enter Admin Panel'),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    OutlinedButton.icon(
                      onPressed: () => Navigator.of(context).pushReplacementNamed(AppRoutes.login),
                      icon: const Icon(Icons.arrow_back_rounded),
                      label: const Text('Back to player login'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _AdminFrame extends StatelessWidget {
  const _AdminFrame({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(title: const Text('Admin Control Panel')),
      body: PremiumBackground(
        child: SafeArea(
          top: false,
          child: Padding(padding: const EdgeInsets.all(20), child: child),
        ),
      ),
    );
  }
}
