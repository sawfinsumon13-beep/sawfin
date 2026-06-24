import 'package:cloud_firestore/cloud_firestore.dart';

class AppUser {
  const AppUser({
    required this.uid,
    required this.email,
    required this.displayName,
    required this.balance,
    required this.xp,
    required this.dailyStreak,
    required this.achievements,
    required this.isAdmin,
    required this.createdAt,
    this.photoUrl,
    this.lastBonusAt,
  });

  final String uid;
  final String email;
  final String displayName;
  final String? photoUrl;
  final int balance;
  final int xp;
  final int dailyStreak;
  final List<String> achievements;
  final bool isAdmin;
  final DateTime createdAt;
  final DateTime? lastBonusAt;

  bool get canClaimDailyBonus {
    if (lastBonusAt == null) {
      return true;
    }
    final now = DateTime.now();
    final last = lastBonusAt!;
    return now.difference(last).inHours >= 20 ||
        now.day != last.day ||
        now.month != last.month ||
        now.year != last.year;
  }

  String get rank {
    if (xp >= 10000) {
      return 'Royal High Roller';
    }
    if (xp >= 5000) {
      return 'Diamond Club';
    }
    if (xp >= 2000) {
      return 'Gold Spinner';
    }
    if (xp >= 700) {
      return 'Silver Streak';
    }
    return 'Rookie';
  }

  factory AppUser.fromFirestore(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data() ?? <String, dynamic>{};
    return AppUser(
      uid: doc.id,
      email: data['email'] as String? ?? '',
      displayName: data['displayName'] as String? ?? 'Guest Player',
      photoUrl: data['photoUrl'] as String?,
      balance: (data['balance'] as num?)?.toInt() ?? 0,
      xp: (data['xp'] as num?)?.toInt() ?? 0,
      dailyStreak: (data['dailyStreak'] as num?)?.toInt() ?? 0,
      achievements: List<String>.from(data['achievements'] as List? ?? const []),
      isAdmin: data['role'] == 'admin',
      createdAt: _readDate(data['createdAt']) ?? DateTime.now(),
      lastBonusAt: _readDate(data['lastBonusAt']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'email': email,
      'displayName': displayName,
      'photoUrl': photoUrl,
      'balance': balance,
      'xp': xp,
      'dailyStreak': dailyStreak,
      'achievements': achievements,
      'role': isAdmin ? 'admin' : 'player',
      'createdAt': Timestamp.fromDate(createdAt),
      'lastBonusAt': lastBonusAt == null ? null : Timestamp.fromDate(lastBonusAt!),
    };
  }

  static DateTime? _readDate(dynamic value) {
    if (value is Timestamp) {
      return value.toDate();
    }
    if (value is DateTime) {
      return value;
    }
    return null;
  }
}
