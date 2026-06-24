import 'package:flutter/material.dart';

import '../screens/firebase_setup_screen.dart';
import 'app_theme.dart';
import 'routes.dart';

class SawfinApp extends StatelessWidget {
  const SawfinApp({
    this.firebaseReady = true,
    this.firebaseError,
    super.key,
  });

  final bool firebaseReady;
  final String? firebaseError;

  @override
  Widget build(BuildContext context) {
    if (!firebaseReady) {
      return MaterialApp(
        title: 'sawfin777',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.dark(),
        home: FirebaseSetupScreen(message: firebaseError),
      );
    }

    return MaterialApp(
      title: 'sawfin777',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark(),
      initialRoute: AppRoutes.splash,
      onGenerateRoute: AppRoutes.onGenerateRoute,
    );
  }
}
