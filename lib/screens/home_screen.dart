import 'package:flutter/material.dart';

import '../app/app_theme.dart';
import '../models/announcement.dart';
import '../models/app_user.dart';
import '../services/user_repository.dart';
import '../widgets/casino_widgets.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({
    required this.user,
    required this.onOpenGames,
    super.key,
  });

  final AppUser user;
  final VoidCallback onOpenGames;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _repository = UserRepository();
  var _claiming = false;

  Future<void> _claimDailyBonus() async {
    setState(() => _claiming = true);
    try {
      final amount = await _repository.claimDailyBonus(widget.user.uid);
      _message('Daily bonus claimed: +$amount demo coins');
    } catch (error) {
      _message(error.toString());
    } finally {
      if (mounted) {
        setState(() => _claiming = false);
      }
    }
  }

  void _message(String text) {
    if (!mounted) {
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(text), behavior: SnackBarBehavior.floating),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = widget.user;
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Hi, ${user.displayName}',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
                  ),
                  Text(user.rank, style: const TextStyle(color: CasinoColors.gold)),
                ],
              ),
            ),
            CoinBadge(balance: user.balance),
          ],
        ),
        const SizedBox(height: 18),
        const DemoOnlyBanner(),
        const SizedBox(height: 18),
        CasinoCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Daily Bonus',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 8),
              Text(
                user.canClaimDailyBonus
                    ? 'Your next virtual coin reward is ready.'
                    : 'Come back later to keep your streak alive.',
                style: const TextStyle(color: CasinoColors.muted),
              ),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: user.canClaimDailyBonus && !_claiming ? _claimDailyBonus : null,
                icon: _claiming
                    ? const SizedBox.square(
                        dimension: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.bolt_rounded),
                label: Text('Claim streak ${user.dailyStreak + 1}'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 22),
        const SectionHeader(
          title: 'Casino Lounge',
          subtitle: 'Five fast play-money mini games',
        ),
        const SizedBox(height: 12),
        LayoutBuilder(
          builder: (context, constraints) {
            final compact = constraints.maxWidth < 620;
            return Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                _FeatureTile(
                  icon: Icons.casino_rounded,
                  title: 'Slots',
                  subtitle: 'Triple 777 jackpot',
                  compact: compact,
                  onTap: widget.onOpenGames,
                ),
                _FeatureTile(
                  icon: Icons.track_changes_rounded,
                  title: 'Lucky Wheel',
                  subtitle: 'Spin for prizes',
                  compact: compact,
                  onTap: widget.onOpenGames,
                ),
                _FeatureTile(
                  icon: Icons.style_rounded,
                  title: 'Card Match',
                  subtitle: 'Memory rewards',
                  compact: compact,
                  onTap: widget.onOpenGames,
                ),
              ],
            );
          },
        ),
        const SizedBox(height: 22),
        const SectionHeader(title: 'Announcements'),
        const SizedBox(height: 12),
        StreamBuilder<List<Announcement>>(
          stream: _repository.watchAnnouncements(),
          builder: (context, snapshot) {
            final announcements = snapshot.data ?? const <Announcement>[];
            if (announcements.isEmpty) {
              return const EmptyState(
                icon: Icons.campaign_rounded,
                title: 'No announcements',
                message: 'Admin announcements will appear here.',
              );
            }
            return Column(
              children: announcements.take(3).map((announcement) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: CasinoCard(
                    child: Row(
                      children: [
                        const Icon(Icons.campaign_rounded, color: CasinoColors.gold),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                announcement.title,
                                style: const TextStyle(fontWeight: FontWeight.w800),
                              ),
                              Text(
                                announcement.body,
                                style: const TextStyle(color: CasinoColors.muted),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }
}

class _FeatureTile extends StatelessWidget {
  const _FeatureTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.compact,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final bool compact;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: compact ? double.infinity : 180,
      child: CasinoCard(
        onTap: onTap,
        child: Row(
          children: [
            Icon(icon, color: CasinoColors.gold, size: 30),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
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
