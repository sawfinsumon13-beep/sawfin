import 'package:flutter/material.dart';

import '../../app/app_theme.dart';
import '../../services/game_service.dart';
import '../../widgets/casino_widgets.dart';

class OfflineDemoApp extends StatefulWidget {
  const OfflineDemoApp({this.startupMessage, super.key});

  final String? startupMessage;

  @override
  State<OfflineDemoApp> createState() => _OfflineDemoAppState();
}

class _OfflineDemoAppState extends State<OfflineDemoApp> {
  final _gameService = GameService();
  final _gameEnabled = <String, bool>{
    'slot_machine': true,
    'lucky_wheel': true,
    'card_match': true,
    'dice': true,
    'coin_flip': true,
  };
  final _adminLogs = <String>['Offline demo mode opened'];
  final _notifications = <String>['Welcome to sawfin777 offline demo'];
  final _announcements = <String>['Claim your demo bonus and try every game.'];

  var _loggedIn = false;
  var _page = 0;
  var _balance = 777;
  var _xp = 0;
  var _dailyStreak = 0;
  var _rewardsRedeemed = 0;
  var _plays = 0;
  var _activeUsers = 1;
  final _achievements = <String>{};

  @override
  Widget build(BuildContext context) {
    if (!_loggedIn) {
      return _OfflineLogin(
        startupMessage: widget.startupMessage,
        onEnter: () => setState(() {
          _loggedIn = true;
          _adminLogs.insert(0, 'Demo admin login');
        }),
      );
    }

    final pages = [
      _DemoHome(
        balance: _balance,
        xp: _xp,
        dailyStreak: _dailyStreak,
        notifications: _notifications,
        announcements: _announcements,
        onClaimBonus: _claimBonus,
        onOpenGames: () => setState(() => _page = 1),
      ),
      _DemoGames(
        balance: _balance,
        gameEnabled: _gameEnabled,
        onPlay: _playGame,
      ),
      _DemoRewards(
        balance: _balance,
        onRedeem: _redeemReward,
      ),
      _DemoProfile(
        balance: _balance,
        xp: _xp,
        streak: _dailyStreak,
        achievements: _achievements,
        onOpenAdmin: () => setState(() => _page = 4),
      ),
      _DemoAdmin(
        totalUsers: 12,
        activeUsers: _activeUsers,
        newRegistrations: 4,
        plays: _plays,
        rewardsRedeemed: _rewardsRedeemed,
        gameEnabled: _gameEnabled,
        adminLogs: _adminLogs,
        notifications: _notifications,
        announcements: _announcements,
        onToggleGame: (gameId, enabled) => setState(() {
          _gameEnabled[gameId] = enabled;
          _adminLogs.insert(0, '${enabled ? 'Enabled' : 'Disabled'} $gameId');
        }),
        onAddAnnouncement: () => setState(() {
          _announcements.insert(0, 'New demo announcement ${_announcements.length + 1}');
          _adminLogs.insert(0, 'Created demo announcement');
        }),
        onAddNotification: () => setState(() {
          _notifications.insert(0, 'Demo notification ${_notifications.length + 1}');
          _adminLogs.insert(0, 'Created demo notification');
        }),
        onSuspendUser: () => setState(() {
          _activeUsers = _activeUsers == 0 ? 1 : _activeUsers - 1;
          _adminLogs.insert(0, 'Suspended demo user');
        }),
      ),
    ];

    return Scaffold(
      body: PremiumBackground(child: SafeArea(child: pages[_page])),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _page,
        onTap: (value) => setState(() => _page = value),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_rounded), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.casino_rounded), label: 'Games'),
          BottomNavigationBarItem(icon: Icon(Icons.card_giftcard_rounded), label: 'Rewards'),
          BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Profile'),
          BottomNavigationBarItem(icon: Icon(Icons.admin_panel_settings_rounded), label: 'Admin'),
        ],
      ),
    );
  }

  void _claimBonus() {
    setState(() {
      _dailyStreak++;
      final amount = 200 + _dailyStreak * 25;
      _balance += amount;
      _xp += 20;
      _achievements.add('Daily Bonus');
      _adminLogs.insert(0, 'Daily bonus claimed: +$amount');
    });
    _message('Daily bonus claimed');
  }

  void _redeemReward(int cost, String title) {
    if (_balance < cost) {
      _message('Not enough demo coins');
      return;
    }
    setState(() {
      _balance -= cost;
      _xp += 40;
      _rewardsRedeemed++;
      _achievements.add('Reward Collector');
      _adminLogs.insert(0, 'Redeemed $title');
    });
    _message('$title redeemed');
  }

  void _playGame(String gameId) {
    if (_gameEnabled[gameId] != true) {
      _message('This game is disabled by admin settings');
      return;
    }

    final outcome = switch (gameId) {
      'slot_machine' => _gameService.spinSlots(),
      'lucky_wheel' => _gameService.spinWheel(),
      'card_match' => _gameService.cardMatchWin(moves: 12),
      'dice' => _gameService.rollDice(),
      'coin_flip' => _gameService.flipCoin(pickedHeads: true),
      _ => _gameService.rollDice(),
    };

    setState(() {
      _balance = (_balance + outcome.coinDelta).clamp(0, 999999).toInt();
      _xp += outcome.xp;
      _plays++;
      if (outcome.achievement != null) {
        _achievements.add(outcome.achievement!.replaceAll('_', ' '));
      }
      _adminLogs.insert(0, '${outcome.title}: ${outcome.coinDelta} coins');
    });
    _message('${outcome.title}: ${outcome.coinDelta >= 0 ? '+' : ''}${outcome.coinDelta} coins');
  }

  void _message(String text) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(text), behavior: SnackBarBehavior.floating),
    );
  }
}

