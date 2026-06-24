import 'package:flutter/material.dart';

import '../../app/app_theme.dart';
import '../../models/announcement.dart';
import '../../models/app_notification.dart';
import '../../models/banner_item.dart';
import '../../models/game_config.dart';
import '../../models/reward_item.dart';
import '../../services/admin_repository.dart';
import '../../widgets/casino_widgets.dart';

class AdminSettingsScreen extends StatelessWidget {
  const AdminSettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const DefaultTabController(
      length: 4,
      child: Column(
        children: [
          TabBar(
            isScrollable: true,
            tabs: [
              Tab(icon: Icon(Icons.view_carousel_rounded), text: 'Content'),
              Tab(icon: Icon(Icons.notifications_active_rounded), text: 'Notifications'),
              Tab(icon: Icon(Icons.card_giftcard_rounded), text: 'Rewards'),
              Tab(icon: Icon(Icons.sports_esports_rounded), text: 'Games'),
            ],
          ),
          Expanded(
            child: TabBarView(
              children: [
                _ContentTab(),
                _NotificationsTab(),
                _RewardsTab(),
                _GameSettingsTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ContentTab extends StatelessWidget {
  const _ContentTab();

  @override
  Widget build(BuildContext context) {
    final repository = AdminRepository();
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const SectionHeader(title: 'Manage Banners', subtitle: 'Promotional carousel content'),
        const SizedBox(height: 12),
        StreamBuilder<List<BannerItem>>(
          stream: repository.watchBanners(),
          builder: (context, snapshot) {
            final banners = snapshot.data ?? const <BannerItem>[];
            return _AdminListSection(
              empty: const EmptyState(
                icon: Icons.view_carousel_rounded,
                title: 'No banners',
                message: 'Create banners for dashboard promotions.',
              ),
              items: [
                for (final banner in banners)
                  _AdminListTile(
                    icon: Icons.view_carousel_rounded,
                    title: banner.title,
                    subtitle: '${banner.message}\nPriority ${banner.priority} - ${banner.active ? 'Active' : 'Hidden'}',
                    onTap: () => _showBannerDialog(context, repository, banner),
                    onDelete: () => repository.deleteBanner(banner.id),
                  ),
              ],
            );
          },
        ),
        const SizedBox(height: 8),
        FilledButton.icon(
          onPressed: () => _showBannerDialog(context, repository, null),
          icon: const Icon(Icons.add_rounded),
          label: const Text('Create banner'),
        ),
        const SizedBox(height: 24),
        const SectionHeader(title: 'Manage Announcements', subtitle: 'Dashboard announcements'),
        const SizedBox(height: 12),
        StreamBuilder<List<Announcement>>(
          stream: repository.watchAnnouncements(),
          builder: (context, snapshot) {
            final announcements = snapshot.data ?? const <Announcement>[];
            return _AdminListSection(
              empty: const EmptyState(
                icon: Icons.campaign_rounded,
                title: 'No announcements',
                message: 'Create announcements for player dashboards.',
              ),
              items: [
                for (final announcement in announcements)
                  _AdminListTile(
                    icon: Icons.campaign_rounded,
                    title: announcement.title,
                    subtitle: '${announcement.body}\n${announcement.active ? 'Active' : 'Hidden'}',
                    onTap: () => _showAnnouncementDialog(context, repository, announcement),
                    onDelete: () => repository.deleteAnnouncement(announcement.id),
                  ),
              ],
            );
          },
        ),
        const SizedBox(height: 8),
        FilledButton.icon(
          onPressed: () => _showAnnouncementDialog(context, repository, null),
          icon: const Icon(Icons.add_rounded),
          label: const Text('Create announcement'),
        ),
      ],
    );
  }
}

class _NotificationsTab extends StatelessWidget {
  const _NotificationsTab();

  @override
  Widget build(BuildContext context) {
    final repository = AdminRepository();
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const SectionHeader(title: 'Manage Notifications', subtitle: 'In-app notification records'),
        const SizedBox(height: 12),
        StreamBuilder<List<AppNotification>>(
          stream: repository.watchNotifications(),
          builder: (context, snapshot) {
            final notifications = snapshot.data ?? const <AppNotification>[];
            return _AdminListSection(
              empty: const EmptyState(
                icon: Icons.notifications_active_rounded,
                title: 'No notifications',
                message: 'Create notification records for players.',
              ),
              items: [
                for (final notification in notifications)
                  _AdminListTile(
                    icon: Icons.notifications_active_rounded,
                    title: notification.title,
                    subtitle:
                        '${notification.body}\nAudience: ${notification.audience} - ${notification.active ? 'Active' : 'Hidden'}',
                    onTap: () => _showNotificationDialog(context, repository, notification),
                    onDelete: () => repository.deleteNotification(notification.id),
                  ),
              ],
            );
          },
        ),
        const SizedBox(height: 8),
        FilledButton.icon(
          onPressed: () => _showNotificationDialog(context, repository, null),
          icon: const Icon(Icons.add_rounded),
          label: const Text('Create notification'),
        ),
      ],
    );
  }
}

class _RewardsTab extends StatelessWidget {
  const _RewardsTab();

  @override
  Widget build(BuildContext context) {
    final repository = AdminRepository();
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const SectionHeader(title: 'Configure Rewards', subtitle: 'Virtual rewards only'),
        const SizedBox(height: 12),
        StreamBuilder<List<RewardItem>>(
          stream: repository.watchRewards(),
          builder: (context, snapshot) {
            final rewards = snapshot.data ?? const <RewardItem>[];
            return _AdminListSection(
              empty: const EmptyState(
                icon: Icons.card_giftcard_rounded,
                title: 'No rewards',
                message: 'Create virtual reward items for redemption.',
              ),
              items: [
                for (final reward in rewards)
                  _AdminListTile(
                    icon: Icons.workspace_premium_rounded,
                    title: reward.title,
                    subtitle:
                        '${reward.description}\n${reward.cost} coins - stock ${reward.stock} - ${reward.active ? 'Active' : 'Hidden'}',
                    onTap: () => _showRewardDialog(context, repository, reward),
                    onDelete: () => repository.deleteReward(reward.id),
                  ),
              ],
            );
          },
        ),
        const SizedBox(height: 8),
        FilledButton.icon(
          onPressed: () => _showRewardDialog(context, repository, null),
          icon: const Icon(Icons.add_rounded),
          label: const Text('Create reward'),
        ),
      ],
    );
  }
}

class _GameSettingsTab extends StatelessWidget {
  const _GameSettingsTab();

