import 'package:flutter/material.dart';

import '../app/app_theme.dart';
import '../models/announcement.dart';
import '../models/app_user.dart';
import '../models/reward_item.dart';
import '../services/auth_service.dart';
import '../services/user_repository.dart';
import '../widgets/casino_widgets.dart';

class AdminScreen extends StatelessWidget {
  const AdminScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = AuthService();
    final repository = UserRepository();
    final currentUser = auth.currentUser;

    if (currentUser == null) {
      return const _AdminScaffold(
        child: EmptyState(
          icon: Icons.lock_rounded,
          title: 'Login required',
          message: 'Admin access requires Firebase Authentication.',
        ),
      );
    }

    return StreamBuilder<AppUser>(
      stream: repository.watchUser(currentUser.uid),
      builder: (context, snapshot) {
        final user = snapshot.data;
        if (user == null) {
          return const _AdminScaffold(child: Center(child: CircularProgressIndicator()));
        }
        if (!user.isAdmin) {
          return const _AdminScaffold(
            child: EmptyState(
              icon: Icons.admin_panel_settings_rounded,
              title: 'Admin only',
              message: 'Your account does not have the admin role.',
            ),
          );
        }
        return const _AdminConsole();
      },
    );
  }
}

class _AdminScaffold extends StatelessWidget {
  const _AdminScaffold({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(title: const Text('Admin Console')),
      body: PremiumBackground(
        child: SafeArea(
          top: false,
          child: Padding(padding: const EdgeInsets.all(20), child: child),
        ),
      ),
    );
  }
}