class _OfflineLogin extends StatelessWidget {
  const _OfflineLogin({
    required this.onEnter,
    this.startupMessage,
  });

  final VoidCallback onEnter;
  final String? startupMessage;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PremiumBackground(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 460),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const DemoOnlyBanner(),
                    const SizedBox(height: 24),
                    Text(
                      'sawfin777',
                      style: Theme.of(context).textTheme.displaySmall?.copyWith(fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Offline demo APK - install korei app dekhte parben.',
                      style: TextStyle(color: CasinoColors.muted),
                    ),
                    const SizedBox(height: 20),
                    CasinoCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Demo Login', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
                          const SizedBox(height: 8),
                          const Text(
                            'Firebase setup chara ei APK local demo mode-e cholbe. Real login/database er jonno Firebase secrets diye rebuild korte hobe.',
                            style: TextStyle(color: CasinoColors.muted),
                          ),
                          if (startupMessage != null) ...[
                            const SizedBox(height: 10),
                            Text(startupMessage!, style: const TextStyle(color: CasinoColors.gold, fontSize: 12)),
                          ],
                          const SizedBox(height: 18),
                          FilledButton.icon(
                            onPressed: onEnter,
                            icon: const Icon(Icons.play_arrow_rounded),
                            label: const Text('Open Demo App'),
                          ),
                        ],
                      ),
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

class _DemoHome extends StatelessWidget {
  const _DemoHome({
    required this.balance,
    required this.xp,
    required this.dailyStreak,
    required this.notifications,
    required this.announcements,
    required this.onClaimBonus,
    required this.onOpenGames,
  });

  final int balance;
  final int xp;
  final int dailyStreak;
  final List<String> notifications;
  final List<String> announcements;
  final VoidCallback onClaimBonus;
  final VoidCallback onOpenGames;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                'Home Dashboard',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
              ),
            ),
            CoinBadge(balance: balance),
          ],
        ),
        const SizedBox(height: 16),
        CasinoCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Daily Bonus', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
              Text('Streak $dailyStreak - XP $xp', style: const TextStyle(color: CasinoColors.muted)),
              const SizedBox(height: 14),
              FilledButton.icon(
                onPressed: onClaimBonus,
                icon: const Icon(Icons.bolt_rounded),
                label: const Text('Claim Demo Bonus'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        CasinoCard(
          child: Row(
            children: [
              const Icon(Icons.view_carousel_rounded, color: CasinoColors.gold, size: 36),
              const SizedBox(width: 12),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Premium Demo Banner', style: TextStyle(fontWeight: FontWeight.w900)),
                    Text('Play every virtual coin game instantly.', style: TextStyle(color: CasinoColors.muted)),
                  ],
                ),
              ),
              TextButton(onPressed: onOpenGames, child: const Text('Play')),
            ],
          ),
        ),
        const SizedBox(height: 18),
        const SectionHeader(title: 'Notifications'),
        const SizedBox(height: 10),
        ...notifications.map((text) => _SimpleInfoCard(icon: Icons.notifications_rounded, text: text)),
        const SizedBox(height: 18),
        const SectionHeader(title: 'Announcements'),
        const SizedBox(height: 10),
        ...announcements.map((text) => _SimpleInfoCard(icon: Icons.campaign_rounded, text: text)),
      ],
    );
  }
}

