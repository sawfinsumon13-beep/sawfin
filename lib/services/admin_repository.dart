import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../models/admin_activity_log.dart';
import '../models/announcement.dart';
import '../models/app_notification.dart';
import '../models/app_user.dart';
import '../models/banner_item.dart';
import '../models/game_config.dart';
import '../models/reward_item.dart';

class AdminRepository {
  AdminRepository({
    FirebaseFirestore? firestore,
    FirebaseAuth? auth,
  })  : _db = firestore ?? FirebaseFirestore.instance,
        _auth = auth ?? FirebaseAuth.instance;

  final FirebaseFirestore _db;
  final FirebaseAuth _auth;

  Stream<List<AppUser>> watchUsers() {
    return _db.collection('users').orderBy('createdAt', descending: true).limit(500).snapshots().map((snapshot) {
      return snapshot.docs.map(AppUser.fromFirestore).toList();
    });
  }

  Stream<List<Map<String, dynamic>>> watchGameSessions({int limit = 300}) {
    return _db.collection('gameSessions').orderBy('createdAt', descending: true).limit(limit).snapshots().map(_docsToMaps);
  }

  Stream<List<Map<String, dynamic>>> watchCoinLedger({int limit = 300}) {
    return _db.collection('coinLedger').orderBy('createdAt', descending: true).limit(limit).snapshots().map(_docsToMaps);
  }

  Stream<List<Map<String, dynamic>>> watchRewardRedemptions({int limit = 300}) {
    return _db
        .collection('rewardRedemptions')
        .orderBy('createdAt', descending: true)
        .limit(limit)
        .snapshots()
        .map(_docsToMaps);
  }

  Stream<List<AdminActivityLog>> watchAdminLogs({int limit = 100}) {
    return _db.collection('adminActivityLogs').orderBy('createdAt', descending: true).limit(limit).snapshots().map((snapshot) {
      return snapshot.docs.map(AdminActivityLog.fromFirestore).toList();
    });
  }

  Stream<List<BannerItem>> watchBanners() {
    return _db.collection('banners').snapshots().map((snapshot) {
      final banners = snapshot.docs.map(BannerItem.fromFirestore).toList();
      banners.sort((a, b) => b.priority.compareTo(a.priority));
      return banners;
    });
  }

  Stream<List<AppNotification>> watchNotifications() {
    return _db.collection('notifications').snapshots().map((snapshot) {
      final notifications = snapshot.docs.map(AppNotification.fromFirestore).toList();
      notifications.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      return notifications;
    });
  }

  Stream<List<Announcement>> watchAnnouncements() {
    return _db.collection('announcements').snapshots().map((snapshot) {
      final announcements = snapshot.docs.map(Announcement.fromFirestore).toList();
      announcements.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      return announcements;
    });
  }

  Stream<List<RewardItem>> watchRewards() {
    return _db.collection('rewards').snapshots().map((snapshot) {
      final rewards = snapshot.docs.map(RewardItem.fromFirestore).toList();
      rewards.sort((a, b) => a.cost.compareTo(b.cost));
      return rewards;
    });
  }

  Stream<List<GameConfig>> watchGameConfigs() {
    return _db.collection('gameConfigs').snapshots().map((snapshot) {
      final configs = {for (final config in GameConfig.defaults) config.id: config};
      for (final doc in snapshot.docs) {
        configs[doc.id] = GameConfig.fromFirestore(doc);
      }
      return configs.values.toList();
    });
  }

  Future<void> updateUserProfile({
    required AppUser user,
    required String displayName,
    required int balance,
    required String role,
    required String status,
  }) async {
    await _db.collection('users').doc(user.uid).set(
      {
        'displayName': displayName.trim(),
        'balance': balance < 0 ? 0 : balance,
        'role': role,
        'status': status,
        'updatedAt': FieldValue.serverTimestamp(),
      },
      SetOptions(merge: true),
    );
    await logAction(
      action: 'edit_user_profile',
      target: 'users/${user.uid}',
      details: {'displayName': displayName, 'role': role, 'status': status},
    );
  }

  Future<void> setUserStatus(AppUser user, String status) async {
    await _db.collection('users').doc(user.uid).set(
      {
        'status': status,
        'deletedAt': status == 'deleted' ? FieldValue.serverTimestamp() : null,
        'updatedAt': FieldValue.serverTimestamp(),
      },
      SetOptions(merge: true),
    );
    await logAction(action: '${status}_user', target: 'users/${user.uid}');
  }

