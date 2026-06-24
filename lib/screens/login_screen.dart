import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../app/app_theme.dart';
import '../app/routes.dart';
import '../services/auth_service.dart';
import '../widgets/casino_widgets.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _auth = AuthService();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  var _isRegistering = false;
  var _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _isLoading = true);
    try {
      if (_isRegistering) {
        await _auth.register(
          name: _nameController.text,
          email: _emailController.text,
          password: _passwordController.text,
        );
      } else {
        await _auth.login(
          email: _emailController.text,
          password: _passwordController.text,
        );
      }
      if (!mounted) {
        return;
      }
      Navigator.of(context).pushReplacementNamed(AppRoutes.shell);
    } on FirebaseAuthException catch (error) {
      _showError(error.message ?? 'Authentication failed.');
    } catch (error) {
      _showError(error.toString());
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
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
                    const DemoOnlyBanner(),
                    const SizedBox(height: 24),
                    Text(
                      'Welcome to\nsawfin777',
                      style: Theme.of(context).textTheme.displaySmall?.copyWith(
                            fontWeight: FontWeight.w900,
                            height: 1,
                          ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Play polished mini games with virtual coins only.',
                      style: TextStyle(color: CasinoColors.muted),
                    ),
                    const SizedBox(height: 26),
                    CasinoCard(
                      child: Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            AnimatedSwitcher(
                              duration: const Duration(milliseconds: 220),
                              child: _isRegistering
                                  ? Padding(
                                      padding: const EdgeInsets.only(bottom: 14),
                                      child: TextFormField(
                                        key: const ValueKey('name'),
                                        controller: _nameController,
                                        textInputAction: TextInputAction.next,
                                        decoration: const InputDecoration(
                                          labelText: 'Display name',
                                          prefixIcon: Icon(Icons.person_rounded),
                                        ),
                                        validator: (value) {
                                          if ((value ?? '').trim().length < 2) {
                                            return 'Enter at least 2 characters.';
                                          }
                                          return null;
                                        },
                                      ),
                                    )
                                  : const SizedBox.shrink(),
                            ),
                            TextFormField(
                              controller: _emailController,
                              keyboardType: TextInputType.emailAddress,
                              textInputAction: TextInputAction.next,
                              decoration: const InputDecoration(
                                labelText: 'Email',
                                prefixIcon: Icon(Icons.email_rounded),
                              ),
                              validator: (value) {
                                if (!(value ?? '').contains('@')) {
                                  return 'Enter a valid email.';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 14),
                            TextFormField(
                              controller: _passwordController,
                              obscureText: true,
                              decoration: const InputDecoration(
                                labelText: 'Password',
                                prefixIcon: Icon(Icons.lock_rounded),
                              ),
                              validator: (value) {
                                if ((value ?? '').length < 6) {
                                  return 'Password must be at least 6 characters.';
                                }
                                return null;
                              },
                              onFieldSubmitted: (_) => _submit(),
                            ),
                            const SizedBox(height: 20),
                            FilledButton(
                              onPressed: _isLoading ? null : _submit,
                              child: _isLoading
                                  ? const SizedBox.square(
                                      dimension: 22,
                                      child: CircularProgressIndicator(strokeWidth: 2),
                                    )
                                  : Text(_isRegistering ? 'Create Account' : 'Login'),
                            ),
                            TextButton(
                              onPressed: _isLoading
                                  ? null
                                  : () => setState(() => _isRegistering = !_isRegistering),
                              child: Text(
                                _isRegistering
                                    ? 'Already have an account? Login'
                                    : 'New here? Register',
                              ),
                            ),
                          ],
                        ),
                      ),
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