class _DemoGames extends StatelessWidget {
  const _DemoGames({
    required this.balance,
    required this.gameEnabled,
    required this.onPlay,
  });

  final int balance;
  final Map<String, bool> gameEnabled;
  final ValueChanged<String> onPlay;

  @override
  Widget build(BuildContext context) {
    final games = const [
      ('slot_machine', 'Slot Machine', Icons.casino_rounded),
      ('lucky_wheel', 'Lucky Wheel', Icons.track_changes_rounded),
      ('card_match', 'Card Matching Game', Icons.style_rounded),
      ('dice', 'Dice Game', Icons.grid_3x3_rounded),
      ('coin_flip', 'Coin Flip', Icons.monetization_on_rounded),
    ];

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                'Games',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
              ),
            ),
            CoinBadge(balance: balance),
          ],
        ),
        const SizedBox(height: 16),
        const DemoOnlyBanner(),
        const SizedBox(height: 16),
        ...games.map((game) {
          final enabled = gameEnabled[game.$1] == true;
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: CasinoCard(
              child: Row(
                children: [
                  Icon(game.$3, color: enabled ? CasinoColors.gold : CasinoColors.muted, size: 36),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(game.$2, style: const TextStyle(fontWeight: FontWeight.w900)),
                        Text(
                          enabled ? 'Ready to play' : 'Disabled from admin panel',
                          style: const TextStyle(color: CasinoColors.muted),
                        ),
                      ],
                    ),
                  ),
                  FilledButton(
                    onPressed: enabled ? () => onPlay(game.$1) : null,
                    child: const Text('Play'),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }
}

class _DemoRewards extends StatelessWidget {
  const _DemoRewards({
    required this.balance,
    required this.onRedeem,
  });

  final int balance;
  final void Function(int cost, String title) onRedeem;

  @override
  Widget build(BuildContext context) {
    final rewards = const [
      (250, 'Gold Avatar Frame'),
      (500, 'VIP Demo Badge'),
      (777, 'Royal 777 Badge'),
    ];
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                'Rewards',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
              ),
            ),
            CoinBadge(balance: balance),
          ],
        ),
        const SizedBox(height: 16),
        ...rewards.map((reward) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: CasinoCard(
              child: Row(
                children: [
                  const Icon(Icons.workspace_premium_rounded, color: CasinoColors.gold, size: 36),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(reward.$2, style: const TextStyle(fontWeight: FontWeight.w900)),
                        Text('${reward.$1} demo coins', style: const TextStyle(color: CasinoColors.muted)),
                      ],
                    ),
                  ),
                  FilledButton(
                    onPressed: () => onRedeem(reward.$1, reward.$2),
                    child: const Text('Redeem'),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }
}

class _DemoProfile extends StatelessWidget {
  const _DemoProfile({
    required this.balance,
    required this.xp,
    required this.streak,
    required this.achievements,
    required this.onOpenAdmin,
  });

  final int balance;
  final int xp;
  final int streak;
  final Set<String> achievements;
  final VoidCallback onOpenAdmin;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          'Profile',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 16),
        CasinoCard(
          child: Column(
            children: [
              const CircleAvatar(
                radius: 34,
                backgroundColor: CasinoColors.gold,
                child: Text('A', style: TextStyle(color: Color(0xFF201300), fontWeight: FontWeight.w900)),
              ),
              const SizedBox(height: 10),
              const Text('Admin Demo User', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
              const Text('admin@sawfin777.demo', style: TextStyle(color: CasinoColors.muted)),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(child: _ProfileStat(label: 'Coins', value: '$balance')),
                  Expanded(child: _ProfileStat(label: 'XP', value: '$xp')),
                  Expanded(child: _ProfileStat(label: 'Streak', value: '$streak')),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        const SectionHeader(title: 'Achievements'),
        const SizedBox(height: 10),
        if (achievements.isEmpty)
          const EmptyState(
            icon: Icons.emoji_events_rounded,
            title: 'No achievements yet',
            message: 'Play demo games to unlock local achievements.',
          )
        else
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: achievements.map((item) => Chip(label: Text(item))).toList(),
          ),
        const SizedBox(height: 18),
        FilledButton.icon(
          onPressed: onOpenAdmin,
          icon: const Icon(Icons.admin_panel_settings_rounded),
          label: const Text('Open Admin Control Panel'),
        ),
      ],
    );
  }
}

