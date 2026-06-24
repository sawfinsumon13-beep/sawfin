import 'package:flutter/material.dart';

import '../app/app_theme.dart';
import '../models/app_user.dart';
import '../services/user_repository.dart';
import '../widgets/casino_widgets.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final repository = UserRepository();
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          'Leaderboard',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 8),
        const Text(
          'Ranked by XP earned through play-money entertainment.',
          style: TextStyle(color: CasinoColors.muted),
        ),
        const SizedBox(height: 20),
        StreamBuilder<List<AppUser>>(
          stream: repository.watchLeaderboard(),
          builder: (context, snapshot) {
            final users = snapshot.data ?? const <AppUser>[];
            if (snapshot.connectionState == ConnectionState.waiting && users.isEmpty) {
              return const Center(child: CircularProgressIndicator());
            }
            if (users.isEmpty) {
              return const EmptyState(
                icon: Icons.leaderboard_rounded,
                title: 'No players yet',
                message: 'The leaderboard fills as players earn XP.',
              );
            }
            return Column(
              children: [
                for (var i = 0; i < users.length; i++)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: _LeaderboardRow(user: users[i], rank: i + 1),
                  ),
              ],
            );
          },
        ),
      ],
    );
  }
}

class _LeaderboardRow extends StatelessWidget {
  const _LeaderboardRow({required this.user, required this.rank});

  final AppUser user;
  final int rank;

  @override
  Widget build(BuildContext context) {
    final medalColor = switch (rank) {
      1 => CasinoColors.gold,
      2 => const Color(0xFFC0C0C0),
      3 => const Color(0xFFCD7F32),
      _ => CasinoColors.surfaceLight,
    };

    return CasinoCard(
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: medalColor,
            child: Text(
              '$rank',
              style: TextStyle(
                color: rank <= 3 ? const Color(0xFF201300) : Colors.white,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user.displayName, style: const TextStyle(fontWeight: FontWeight.w800)),
                Text(user.rank, style: const TextStyle(color: CasinoColors.muted, fontSize: 12)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('${user.xp} XP', style: const TextStyle(fontWeight: FontWeight.w900)),
              Text('${user.balance} coins', style: const TextStyle(color: CasinoColors.gold, fontSize: 12)),
            ],
          ),
        ],
      ),
    );
  }
}
