import 'package:flutter/material.dart';

import '../app/app_theme.dart';
import '../app/routes.dart';
import '../services/auth_service.dart';
import '../widgets/casino_widgets.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _auth = AuthService();
  var _sound = true;
  var _haptics = true;

  Future<void> _signOut() async {
    await _auth.signOut();
    if (!mounted) {
      return;
    }
    Navigator.of(context).pushNamedAndRemoveUntil(AppRoutes.login, (_) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(title: const Text('Settings')),
      body: PremiumBackground(
        child: SafeArea(
          top: false,
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              const DemoOnlyBanner(),
              const SizedBox(height: 16),
              CasinoCard(
                child: Column(
                  children: [
                    SwitchListTile.adaptive(
                      value: _sound,
                      onChanged: (value) => setState(() => _sound = value),
                      title: const Text('Sound effects'),
                      subtitle: const Text('Local device preference', style: TextStyle(color: CasinoColors.muted)),
                    ),
                    SwitchListTile.adaptive(
                      value: _haptics,
                      onChanged: (value) => setState(() => _haptics = value),
                      title: const Text('Haptic feedback'),
                      subtitle: const Text('Local device preference', style: TextStyle(color: CasinoColors.muted)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              const CasinoCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Responsible demo policy', style: TextStyle(fontWeight: FontWeight.w900)),
                    SizedBox(height: 8),
                    Text(
                      'sawfin777 is a play-money entertainment demo. Virtual coins, rewards, ranks, and achievements cannot be sold, transferred, deposited, withdrawn, or converted to money.',
                      style: TextStyle(color: CasinoColors.muted),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: _signOut,
                icon: const Icon(Icons.logout_rounded),
                label: const Text('Sign out'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