  @override
  Widget build(BuildContext context) {
    final repository = AdminRepository();
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const SectionHeader(
          title: 'Game Settings',
          subtitle: 'Enable games, configure reward multipliers, and set difficulty',
        ),
        const SizedBox(height: 12),
        StreamBuilder<List<GameConfig>>(
          stream: repository.watchGameConfigs(),
          builder: (context, snapshot) {
            final configs = snapshot.data ?? GameConfig.defaults;
            return Column(
              children: [
                for (final config in configs)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: CasinoCard(
                      child: ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: Icon(
                          config.enabled ? Icons.play_circle_fill_rounded : Icons.pause_circle_filled_rounded,
                          color: config.enabled ? CasinoColors.emerald : CasinoColors.gold,
                        ),
                        title: Text(config.title, style: const TextStyle(fontWeight: FontWeight.w900)),
                        subtitle: Text(
                          'Difficulty: ${config.difficulty} - Reward x${config.rewardMultiplier.toStringAsFixed(2)}',
                        ),
                        trailing: Switch.adaptive(
                          value: config.enabled,
                          onChanged: (value) => repository.saveGameConfig(config.copyWith(enabled: value)),
                        ),
                        onTap: () => _showGameConfigDialog(context, repository, config),
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
      ],
    );
  }
}

class _AdminListSection extends StatelessWidget {
  const _AdminListSection({required this.empty, required this.items});

  final Widget empty;
  final List<Widget> items;

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return empty;
    }
    return Column(children: items);
  }
}

class _AdminListTile extends StatelessWidget {
  const _AdminListTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    required this.onDelete,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final VoidCallback onDelete;

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
          onTap: onTap,
          trailing: IconButton(
            onPressed: onDelete,
            icon: const Icon(Icons.delete_rounded),
            tooltip: 'Delete',
          ),
        ),
      ),
    );
  }
}

