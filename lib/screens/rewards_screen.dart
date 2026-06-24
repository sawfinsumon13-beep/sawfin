import 'package:flutter/material.dart';

import '../app/app_theme.dart';
import '../models/app_user.dart';
import '../models/reward_item.dart';
import '../services/user_repository.dart';
import '../widgets/casino_widgets.dart';

class RewardsScreen extends StatefulWidget {
  const RewardsScreen({required this.user, super.key});

  final AppUser user;

  @override
  State<RewardsScreen> createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen> {
  final _repository = UserRepository();
  String? _busyRewardId;

  Future<void> _redeem(RewardItem reward) async {
    setState(() => _busyRewardId = reward.id);
    try {
      await _repository.redeemReward(uid: widget.user.uid, reward: reward);
      _message('Reward redemption requested. Admin will review it.');
    } catch (error) {
      _message(error.toString());
    } finally {
      if (mounted) {
        setState(() => _busyRewardId = null);
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
            CoinBadge(balance: widget.user.balance),
          ],
        ),
        const SizedBox(height: 12),
        const DemoOnlyBanner(),
        const SizedBox(height: 20),
        StreamBuilder<List<RewardItem>>(
          stream: _repository.watchRewards(),
          builder: (context, snapshot) {
            final rewards = snapshot.data ?? const <RewardItem>[];
            if (snapshot.connectionState == ConnectionState.waiting && rewards.isEmpty) {
              return const Center(child: CircularProgressIndicator());
            }
            if (rewards.isEmpty) {
              return const EmptyState(
                icon: Icons.card_giftcard_rounded,
                title: 'No virtual rewards yet',
                message: 'Admins can add badges, boosters, and other virtual rewards.',
              );
            }
            return Column(
              children: rewards.map((reward) {
                final affordable = widget.user.balance >= reward.cost;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: CasinoCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: CasinoColors.gold.withValues(alpha: .12),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Icon(Icons.workspace_premium_rounded, color: CasinoColors.gold),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(reward.title, style: const TextStyle(fontWeight: FontWeight.w900)),
                                  Text(reward.description, style: const TextStyle(color: CasinoColors.muted)),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            CoinBadge(balance: reward.cost),
                            const SizedBox(width: 10),
                            Text(
                              reward.stock < 0 ? 'Unlimited' : '${reward.stock} left',
                              style: const TextStyle(color: CasinoColors.muted),
                            ),
                            const Spacer(),
                            FilledButton(
                              onPressed: affordable && reward.isAvailable && _busyRewardId == null
                                  ? () => _redeem(reward)
                                  : null,
                              child: _busyRewardId == reward.id
                                  ? const SizedBox.square(
                                      dimension: 18,
                                      child: CircularProgressIndicator(strokeWidth: 2),
                                    )
                                  : const Text('Redeem'),
                            ),
                          ],
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
