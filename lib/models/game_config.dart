import 'package:cloud_firestore/cloud_firestore.dart';

class GameConfig {
  const GameConfig({
    required this.id,
    required this.title,
    required this.enabled,
    required this.rewardMultiplier,
    required this.difficulty,
    required this.updatedAt,
  });

  final String id;
  final String title;
  final bool enabled;
  final double rewardMultiplier;
  final String difficulty;
  final DateTime updatedAt;

  static final defaults = [
    GameConfig(
      id: 'slot_machine',
      title: 'Slot Machine',
      enabled: true,
      rewardMultiplier: 1,
      difficulty: 'standard',
      updatedAt: _fallbackDate,
    ),
    GameConfig(
      id: 'lucky_wheel',
      title: 'Lucky Wheel',
      enabled: true,
      rewardMultiplier: 1,
      difficulty: 'standard',
      updatedAt: _fallbackDate,
    ),
    GameConfig(
      id: 'card_match',
      title: 'Card Matching Game',
      enabled: true,
      rewardMultiplier: 1,
      difficulty: 'standard',
      updatedAt: _fallbackDate,
    ),
    GameConfig(
      id: 'dice',
      title: 'Dice Game',
      enabled: true,
      rewardMultiplier: 1,
      difficulty: 'standard',
      updatedAt: _fallbackDate,
    ),
    GameConfig(
      id: 'coin_flip',
      title: 'Coin Flip',
      enabled: true,
      rewardMultiplier: 1,
      difficulty: 'standard',
      updatedAt: _fallbackDate,
    ),
  ];

  static final _fallbackDate = DateTime.fromMillisecondsSinceEpoch(0);

  factory GameConfig.fromFirestore(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data() ?? <String, dynamic>{};
    final timestamp = data['updatedAt'];
    return GameConfig(
      id: doc.id,
      title: data['title'] as String? ?? doc.id,
      enabled: data['enabled'] as bool? ?? true,
      rewardMultiplier: (data['rewardMultiplier'] as num?)?.toDouble() ?? 1,
      difficulty: data['difficulty'] as String? ?? 'standard',
      updatedAt: timestamp is Timestamp ? timestamp.toDate() : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'enabled': enabled,
      'rewardMultiplier': rewardMultiplier.clamp(.25, 3),
      'difficulty': difficulty,
      'updatedAt': FieldValue.serverTimestamp(),
    };
  }

  GameConfig copyWith({
    bool? enabled,
    double? rewardMultiplier,
    String? difficulty,
  }) {
    return GameConfig(
      id: id,
      title: title,
      enabled: enabled ?? this.enabled,
      rewardMultiplier: rewardMultiplier ?? this.rewardMultiplier,
      difficulty: difficulty ?? this.difficulty,
      updatedAt: updatedAt,
    );
  }
}