Future<void> _showBannerDialog(BuildContext context, AdminRepository repository, BannerItem? banner) async {
  final title = TextEditingController(text: banner?.title ?? '');
  final message = TextEditingController(text: banner?.message ?? '');
  final imageUrl = TextEditingController(text: banner?.imageUrl ?? '');
  final actionLabel = TextEditingController(text: banner?.actionLabel ?? 'Play now');
  final priority = TextEditingController(text: banner == null ? '0' : '${banner.priority}');
  var active = banner?.active ?? true;

  await _showAdminDialog(
    context: context,
    title: banner == null ? 'Create banner' : 'Edit banner',
    fields: [
      TextField(controller: title, decoration: const InputDecoration(labelText: 'Title')),
      TextField(controller: message, decoration: const InputDecoration(labelText: 'Message')),
      TextField(controller: imageUrl, decoration: const InputDecoration(labelText: 'Image URL')),
      TextField(controller: actionLabel, decoration: const InputDecoration(labelText: 'Action label')),
      TextField(
        controller: priority,
        keyboardType: TextInputType.number,
        decoration: const InputDecoration(labelText: 'Priority'),
      ),
    ],
    active: active,
    onActiveChanged: (value) => active = value,
    onSave: () => repository.saveBanner(
      bannerId: banner?.id,
      title: title.text,
      message: message.text,
      imageUrl: imageUrl.text,
      actionLabel: actionLabel.text,
      priority: int.tryParse(priority.text) ?? 0,
      active: active,
    ),
  );
  title.dispose();
  message.dispose();
  imageUrl.dispose();
  actionLabel.dispose();
  priority.dispose();
}

Future<void> _showAnnouncementDialog(
  BuildContext context,
  AdminRepository repository,
  Announcement? announcement,
) async {
  final title = TextEditingController(text: announcement?.title ?? '');
  final body = TextEditingController(text: announcement?.body ?? '');
  var active = announcement?.active ?? true;

  await _showAdminDialog(
    context: context,
    title: announcement == null ? 'Create announcement' : 'Edit announcement',
    fields: [
      TextField(controller: title, decoration: const InputDecoration(labelText: 'Title')),
      TextField(
        controller: body,
        minLines: 3,
        maxLines: 5,
        decoration: const InputDecoration(labelText: 'Message'),
      ),
    ],
    active: active,
    onActiveChanged: (value) => active = value,
    onSave: () => repository.saveAnnouncement(
      announcementId: announcement?.id,
      title: title.text,
      body: body.text,
      active: active,
    ),
  );
  title.dispose();
  body.dispose();
}

