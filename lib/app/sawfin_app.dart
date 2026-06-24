import 'package:flutter/material.dart';

import 'app_theme.dart';
import 'routes.dart';

class SawfinApp extends StatelessWidget {
  const SawfinApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'sawfin777',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark(),
      initialRoute: AppRoutes.splash,
      onGenerateRoute: AppRoutes.onGenerateRoute,
    );
  }
}