  Future<void> saveBanner({
    String? bannerId,
    required String title,
    required String message,
    required String imageUrl,
    required String actionLabel,
    required int priority,
    required bool active,
  }) async {
    final ref = bannerId == null || bannerId.isEmpty ? _db.collection('banners').doc() : _db.collection('banners').doc(bannerId);
    await ref.set(
      {
        'title': title.trim(),
        'message': message.trim(),
        'imageUrl': imageUrl.trim(),
        'actionLabel': actionLabel.trim(),
        'priority': priority,
        'active': active,
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      },
      SetOptions(merge: true),
    );
    await logAction(action: bannerId == null ? 'create_banner' : 'update_banner', target: 'banners/${ref.id}');
  }

  Future<void> deleteBanner(String bannerId) async {
    await _db.collection('banners').doc(bannerId).delete();
    await logAction(action: 'delete_banner', target: 'banners/$bannerId');
  }

  Future<void> deleteAnnouncement(String announcementId) async {
    await _db.collection('announcements').doc(announcementId).delete();
    await logAction(action: 'delete_announcement', target: 'announcements/$announcementId');
  }

  Future<void> saveAnnouncement({
    String? announcementId,
    required String title,
    required String body,
    required bool active,
  }) async {
    final ref = announcementId == null || announcementId.isEmpty
        ? _db.collection('announcements').doc()
        : _db.collection('announcements').doc(announcementId);
    await ref.set(
      {
        'title': title.trim(),
        'body': body.trim(),
        'active': active,
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      },
      SetOptions(merge: true),
    );
    await logAction(
      action: announcementId == null ? 'create_announcement' : 'update_announcement',
      target: 'announcements/${ref.id}',
    );
  }

  Future<void> saveNotification({
    String? notificationId,
    required String title,
    required String body,
    required String audience,
    required bool active,
  }) async {
    final ref = notificationId == null || notificationId.isEmpty
        ? _db.collection('notifications').doc()
        : _db.collection('notifications').doc(notificationId);
    await ref.set(
      {
        'title': title.trim(),
        'body': body.trim(),
        'audience': audience,
        'active': active,
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      },
      SetOptions(merge: true),
    );
    await logAction(
      action: notificationId == null ? 'create_notification' : 'update_notification',
      target: 'notifications/${ref.id}',
    );
  }

  Future<void> deleteNotification(String notificationId) async {
    await _db.collection('notifications').doc(notificationId).delete();
    await logAction(action: 'delete_notification', target: 'notifications/$notificationId');
  }

  Future<void> deleteReward(String rewardId) async {
    await _db.collection('rewards').doc(rewardId).delete();
    await logAction(action: 'delete_reward', target: 'rewards/$rewardId');
  }

  Future<void> saveReward({
    String? rewardId,
    required String title,
    required String description,
    required int cost,
    required int stock,
    required bool active,
  }) async {
    final ref = rewardId == null || rewardId.isEmpty ? _db.collection('rewards').doc() : _db.collection('rewards').doc(rewardId);
    await ref.set(
      {
        'title': title.trim(),
        'description': description.trim(),
        'cost': cost < 0 ? 0 : cost,
        'stock': stock,
        'active': active,
        'updatedAt': FieldValue.serverTimestamp(),
      },
      SetOptions(merge: true),
    );
    await logAction(action: rewardId == null ? 'create_reward' : 'update_reward', target: 'rewards/${ref.id}');
  }

  Future<void> saveGameConfig(GameConfig config) async {
    await _db.collection('gameConfigs').doc(config.id).set(config.toMap(), SetOptions(merge: true));
    await logAction(
      action: 'update_game_settings',
      target: 'gameConfigs/${config.id}',
      details: {
        'enabled': config.enabled,
        'rewardMultiplier': config.rewardMultiplier,
        'difficulty': config.difficulty,
      },
    );
  }

  Future<void> logAction({
    required String action,
    required String target,
    Map<String, dynamic> details = const {},
  }) {
    final user = _auth.currentUser;
    return _db.collection('adminActivityLogs').add({
      'adminUid': user?.uid ?? 'unknown',
      'adminEmail': user?.email ?? 'unknown',
      'action': action,
      'target': target,
      'details': details,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  List<Map<String, dynamic>> _docsToMaps(QuerySnapshot<Map<String, dynamic>> snapshot) {
    return snapshot.docs.map((doc) => {'id': doc.id, ...doc.data()}).toList();
  }
}
