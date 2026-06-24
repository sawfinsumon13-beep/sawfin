import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../app/app_theme.dart';
import '../app/routes.dart';
import '../services/auth_service.dart';
import '../widgets/casino_widgets.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final StreamSubscription<User?> _subscription;
  final _auth = AuthService();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..forward();
    _subscription = _auth.authStateChanges.listen((user) async {
      await Future<void>.delayed(const Duration(milliseconds: 900));
      if (!mounted) {
        return;
      }
      Navigator.of(context).pushReplacementNamed(user == null ? AppRoutes.login : AppRoutes.shell);
    });
  }

  @override
  void dispose() {
    _subscription.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PremiumBackground(
        child: Center(
          child: ScaleTransition(
            scale: CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  height: 112,
                  width: 112,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [CasinoColors.gold, CasinoColors.goldDeep],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: CasinoColors.gold.withValues(alpha: .45),
                        blurRadius: 44,
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      '777',
                      style: TextStyle(
                        color: Color(0xFF1B1000),
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'sawfin777',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.6,
                      ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Premium demo casino entertainment',
                  style: TextStyle(color: CasinoColors.muted),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
