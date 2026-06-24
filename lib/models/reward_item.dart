import 'package:cloud_firestore/cloud_firestore.dart';

class RewardItem {
  const RewardItem({
    required this.id,
    required this.title,
    required this.description,
    required this.cost,
    required this.stock,
    required this.active,
  });

  final String id;
  final String title;
  final String description;
  final int cost;
  final int stock;
  final bool active;

  bool get isAvailable => active && stock != 0;

  factory RewardItem.fromFirestore(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data() ?? <String, dynamic>{};
    return RewardItem(
      id: doc.id,
      title: data['title'] as String? ?? 'Mystery Reward',
      description: data['description'] as String? ?? '',
      cost: (data['cost'] as num?)?.toInt() ?? 0,
      stock: (data['stock'] as num?)?.toInt() ?? -1,
      active: data['active'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'description': description,
      'cost': cost,
      'stock': stock,
      'active': active,
      'updatedAt': FieldValue.serverTimestamp(),
    };
  }
}
