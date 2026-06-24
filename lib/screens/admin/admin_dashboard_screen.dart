import 'package:flutter/material.dart';

import '../../app/app_theme.dart';
import '../../models/admin_activity_log.dart';
import '../../models/app_user.dart';
import '../../services/admin_repository.dart';
import '../../widgets/casino_widgets.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({required this.onOpenSection, super.key});

  final ValueChanged<int> onOpenSection;

  @override
  Widget build(BuildContext context) {
    final repository = AdminRepository();
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          'Dashboard',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 8),
        const Text(
          'Real-time operational summary for sawfin777 administrators.',
          style: TextStyle(color: CasinoColors.muted),
        ),
        const SizedBox(height: 18),
        StreamBuilder<List<AppUser>>(
          stream: repository.watchUsers(),
          builder: (context, usersSnapshot) {
            final users = usersSnapshot.data ?? const <AppUser>[];
            final newRegistrations = users.where(_registeredRecently).length;
            final activeUsers = users.where((user) => user.isActive && user.isRecentlyActive).length;
            final suspended = users.where((user) => user.isSuspended).length;

            return _MetricGrid(
              metrics: [
                _Metric('Total Users', '${users.length}', Icons.group_rounded, CasinoColors.gold),
                _Metric('Active Users', '$activeUsers', Icons.online_prediction_rounded, CasinoColors.emerald),
                _Metric('New Registrations', '$newRegistrations', Icons.person_add_alt_1_rounded, CasinoColors.gold),
                _Metric('Suspended', '$suspended', Icons.block_rounded, CasinoColors.crimson),
              ],
            );
          },
        ),
        const SizedBox(height: 20),
        StreamBuilder<List<Map<String, dynamic>>>(
          stream: repository.watchGameSessions(limit: 200),
          builder: (context, snapshot) {
            final sessions = snapshot.data ?? const <Map<String, dynamic>>[];
            final byGame = <String, int>{};
            var totalCoinDelta = 0;
            for (final session in sessions) {
              final gameId = session['gameId'] as String? ?? 'unknown';
              byGame[gameId] = (byGame[gameId] ?? 0) + 1;
              totalCoinDelta += (session['coinDelta'] as num?)?.toInt() ?? 0;
            }
            final topGame = byGame.entries.isEmpty
                ? 'No plays yet'
                : (byGame.entries.toList()..sort((a, b) => b.value.compareTo(a.value))).first.key;

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SectionHeader(title: 'Game Statistics', subtitle: 'Latest 200 game sessions'),
                const SizedBox(height: 12),
                _MetricGrid(
                  metrics: [
                    _Metric('Total Plays', '${sessions.length}', Icons.casino_rounded, CasinoColors.gold),
                    _Metric('Top Game', _friendlyGameName(topGame), Icons.emoji_events_rounded, CasinoColors.emerald),
                    _Metric(
                      'Net Coin Delta',
                      '$totalCoinDelta',
                      Icons.monetization_on_rounded,
                      totalCoinDelta >= 0 ? CasinoColors.emerald : CasinoColors.crimson,
                    ),
                    _Metric('Games Tracked', '${byGame.length}', Icons.analytics_rounded, CasinoColors.gold),
                  ],
                ),
              ],
            );
          },
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Quick Actions'),
        const SizedBox(height: 12),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            _ActionCard(
              icon: Icons.manage_accounts_rounded,
              title: 'Manage users',
              subtitle: 'Search, edit, suspend, and delete profiles',
              onTap: () => onOpenSection(1),
            ),
            _ActionCard(
              icon: Icons.tune_rounded,
              title: 'Game and content settings',
              subtitle: 'Banners, notifications, rewards, and difficulty',
              onTap: () => onOpenSection(2),
            ),
            _ActionCard(
              icon: Icons.bar_chart_rounded,
              title: 'Open reports',
              subtitle: 'Activity, usage, and reward distribution',
              onTap: () => onOpenSection(3),
            ),
          ],
        ),
        const SizedBox(height: 20),
        StreamBuilder<List<AdminActivityLog>>(
          stream: repository.watchAdminLogs(limit: 8),
          builder: (context, snapshot) {
            final logs = snapshot.data ?? const <AdminActivityLog>[];
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SectionHeader(title: 'Recent Admin Activity'),
                const SizedBox(height: 12),
                if (logs.isEmpty)
                  const EmptyState(
                    icon: Icons.history_rounded,
                    title: 'No activity logs',
                    message: 'Admin writes and logins will appear here.',
                  )
                else
                  ...logs.map((log) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: CasinoCard(
                          child: ListTile(
                            contentPadding: EdgeInsets.zero,
                            leading: const Icon(Icons.admin_panel_settings_rounded, color: CasinoColors.gold),
                            title: Text(log.action.replaceAll('_', ' ')),
                            subtitle: Text('${log.adminEmail}\n${log.target}'),
                            isThreeLine: true,
                          ),
                        ),
                      )),
              ],
            );
          },
        ),
      ],
    );
  }

  static bool _registeredRecently(AppUser user) {
    return DateTime.now().difference(user.createdAt).inDays < 7;
  }

  static String _friendlyGameName(String gameId) {
    return switch (gameId) {
      'slot_machine' => 'Slots',
      'lucky_wheel' => 'Lucky Wheel',
      'card_match' => 'Cards',
      'dice' => 'Dice',
      'coin_flip' => 'Coin Flip',
      _ => gameId,
    };
  }
}

class _Metric {
  const _Metric(this.title, this.value, this.icon, this.color);

  final String title;
  final String value;
  final IconData icon;
  final Color color;
}

class _MetricGrid extends StatelessWidget {
  const _MetricGrid({required this.metrics});

  final List<_Metric> metrics;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final columns = constraints.maxWidth > 720 ? 4 : constraints.maxWidth > 420 ? 2 : 1;
        final width = (constraints.maxWidth - (columns - 1) * 12) / columns;
        return Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            for (final metric in metrics)
              SizedBox(
                width: width,
                child: CasinoCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(metric.icon, color: metric.color),
                      const SizedBox(height: 12),
                      Text(
                        metric.value,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
                      ),
                      Text(metric.title, style: const TextStyle(color: CasinoColors.muted)),
                    ],
                  ),
                ),
              ),
          ],
        );
      },
    );
  }
}

class _ActionCard extends StatelessWidget {
  const _ActionCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 260,
      child: CasinoCard(
        onTap: onTap,
        child: Row(
          children: [
            Icon(icon, color: CasinoColors.gold),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
                  Text(subtitle, style: const TextStyle(color: CasinoColors.muted, fontSize: 12)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