class _AdminConsole extends StatelessWidget {
  const _AdminConsole();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(title: const Text('Admin Console')),
      body: const PremiumBackground(
        child: SafeArea(
          top: false,
          child: DefaultTabController(
            length: 3,
            child: Column(
              children: [
                TabBar(
                  tabs: [
                    Tab(icon: Icon(Icons.group_rounded), text: 'Users'),
                    Tab(icon: Icon(Icons.card_giftcard_rounded), text: 'Rewards'),
                    Tab(icon: Icon(Icons.campaign_rounded), text: 'News'),
                  ],
                ),
                Expanded(
                  child: TabBarView(
                    children: [
                      _AdminUsersTab(),
                      _AdminRewardsTab(),
                      _AdminAnnouncementsTab(),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _AdminUsersTab extends StatelessWidget {
  const _AdminUsersTab();

  @override
  Widget build(BuildContext context) {
    final repository = UserRepository();
    return StreamBuilder<List<AppUser>>(
      stream: repository.watchUsersForAdmin(),
      builder: (context, snapshot) {
        final users = snapshot.data ?? const <AppUser>[];
        if (users.isEmpty) {
          return const Padding(
            padding: EdgeInsets.all(20),
            child: EmptyState(
              icon: Icons.group_rounded,
              title: 'No users',
              message: 'Registered users will appear here.',
            ),
          );
        }
        return ListView.builder(
          padding: const EdgeInsets.all(20),
          itemCount: users.length,
          itemBuilder: (context, index) {
            final user = users[index];
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: CasinoCard(
                child: ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(user.displayName),
                  subtitle: Text('${user.email}\n${user.xp} XP - ${user.rank}'),
                  isThreeLine: true,
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('${user.balance}', style: const TextStyle(fontWeight: FontWeight.w900)),
                      const Text('coins', style: TextStyle(color: CasinoColors.muted, fontSize: 12)),
                    ],
                  ),
                  onTap: () => _showBalanceDialog(context, repository, user),
                ),
              ),
            );
          },
        );
      },
    );
  }

  Future<void> _showBalanceDialog(BuildContext context, UserRepository repository, AppUser user) async {
    final controller = TextEditingController(text: '${user.balance}');
    await showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: Text('Update ${user.displayName}'),
          content: TextField(
            controller: controller,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Virtual coin balance'),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.of(dialogContext).pop(), child: const Text('Cancel')),
            FilledButton(
              onPressed: () async {
                final balance = int.tryParse(controller.text) ?? user.balance;
                await repository.setUserBalance(uid: user.uid, balance: balance);
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

class _AdminRewardsTab extends StatelessWidget {
  const _AdminRewardsTab();

  @override
  Widget build(BuildContext context) {
    final repository = UserRepository();
    return Stack(
      children: [
        StreamBuilder<List<RewardItem>>(
          stream: repository.watchRewards(activeOnly: false),
          builder: (context, snapshot) {
            final rewards = snapshot.data ?? const <RewardItem>[];
            if (rewards.isEmpty) {
              return const Padding(
                padding: EdgeInsets.all(20),
                child: EmptyState(
                  icon: Icons.card_giftcard_rounded,
                  title: 'No rewards',
                  message: 'Create virtual rewards for players to redeem.',
                ),
              );
            }
            return ListView.builder(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 96),
              itemCount: rewards.length,
              itemBuilder: (context, index) {
                final reward = rewards[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: CasinoCard(
                    child: ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(reward.title),
                      subtitle: Text('${reward.description}\n${reward.cost} coins - stock ${reward.stock}'),
                      isThreeLine: true,
                      trailing: Icon(
                        reward.active ? Icons.visibility_rounded : Icons.visibility_off_rounded,
                        color: reward.active ? CasinoColors.emerald : CasinoColors.muted,
                      ),
                      onTap: () => _showRewardDialog(context, repository, reward),
                    ),
                  ),
                );
              },
            );
          },
        ),
        Positioned(
          right: 20,
          bottom: 20,
          child: FloatingActionButton.extended(
            onPressed: () => _showRewardDialog(context, repository, null),
            icon: const Icon(Icons.add_rounded),
            label: const Text('Reward'),
          ),
        ),
      ],
    );
  }

  Future<void> _showRewardDialog(
    BuildContext context,
    UserRepository repository,
    RewardItem? reward,
  ) async {
    final title = TextEditingController(text: reward?.title ?? '');
    final description = TextEditingController(text: reward?.description ?? '');
    final cost = TextEditingController(text: reward == null ? '250' : '${reward.cost}');
    final stock = TextEditingController(text: reward == null ? '-1' : '${reward.stock}');
    var active = reward?.active ?? true;

    await showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: Text(reward == null ? 'Create reward' : 'Edit reward'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(controller: title, decoration: const InputDecoration(labelText: 'Title')),
                    const SizedBox(height: 10),
                    TextField(
                      controller: description,
                      decoration: const InputDecoration(labelText: 'Description'),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: cost,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Cost'),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: stock,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Stock (-1 unlimited)'),
                    ),
                    SwitchListTile.adaptive(
                      value: active,
                      onChanged: (value) => setState(() => active = value),
                      title: const Text('Active'),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.of(dialogContext).pop(), child: const Text('Cancel')),
                FilledButton(
                  onPressed: () async {
                    await repository.saveReward(
                      rewardId: reward?.id,
                      title: title.text,
                      description: description.text,
                      cost: int.tryParse(cost.text) ?? 0,
                      stock: int.tryParse(stock.text) ?? -1,
                      active: active,
                    );
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
      },
    );
    title.dispose();
    description.dispose();
    cost.dispose();
    stock.dispose();
  }
}

class _AdminAnnouncementsTab extends StatelessWidget {
  const _AdminAnnouncementsTab();

  @override
  Widget build(BuildContext context) {
    final repository = UserRepository();
    return Stack(
      children: [
        StreamBuilder<List<Announcement>>(
          stream: repository.watchAnnouncements(activeOnly: false),
          builder: (context, snapshot) {
            final announcements = snapshot.data ?? const <Announcement>[];
            if (announcements.isEmpty) {
              return const Padding(
                padding: EdgeInsets.all(20),
                child: EmptyState(
                  icon: Icons.campaign_rounded,
                  title: 'No announcements',
                  message: 'Create announcement cards for the dashboard.',
                ),
              );
            }
            return ListView.builder(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 96),
              itemCount: announcements.length,
              itemBuilder: (context, index) {
                final announcement = announcements[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: CasinoCard(
                    child: ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(announcement.title),
                      subtitle: Text(announcement.body),
                      trailing: Icon(
                        announcement.active ? Icons.visibility_rounded : Icons.visibility_off_rounded,
                        color: announcement.active ? CasinoColors.emerald : CasinoColors.muted,
                      ),
                      onTap: () => _showAnnouncementDialog(context, repository, announcement),
                    ),
                  ),
                );
              },
            );
          },
        ),
        Positioned(
          right: 20,
          bottom: 20,
          child: FloatingActionButton.extended(
            onPressed: () => _showAnnouncementDialog(context, repository, null),
            icon: const Icon(Icons.add_rounded),
            label: const Text('News'),
          ),
        ),
      ],
    );
  }

  Future<void> _showAnnouncementDialog(
    BuildContext context,
    UserRepository repository,
    Announcement? announcement,
  ) async {
    final title = TextEditingController(text: announcement?.title ?? '');
    final body = TextEditingController(text: announcement?.body ?? '');
    var active = announcement?.active ?? true;

    await showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: Text(announcement == null ? 'Create announcement' : 'Edit announcement'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(controller: title, decoration: const InputDecoration(labelText: 'Title')),
                    const SizedBox(height: 10),
                    TextField(
                      controller: body,
                      minLines: 3,
                      maxLines: 5,
                      decoration: const InputDecoration(labelText: 'Message'),
                    ),
                    SwitchListTile.adaptive(
                      value: active,
                      onChanged: (value) => setState(() => active = value),
                      title: const Text('Active'),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.of(dialogContext).pop(), child: const Text('Cancel')),
                FilledButton(
                  onPressed: () async {
                    await repository.saveAnnouncement(
                      announcementId: announcement?.id,
                      title: title.text,
                      body: body.text,
                      active: active,
                    );
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
      },
    );
    title.dispose();
    body.dispose();
  }
}
