import 'package:cloud_firestore/cloud_firestore.dart';

class Announcement {
  const Announcement({
    required this.id,
    required this.title,
    required this.body,
    required this.active,
    required this.createdAt,
  });

  final String id;
  final String title;
  final String body;
  final bool active;
  final DateTime createdAt;

  factory Announcement.fromFirestore(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data() ?? <String, dynamic>{};
    final timestamp = data['createdAt'];
    return Announcement(
      id: doc.id,
      title: data['title'] as String? ?? 'Announcement',
      body: data['body'] as String? ?? '',
      active: data['active'] as bool? ?? true,
      createdAt: timestamp is Timestamp ? timestamp.toDate() : DateTime.now(),
    );
  }
}
