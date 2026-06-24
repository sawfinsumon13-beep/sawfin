import 'package:cloud_firestore/cloud_firestore.dart';

class AppNotification {
  const AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.audience,
    required this.active,
    required this.createdAt,
  });

  final String id;
  final String title;
  final String body;
  final String audience;
  final bool active;
  final DateTime createdAt;

  factory AppNotification.fromFirestore(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data() ?? <String, dynamic>{};
    final timestamp = data['createdAt'];
    return AppNotification(
      id: doc.id,
      title: data['title'] as String? ?? 'Notification',
      body: data['body'] as String? ?? '',
      audience: data['audience'] as String? ?? 'all',
      active: data['active'] as bool? ?? true,
      createdAt: timestamp is Timestamp ? timestamp.toDate() : DateTime.now(),
    );
  }
}
