import 'package:flutter/material.dart';

import '../../app/app_theme.dart';
import '../../models/admin_activity_log.dart';
import '../../models/app_user.dart';
import '../../services/admin_repository.dart';
import '../../widgets/casino_widgets.dart';

class AdminReportsScreen extends StatelessWidget {
  const AdminReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const DefaultTabController(
      length: 4,
      child: Column(
        children: [
          TabBar(
            isScrollable: true,
            tabs: [
              Tab(icon: Icon(Icons.people_alt_rounded), text: 'Users'),
              Tab(icon: Icon(Icons.casino_rounded), text: 'Games'),
              Tab(icon: Icon(Icons.card_giftcard_rounded), text: 'Rewards'),
              Tab(icon: Icon(Icons.history_rounded), text: 'Admin Logs'),
            ],
          ),
          Expanded(
            child: TabBarView(
              children: [
                _UserActivityReport(),
                _GameUsageReport(),
                _RewardDistributionReport(),
                _AdminActivityReport(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _UserActivityReport extends StatelessWidget {
  const _UserActivityReport();

  @override
  Widget build(BuildContext context) {
    final repository = AdminRepository();
    return StreamBuilder<List<AppUser>>(
      stream: repository.watchUsers(),
      builder: (context, snapshot) {
        final users = snapshot.data ?? const <AppUser>[];
        final active = users.where((user) => user.isActive).length;
        final recent = users.where((user) => user.isRecentlyActive).length;
        final newUsers = users.where((user) => DateTime.now().difference(user.createdAt).inDays < 7).length;
        final suspended = users.where((user) => user.isSuspended).length;

        return _ReportList(
          title: 'User Activity Report',
          children: [
            _ReportMetricRow(metrics: [
              _ReportMetric('Active profiles', '$active'),
              _ReportMetric('Active 24h', '$recent'),
              _ReportMetric('New 7d', '$newUsers'),
              _ReportMetric('Suspended', '$suspended'),
            ]),
            const SizedBox(height: 16),
            const SectionHeader(title: 'Recently Active Users'),
            const SizedBox(height: 12),
            if (users.where((user) => user.lastActiveAt != null).isEmpty)
              const EmptyState(
                icon: Icons.people_alt_rounded,
                title: 'No activity yet',
                message: 'Logins and game actions update last active timestamps.',
              )
            else
              ...users
                  .where((user) => user.lastActiveAt != null)
                  .take(20)
                  .map((user) => _ReportTile(
                        icon: Icons.person_rounded,
                        title: user.displayName,
                        subtitle: '${user.email}\n${user.status} - last active ${_formatDate(user.lastActiveAt)}',
                        trailing: '${user.xp} XP',
                      )),
          ],
        );
      },
    );
  }
}

class _GameUsageReport extends StatelessWidget {
  const _GameUsageReport();

  @override
  Widget build(BuildContext context) {
    final repository = AdminRepository();
    return StreamBuilder<List<Map<String, dynamic>>>(
      stream: repository.watchGameSessions(limit: 500),
      builder: (context, snapshot) {
        final sessions = snapshot.data ?? const <Map<String, dynamic>>[];
        final stats = <String, _GameStats>{};
        for (final session in sessions) {
          final gameId = session['gameId'] as String? ?? 'unknown';
          final stat = stats.putIfAbsent(gameId, () => _GameStats(gameId));
          stat.plays++;
          stat.coinDelta += (session['coinDelta'] as num?)?.toInt() ?? 0;
          stat.xp += (session['xp'] as num?)?.toInt() ?? 0;
        }
        final sorted = stats.values.toList()..sort((a, b) => b.plays.compareTo(a.plays));

        return _ReportList(
          title: 'Game Usage Report',
          children: [
            _ReportMetricRow(metrics: [
              _ReportMetric('Tracked plays', '${sessions.length}'),
              _ReportMetric('Games used', '${stats.length}'),
              _ReportMetric('Net coins', '${sorted.fold<int>(0, (sum, stat) => sum + stat.coinDelta)}'),
              _ReportMetric('XP awarded', '${sorted.fold<int>(0, (sum, stat) => sum + stat.xp)}'),
            ]),
            const SizedBox(height: 16),
            if (sorted.isEmpty)
              const EmptyState(
                icon: Icons.casino_rounded,
                title: 'No game usage',
                message: 'Game sessions appear here in real time.',
              )
            else
              ...sorted.map((stat) => _ReportTile(
                    icon: Icons.casino_rounded,
                    title: _friendlyGameName(stat.gameId),
                    subtitle: '${stat.plays} plays - ${stat.xp} XP awarded',
                    trailing: '${stat.coinDelta} coins',
                  )),
          ],
        );
      },
    );
  }
}

class _RewardDistributionReport extends StatelessWidget {
  const _RewardDistributionReport();

  @override
  Widget build(BuildContext context) {
    final repository = AdminRepository();
    return StreamBuilder<List<Map<String, dynamic>>>(
      stream: repository.watchRewardRedemptions(limit: 500),
      builder: (context, snapshot) {
        final redemptions = snapshot.data ?? const <Map<String, dynamic>>[];
        final byReward = <String, _RewardStats>{};
        for (final redemption in redemptions) {
          final title = redemption['title'] as String? ?? 'Reward';
          final stat = byReward.putIfAbsent(title, () => _RewardStats(title));
          stat.count++;
          stat.cost += (redemption['cost'] as num?)?.toInt() ?? 0;
          final status = redemption['status'] as String? ?? 'pending';
          stat.byStatus[status] = (stat.byStatus[status] ?? 0) + 1;
        }
        final sorted = byReward.values.toList()..sort((a, b) => b.count.compareTo(a.count));

        return _ReportList(
          title: 'Reward Distribution Report',
          children: [
            _ReportMetricRow(metrics: [
              _ReportMetric('Redemptions', '${redemptions.length}'),
              _ReportMetric('Reward types', '${byReward.length}'),
              _ReportMetric('Coins redeemed', '${sorted.fold<int>(0, (sum, stat) => sum + stat.cost)}'),
              _ReportMetric('Pending', '${redemptions.where((item) => item['status'] == 'pending').length}'),
            ]),
            const SizedBox(height: 16),
            if (sorted.isEmpty)
              const EmptyState(
                icon: Icons.card_giftcard_rounded,
                title: 'No reward redemptions',
                message: 'Player virtual reward redemptions will appear here.',
              )
            else
              ...sorted.map((stat) => _ReportTile(
                    icon: Icons.workspace_premium_rounded,
                    title: stat.title,
                    subtitle: '${stat.count} redemptions - ${stat.byStatus}',
                    trailing: '${stat.cost} coins',
                  )),
          ],
        );
      },
    );
  }
}

class _AdminActivityReport extends StatelessWidget {
  const _AdminActivityReport();

  @override
  Widget build(BuildContext context) {
    final repository = AdminRepository();
    return StreamBuilder<List<AdminActivityLog>>(
      stream: repository.watchAdminLogs(limit: 200),
      builder: (context, snapshot) {
        final logs = snapshot.data ?? const <AdminActivityLog>[];
        return _ReportList(
          title: 'Admin Activity Logs',
          children: [
            _ReportMetricRow(metrics: [
              _ReportMetric('Logged actions', '${logs.length}'),
              _ReportMetric('Admins', '${logs.map((log) => log.adminUid).toSet().length}'),
            ]),
            const SizedBox(height: 16),
            if (logs.isEmpty)
              const EmptyState(
                icon: Icons.history_rounded,
                title: 'No admin logs',
                message: 'Admin logins and writes are recorded here.',
              )
            else
              ...logs.map((log) => _ReportTile(
                    icon: Icons.admin_panel_settings_rounded,
                    title: log.action.replaceAll('_', ' '),
                    subtitle: '${log.adminEmail}\n${log.target} - ${_formatDate(log.createdAt)}',
                    trailing: '',
                  )),
          ],
        );
      },
    );
  }
}

class _ReportList extends StatelessWidget {
  const _ReportList({required this.title, required this.children});

  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 16),
        ...children,
      ],
    );
  }
}

class _ReportMetric {
  const _ReportMetric(this.label, this.value);

  final String label;
  final String value;
}

class _ReportMetricRow extends StatelessWidget {
  const _ReportMetricRow({required this.metrics});

  final List<_ReportMetric> metrics;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: [
        for (final metric in metrics)
          SizedBox(
            width: 160,
            child: CasinoCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    metric.value,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
                  ),
                  Text(metric.label, style: const TextStyle(color: CasinoColors.muted, fontSize: 12)),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

class _ReportTile extends StatelessWidget {
  const _ReportTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.trailing,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final String trailing;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: CasinoCard(
        child: ListTile(
          contentPadding: EdgeInsets.zero,
          leading: Icon(icon, color: CasinoColors.gold),
          title: Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
          subtitle: Text(subtitle),
          isThreeLine: true,
          trailing: trailing.isEmpty ? null : Text(trailing, style: const TextStyle(fontWeight: FontWeight.w900)),
        ),
      ),
    );
  }
}

class _GameStats {
  _GameStats(this.gameId);

  final String gameId;
  int plays = 0;
  int coinDelta = 0;
  int xp = 0;
}

class _RewardStats {
  _RewardStats(this.title);

  final String title;
  int count = 0;
  int cost = 0;
  final Map<String, int> byStatus = {};
}

String _friendlyGameName(String gameId) {
  return switch (gameId) {
    'slot_machine' => 'Slot Machine',
    'lucky_wheel' => 'Lucky Wheel',
    'card_match' => 'Card Matching',
    'dice' => 'Dice',
    'coin_flip' => 'Coin Flip',
    _ => gameId,
  };
}

String _formatDate(DateTime? date) {
  if (date == null) {
    return 'never';
  }
  return '${date.year}-${_two(date.month)}-${_two(date.day)} ${_two(date.hour)}:${_two(date.minute)}';
}

String _two(int value) => value.toString().padLeft(2, '0');
