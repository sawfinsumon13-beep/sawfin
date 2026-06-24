import 'package:flutter/material.dart';

import '../app/app_theme.dart';
import '../app/routes.dart';
import '../models/app_user.dart';
import '../services/user_repository.dart';
import '../widgets/casino_widgets.dart';
import 'settings_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({required this.user, super.key});

  final AppUser user;

  static const _achievementLabels = {
    'daily_bonus': 'Daily Bonus Claimed',
    'jackpot_first': 'Jackpot Winner',
    'triple_match': 'Triple Match',
    'wheel_royalty': 'Wheel Royalty',
    'dice_master': 'Dice Master',
    'coin_caller': 'Coin Caller',
    'memory_ace': 'Memory Ace',
    'card_clear': 'Card Board Clear',
  };

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Row(
          children: [
            CircleAvatar(
              radius: 34,
              backgroundColor: CasinoColors.gold,
              child: Text(
                user.displayName.trim().isEmpty ? 'S' : user.displayName.trim()[0].toUpperCase(),
                style: const TextStyle(
                  color: Color(0xFF201300),
                  fontWeight: FontWeight.w900,
                  fontSize: 24,
                ),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    user.displayName,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
                  ),
                  Text(user.email, style: const TextStyle(color: CasinoColors.muted)),
                  Text(user.rank, style: const TextStyle(color: CasinoColors.gold)),
                ],
              ),
            ),
            IconButton(
              onPressed: () => _showEditProfile(context),
              icon: const Icon(Icons.edit_rounded),
            ),
          ],
        ),
        const SizedBox(height: 18),
        CasinoCard(
          child: Row(
            children: [
              Expanded(child: _Stat(title: 'Coins', value: '${user.balance}')),
              Expanded(child: _Stat(title: 'XP', value: '${user.xp}')),
              Expanded(child: _Stat(title: 'Streak', value: '${user.dailyStreak}')),
            ],
          ),
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Achievements'),
        const SizedBox(height: 12),
        if (user.achievements.isEmpty)
          const EmptyState(
            icon: Icons.emoji_events_rounded,
            title: 'No achievements yet',
            message: 'Play games and claim bonuses to unlock achievements.',
          )
        else
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: user.achievements.map((id) {
              return Chip(
                avatar: const Icon(Icons.emoji_events_rounded, color: CasinoColors.gold, size: 18),
                label: Text(_achievementLabels[id] ?? id),
                backgroundColor: CasinoColors.surfaceLight,
                side: BorderSide(color: CasinoColors.gold.withValues(alpha: .22)),
              );
            }).toList(),
          ),
        const SizedBox(height: 22),
        CasinoCard(
          child: Column(
            children: [
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.settings_rounded, color: CasinoColors.gold),
                title: const Text('Settings'),
                subtitle: const Text('Sound, haptics, account, and demo policy'),
                trailing: const Icon(Icons.chevron_right_rounded),
                onTap: () {
                  Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const SettingsScreen()));
                },
              ),
              if (user.isAdmin)
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.admin_panel_settings_rounded, color: CasinoColors.gold),
                  title: const Text('Admin Console'),
                  subtitle: const Text('Manage users, virtual rewards, and announcements'),
                  trailing: const Icon(Icons.chevron_right_rounded),
                  onTap: () => Navigator.of(context).pushNamed(AppRoutes.admin),
                ),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _showEditProfile(BuildContext context) async {
    final controller = TextEditingController(text: user.displayName);
    final repository = UserRepository();
    await showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: const Text('Edit profile'),
          content: TextField(
            controller: controller,
            decoration: const InputDecoration(labelText: 'Display name'),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () async {
                await repository.updateProfile(uid: user.uid, displayName: controller.text);
                if (dialogContext.mounted) {
                  Navigator.of(dialogContext).pop();
                }
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
    controller.dispose();
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.title, required this.value});

  final String title;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
        const SizedBox(height: 4),
        Text(title, style: const TextStyle(color: CasinoColors.muted, fontSize: 12)),
      ],
    );
  }
}
