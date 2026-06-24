import 'package:cloud_firestore/cloud_firestore.dart';

class AdminActivityLog {
  const AdminActivityLog({
    required this.id,
    required this.adminUid,
    required this.adminEmail,
    required this.action,
    required this.target,
    required this.createdAt,
    this.details = const {},
  });

  final String id;
  final String adminUid;
  final String adminEmail;
  final String action;
  final String target;
  final DateTime createdAt;
  final Map<String, dynamic> details;

  factory AdminActivityLog.fromFirestore(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data() ?? <String, dynamic>{};
    final timestamp = data['createdAt'];
    return AdminActivityLog(
      id: doc.id,
      adminUid: data['adminUid'] as String? ?? '',
      adminEmail: data['adminEmail'] as String? ?? '',
      action: data['action'] as String? ?? 'admin_action',
      target: data['target'] as String? ?? '',
      createdAt: timestamp is Timestamp ? timestamp.toDate() : DateTime.now(),
      details: Map<String, dynamic>.from(data['details'] as Map? ?? const {}),
    );
  }
}