class _DemoAdmin extends StatelessWidget {
  const _DemoAdmin({
    required this.totalUsers,
    required this.activeUsers,
    required this.newRegistrations,
    required this.plays,
    required this.rewardsRedeemed,
    required this.gameEnabled,
    required this.adminLogs,
    required this.notifications,
    required this.announcements,
    required this.onToggleGame,
    required this.onAddAnnouncement,
    required this.onAddNotification,
    required this.onSuspendUser,
  });

  final int totalUsers;
  final int activeUsers;
  final int newRegistrations;
  final int plays;
  final int rewardsRedeemed;
  final Map<String, bool> gameEnabled;
  final List<String> adminLogs;
  final List<String> notifications;
  final List<String> announcements;
  final void Function(String gameId, bool enabled) onToggleGame;
  final VoidCallback onAddAnnouncement;
  final VoidCallback onAddNotification;
  final VoidCallback onSuspendUser;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          'Admin Control Panel',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            _AdminMetric(title: 'Total Users', value: '$totalUsers'),
            _AdminMetric(title: 'Active Users', value: '$activeUsers'),
            _AdminMetric(title: 'New Registrations', value: '$newRegistrations'),
            _AdminMetric(title: 'Game Plays', value: '$plays'),
            _AdminMetric(title: 'Rewards', value: '$rewardsRedeemed'),
          ],
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'User Management'),
        const SizedBox(height: 10),
        CasinoCard(
          child: ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.manage_accounts_rounded, color: CasinoColors.gold),
            title: const Text('Demo Player'),
            subtitle: const Text('Search, edit, suspend, delete user profile demo'),
            trailing: FilledButton(onPressed: onSuspendUser, child: const Text('Suspend')),
          ),
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Content Management'),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(child: OutlinedButton(onPressed: onAddAnnouncement, child: const Text('Add Announcement'))),
            const SizedBox(width: 10),
            Expanded(child: FilledButton(onPressed: onAddNotification, child: const Text('Add Notification'))),
          ],
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Game Settings'),
        const SizedBox(height: 10),
        ...gameEnabled.entries.map((entry) {
          return CasinoCard(
            child: SwitchListTile.adaptive(
              value: entry.value,
              onChanged: (value) => onToggleGame(entry.key, value),
              title: Text(entry.key.replaceAll('_', ' ')),
              subtitle: const Text('Enable/disable game from admin settings'),
            ),
          );
        }),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Reports'),
        const SizedBox(height: 10),
        _SimpleInfoCard(icon: Icons.people_alt_rounded, text: 'User activity report: $activeUsers active users'),
        _SimpleInfoCard(icon: Icons.casino_rounded, text: 'Game usage report: $plays plays'),
        _SimpleInfoCard(icon: Icons.card_giftcard_rounded, text: 'Reward distribution: $rewardsRedeemed redeemed'),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Admin Activity Logs'),
        const SizedBox(height: 10),
        ...adminLogs.take(8).map((log) => _SimpleInfoCard(icon: Icons.history_rounded, text: log)),
      ],
    );
  }
}

class _SimpleInfoCard extends StatelessWidget {
  const _SimpleInfoCard({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: CasinoCard(
        child: Row(
          children: [
            Icon(icon, color: CasinoColors.gold),
            const SizedBox(width: 10),
            Expanded(child: Text(text, style: const TextStyle(color: CasinoColors.muted))),
          ],
        ),
      ),
    );
  }
}

class _ProfileStat extends StatelessWidget {
  const _ProfileStat({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
        Text(label, style: const TextStyle(color: CasinoColors.muted, fontSize: 12)),
      ],
    );
  }
}

class _AdminMetric extends StatelessWidget {
  const _AdminMetric({required this.title, required this.value});

  final String title;
  final String value;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 150,
      child: CasinoCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(value, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 22)),
            Text(title, style: const TextStyle(color: CasinoColors.muted, fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
