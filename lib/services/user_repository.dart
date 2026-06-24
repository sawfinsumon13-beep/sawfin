import 'dart:math';

import 'package:cloud_firestore/cloud_firestore.dart';

import '../models/announcement.dart';
import '../models/app_user.dart';
import '../models/reward_item.dart';
import 'game_service.dart';

class UserRepository {
  UserRepository({FirebaseFirestore? firestore}) : _db = firestore ?? FirebaseFirestore.instance;

  final FirebaseFirestore _db;

  DocumentReference<Map<String, dynamic>> userRef(String uid) => _db.collection('users').doc(uid);

  Stream<AppUser> watchUser(String uid) {
    return userRef(uid).snapshots().map(AppUser.fromFirestore);
  }

  Stream<List<AppUser>> watchLeaderboard() {
    return _db
        .collection('users')
        .orderBy('xp', descending: true)
        .limit(50)
        .snapshots()
        .map((snapshot) => snapshot.docs.map(AppUser.fromFirestore).toList());
  }

  Stream<List<AppUser>> watchUsersForAdmin() {
    return _db
        .collection('users')
        .orderBy('createdAt', descending: true)
        .limit(100)
        .snapshots()
        .map((snapshot) => snapshot.docs.map(AppUser.fromFirestore).toList());
  }

  Stream<List<RewardItem>> watchRewards({bool activeOnly = true}) {
    Query<Map<String, dynamic>> query = _db.collection('rewards');
    if (activeOnly) {
      query = query.where('active', isEqualTo: true);
    }
    return query.snapshots().map((snapshot) {
      final rewards = snapshot.docs.map(RewardItem.fromFirestore).toList();
      rewards.sort((a, b) => a.cost.compareTo(b.cost));
      return rewards;
    });
  }

  Stream<List<Announcement>> watchAnnouncements({bool activeOnly = true}) {
    Query<Map<String, dynamic>> query = _db.collection('announcements');
    if (activeOnly) {
      query = query.where('active', isEqualTo: true);
    }
    return query.snapshots().map((snapshot) {
      final announcements = snapshot.docs.map(Announcement.fromFirestore).toList();
      announcements.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      return announcements;
    });
  }

  Future<void> createPlayerProfile({
    required String uid,
    required String email,
    required String displayName,
  }) {
    return userRef(uid).set(
      {
        'email': email,
        'displayName': displayName,
        'photoUrl': null,
        'balance': 777,
        'xp': 0,
        'dailyStreak': 0,
        'achievements': <String>[],
        'role': 'player',
        'createdAt': FieldValue.serverTimestamp(),
        'lastBonusAt': null,
      },
      SetOptions(merge: true),
    );
  }

  Future<int> claimDailyBonus(String uid) async {
    return _db.runTransaction((transaction) async {
      final snapshot = await transaction.get(userRef(uid));
      final user = AppUser.fromFirestore(snapshot);
      if (!user.canClaimDailyBonus) {
        throw StateError('Daily bonus is already claimed.');
      }

      final now = DateTime.now();
      final continuesStreak = user.lastBonusAt != null && now.difference(user.lastBonusAt!).inHours < 48;
      final streak = continuesStreak ? user.dailyStreak + 1 : 1;
      final amount = min(1000, 200 + streak * 25);
      transaction.update(snapshot.reference, {
        'balance': FieldValue.increment(amount),
        'xp': FieldValue.increment(20),
        'dailyStreak': streak,
        'lastBonusAt': Timestamp.fromDate(now),
        'achievements': FieldValue.arrayUnion(['daily_bonus']),
      });
      _writeLedger(transaction, uid, amount, 'daily_bonus', 'Daily bonus streak $streak');
      return amount;
    });
  }

