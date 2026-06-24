import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

import 'app/sawfin_app.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (const bool.fromEnvironment('FORCE_OFFLINE_DEMO')) {
    runApp(
      const SawfinApp(
        firebaseReady: false,
        firebaseError: 'Running install-ready offline demo mode.',
      ),
    );
    return;
  }

  try {
    final options = DefaultFirebaseOptions.currentPlatform;
    if (_hasMissingFirebaseConfig(options)) {
      runApp(
        const SawfinApp(
          firebaseReady: false,
          firebaseError:
              'Firebase configuration is missing. Rebuild the APK with Firebase --dart-define values or GitHub Actions secrets.',
        ),
      );
      return;
    }
    await Firebase.initializeApp(options: options);
    runApp(const SawfinApp());
  } catch (error) {
    runApp(
      SawfinApp(
        firebaseReady: false,
        firebaseError: 'Firebase failed to start: $error',
      ),
    );
  }
}

bool _hasMissingFirebaseConfig(FirebaseOptions options) {
  return options.apiKey.isEmpty ||
      options.appId.isEmpty ||
      options.messagingSenderId.isEmpty ||
      options.projectId.isEmpty;
}
