import 'package:cloud_firestore/cloud_firestore.dart';

class BannerItem {
  const BannerItem({
    required this.id,
    required this.title,
    required this.message,
    required this.imageUrl,
    required this.actionLabel,
    required this.active,
    required this.priority,
    required this.createdAt,
  });

  final String id;
  final String title;
  final String message;
  final String imageUrl;
  final String actionLabel;
  final bool active;
  final int priority;
  final DateTime createdAt;

  factory BannerItem.fromFirestore(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data() ?? <String, dynamic>{};
    final timestamp = data['createdAt'];
    return BannerItem(
      id: doc.id,
      title: data['title'] as String? ?? 'Banner',
      message: data['message'] as String? ?? '',
      imageUrl: data['imageUrl'] as String? ?? '',
      actionLabel: data['actionLabel'] as String? ?? 'Play now',
      active: data['active'] as bool? ?? true,
      priority: (data['priority'] as num?)?.toInt() ?? 0,
      createdAt: timestamp is Timestamp ? timestamp.toDate() : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'message': message,
      'imageUrl': imageUrl,
      'actionLabel': actionLabel,
      'active': active,
      'priority': priority,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': FieldValue.serverTimestamp(),
    };
  }
}
