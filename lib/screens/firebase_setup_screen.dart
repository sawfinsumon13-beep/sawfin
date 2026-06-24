import 'package:flutter/material.dart';

import '../app/app_theme.dart';
import '../widgets/casino_widgets.dart';

class FirebaseSetupScreen extends StatelessWidget {
  const FirebaseSetupScreen({this.message, super.key});

  final String? message;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PremiumBackground(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 520),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Container(
                      height: 92,
                      width: 92,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: const LinearGradient(colors: [CasinoColors.gold, CasinoColors.goldDeep]),
                        boxShadow: [
                          BoxShadow(
                            color: CasinoColors.gold.withValues(alpha: .3),
                            blurRadius: 34,
                          ),
                        ],
                      ),
                      child: const Text(
                        '777',
                        style: TextStyle(
                          color: Color(0xFF201300),
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                    const SizedBox(height: 22),
                    Text(
                      'sawfin777 setup needed',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'The app opened successfully, but Firebase is not configured in this APK.',
                      style: TextStyle(color: CasinoColors.muted),
                    ),
                    const SizedBox(height: 18),
                    CasinoCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.info_rounded, color: CasinoColors.gold),
                              SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Why login is unavailable',
                                  style: TextStyle(fontWeight: FontWeight.w900),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text(
                            message ?? 'Firebase configuration is missing.',
                            style: const TextStyle(color: CasinoColors.muted),
                          ),
                          const SizedBox(height: 14),
                          const Text(
                            'To make the real app work, add Firebase Android values as GitHub repository secrets and run the APK workflow again.',
                            style: TextStyle(color: CasinoColors.muted),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    const DemoOnlyBanner(),
                    const SizedBox(height: 18),
                    const SelectableText(
                      'Required secrets:\n'
                      'FIREBASE_ANDROID_API_KEY\n'
                      'FIREBASE_ANDROID_APP_ID\n'
                      'FIREBASE_MESSAGING_SENDER_ID\n'
                      'FIREBASE_PROJECT_ID\n'
                      'FIREBASE_STORAGE_BUCKET',
                      style: TextStyle(color: CasinoColors.gold, fontWeight: FontWeight.w700),
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