  Future<void> recordGameOutcome({
    required String uid,
    required String gameId,
    required GameOutcome outcome,
  }) async {
    await _db.runTransaction((transaction) async {
      final ref = userRef(uid);
      final snapshot = await transaction.get(ref);
      final balance = (snapshot.data()?['balance'] as num?)?.toInt() ?? 0;
      final nextBalance = max(0, balance + outcome.coinDelta);
      final data = <String, dynamic>{
        'balance': nextBalance,
        'xp': FieldValue.increment(outcome.xp),
        'updatedAt': FieldValue.serverTimestamp(),
      };
      if (outcome.achievement != null) {
        data['achievements'] = FieldValue.arrayUnion([outcome.achievement]);
      }
      transaction.update(ref, data);
      transaction.set(_db.collection('gameSessions').doc(), {
        'uid': uid,
        'gameId': gameId,
        'title': outcome.title,
        'coinDelta': outcome.coinDelta,
        'xp': outcome.xp,
        'symbols': outcome.symbols,
        'createdAt': FieldValue.serverTimestamp(),
      });
      _writeLedger(transaction, uid, outcome.coinDelta, gameId, outcome.title);
    });
  }

  Future<void> redeemReward({
    required String uid,
    required RewardItem reward,
  }) async {
    await _db.runTransaction((transaction) async {
      final userSnapshot = await transaction.get(userRef(uid));
      final rewardRef = _db.collection('rewards').doc(reward.id);
      final rewardSnapshot = await transaction.get(rewardRef);
      final currentReward = RewardItem.fromFirestore(rewardSnapshot);
      final balance = (userSnapshot.data()?['balance'] as num?)?.toInt() ?? 0;

      if (!currentReward.isAvailable) {
        throw StateError('Reward is unavailable.');
      }
      if (balance < currentReward.cost) {
        throw StateError('Not enough demo coins.');
      }

      transaction.update(userSnapshot.reference, {
        'balance': balance - currentReward.cost,
        'xp': FieldValue.increment(40),
      });
      if (currentReward.stock > 0) {
        transaction.update(rewardRef, {'stock': FieldValue.increment(-1)});
      }
      transaction.set(_db.collection('rewardRedemptions').doc(), {
        'uid': uid,
        'rewardId': currentReward.id,
        'title': currentReward.title,
        'cost': currentReward.cost,
        'status': 'pending',
        'createdAt': FieldValue.serverTimestamp(),
      });
      _writeLedger(transaction, uid, -currentReward.cost, 'reward', currentReward.title);
    });
  }

  Future<void> updateProfile({
    required String uid,
    required String displayName,
    String? photoUrl,
  }) {
    return userRef(uid).update({
      'displayName': displayName.trim(),
      'photoUrl': photoUrl,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  Future<void> setUserBalance({
    required String uid,
    required int balance,
  }) {
    return userRef(uid).update({
      'balance': max(0, balance),
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  Future<void> saveReward({
    String? rewardId,
    required String title,
    required String description,
    required int cost,
    required int stock,
    required bool active,
  }) {
    final ref = rewardId == null || rewardId.isEmpty ? _db.collection('rewards').doc() : _db.collection('rewards').doc(rewardId);
    return ref.set(
      RewardItem(
        id: ref.id,
        title: title,
        description: description,
        cost: cost,
        stock: stock,
        active: active,
      ).toMap(),
      SetOptions(merge: true),
    );
  }

  Future<void> saveAnnouncement({
    String? announcementId,
    required String title,
    required String body,
    required bool active,
  }) {
    final ref = announcementId == null || announcementId.isEmpty
        ? _db.collection('announcements').doc()
        : _db.collection('announcements').doc(announcementId);
    return ref.set(
      {
        'title': title,
        'body': body,
        'active': active,
        'createdAt': FieldValue.serverTimestamp(),
      },
      SetOptions(merge: true),
    );
  }

  void _writeLedger(
    Transaction transaction,
    String uid,
    int amount,
    String source,
    String title,
  ) {
    transaction.set(_db.collection('coinLedger').doc(), {
      'uid': uid,
      'amount': amount,
      'source': source,
      'title': title,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }
}