Future<void> _showNotificationDialog(
  BuildContext context,
  AdminRepository repository,
  AppNotification? notification,
) async {
  final title = TextEditingController(text: notification?.title ?? '');
  final body = TextEditingController(text: notification?.body ?? '');
  var audience = notification?.audience ?? 'all';
  var active = notification?.active ?? true;

  await showDialog<void>(
    context: context,
    builder: (dialogContext) {
      return StatefulBuilder(
        builder: (context, setState) {
          return AlertDialog(
            title: Text(notification == null ? 'Create notification' : 'Edit notification'),
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
                    decoration: const InputDecoration(labelText: 'Body'),
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    value: audience,
                    decoration: const InputDecoration(labelText: 'Audience'),
                    items: const [
                      DropdownMenuItem(value: 'all', child: Text('All users')),
                      DropdownMenuItem(value: 'active', child: Text('Active users')),
                      DropdownMenuItem(value: 'admins', child: Text('Admins')),
                    ],
                    onChanged: (value) => setState(() => audience = value ?? audience),
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
                  await repository.saveNotification(
                    notificationId: notification?.id,
                    title: title.text,
                    body: body.text,
                    audience: audience,
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

Future<void> _showRewardDialog(BuildContext context, AdminRepository repository, RewardItem? reward) async {
  final title = TextEditingController(text: reward?.title ?? '');
  final description = TextEditingController(text: reward?.description ?? '');
  final cost = TextEditingController(text: reward == null ? '250' : '${reward.cost}');
  final stock = TextEditingController(text: reward == null ? '-1' : '${reward.stock}');
  var active = reward?.active ?? true;

  await _showAdminDialog(
    context: context,
    title: reward == null ? 'Create reward' : 'Edit reward',
    fields: [
      TextField(controller: title, decoration: const InputDecoration(labelText: 'Title')),
      TextField(controller: description, decoration: const InputDecoration(labelText: 'Description')),
      TextField(
        controller: cost,
        keyboardType: TextInputType.number,
        decoration: const InputDecoration(labelText: 'Cost'),
      ),
      TextField(
        controller: stock,
        keyboardType: TextInputType.number,
        decoration: const InputDecoration(labelText: 'Stock (-1 unlimited)'),
      ),
    ],
    active: active,
    onActiveChanged: (value) => active = value,
    onSave: () => repository.saveReward(
      rewardId: reward?.id,
      title: title.text,
      description: description.text,
      cost: int.tryParse(cost.text) ?? 0,
      stock: int.tryParse(stock.text) ?? -1,
      active: active,
    ),
  );
  title.dispose();
  description.dispose();
  cost.dispose();
  stock.dispose();
}

Future<void> _showGameConfigDialog(
  BuildContext context,
  AdminRepository repository,
  GameConfig config,
) async {
  var enabled = config.enabled;
  var difficulty = config.difficulty;
  var multiplier = config.rewardMultiplier;

  await showDialog<void>(
    context: context,
    builder: (dialogContext) {
      return StatefulBuilder(
        builder: (context, setState) {
          return AlertDialog(
            title: Text(config.title),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SwitchListTile.adaptive(
                  value: enabled,
                  onChanged: (value) => setState(() => enabled = value),
                  title: const Text('Game enabled'),
                ),
                DropdownButtonFormField<String>(
                  value: difficulty,
                  decoration: const InputDecoration(labelText: 'Difficulty'),
                  items: const [
                    DropdownMenuItem(value: 'easy', child: Text('Easy')),
                    DropdownMenuItem(value: 'standard', child: Text('Standard')),
                    DropdownMenuItem(value: 'hard', child: Text('Hard')),
                    DropdownMenuItem(value: 'expert', child: Text('Expert')),
                  ],
                  onChanged: (value) => setState(() => difficulty = value ?? difficulty),
                ),
                const SizedBox(height: 12),
                Text('Reward multiplier: x${multiplier.toStringAsFixed(2)}'),
                Slider(
                  min: .25,
                  max: 3,
                  divisions: 11,
                  value: multiplier.clamp(.25, 3).toDouble(),
                  label: 'x${multiplier.toStringAsFixed(2)}',
                  onChanged: (value) => setState(() => multiplier = value),
                ),
              ],
            ),
            actions: [
              TextButton(onPressed: () => Navigator.of(dialogContext).pop(), child: const Text('Cancel')),
              FilledButton(
                onPressed: () async {
                  await repository.saveGameConfig(
                    config.copyWith(
                      enabled: enabled,
                      rewardMultiplier: multiplier,
                      difficulty: difficulty,
                    ),
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
}

Future<void> _showAdminDialog({
  required BuildContext context,
  required String title,
  required List<Widget> fields,
  required bool active,
  required ValueChanged<bool> onActiveChanged,
  required Future<void> Function() onSave,
}) {
  var isActive = active;
  return showDialog<void>(
    context: context,
    builder: (dialogContext) {
      return StatefulBuilder(
        builder: (context, setState) {
          return AlertDialog(
            title: Text(title),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  for (final field in fields) ...[
                    field,
                    const SizedBox(height: 10),
                  ],
                  SwitchListTile.adaptive(
                    value: isActive,
                    onChanged: (value) {
                      setState(() => isActive = value);
                      onActiveChanged(value);
                    },
                    title: const Text('Active'),
                  ),
                ],
              ),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.of(dialogContext).pop(), child: const Text('Cancel')),
              FilledButton(
                onPressed: () async {
                  await onSave();
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
}
