import 'package:flutter/material.dart';

import '../screens/admin_screen.dart';
import '../screens/login_screen.dart';
import '../screens/main_shell.dart';
import '../screens/splash_screen.dart';

class AppRoutes {
  static const splash = '/';
  static const login = '/login';
  static const shell = '/home';
  static const admin = '/admin';

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return _fade(const SplashScreen(), settings);
      case login:
        return _fade(const LoginScreen(), settings);
      case shell:
        return _fade(const MainShell(), settings);
      case admin:
        return _fade(const AdminScreen(), settings);
      default:
        return _fade(const SplashScreen(), settings);
    }
  }

  static PageRouteBuilder<dynamic> _fade(Widget page, RouteSettings settings) {
    return PageRouteBuilder<dynamic>(
      settings: settings,
      pageBuilder: (_, __, ___) => page,
      transitionsBuilder: (_, animation, __, child) {
        return FadeTransition(
          opacity: CurvedAnimation(parent: animation, curve: Curves.easeOutCubic),
          child: child,
        );
      },
    );
  }
}
