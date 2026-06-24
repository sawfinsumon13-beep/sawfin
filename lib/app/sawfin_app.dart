import 'package:flutter/material.dart';

import '../screens/demo/offline_demo_app.dart';
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
        home: OfflineDemoApp(startupMessage: firebaseError),
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
