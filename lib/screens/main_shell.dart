import 'package:flutter/material.dart';

import '../app/routes.dart';
import '../models/app_user.dart';
import '../services/auth_service.dart';
import '../services/user_repository.dart';
import '../widgets/casino_widgets.dart';
import 'games/games_screen.dart';
import 'home_screen.dart';
import 'leaderboard_screen.dart';
import 'profile_screen.dart';
import 'rewards_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  final _auth = AuthService();
  final _repository = UserRepository();
  var _index = 0;

  @override
  Widget build(BuildContext context) {
    final firebaseUser = _auth.currentUser;
    if (firebaseUser == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.of(context).pushReplacementNamed(AppRoutes.login);
      });
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return StreamBuilder<AppUser>(
      stream: _repository.watchUser(firebaseUser.uid),
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Scaffold(
            body: PremiumBackground(
              child: Center(child: CircularProgressIndicator()),
            ),
          );
        }
        final user = snapshot.data!;
        final pages = [
          HomeScreen(user: user, onOpenGames: () => setState(() => _index = 1)),
          GamesScreen(user: user),
          RewardsScreen(user: user),
          const LeaderboardScreen(),
          ProfileScreen(user: user),
        ];

        return Scaffold(
          body: PremiumBackground(
            child: SafeArea(child: pages[_index]),
          ),
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: _index,
            onTap: (value) => setState(() => _index = value),
            items: const [
              BottomNavigationBarItem(icon: Icon(Icons.dashboard_rounded), label: 'Home'),
              BottomNavigationBarItem(icon: Icon(Icons.casino_rounded), label: 'Games'),
              BottomNavigationBarItem(icon: Icon(Icons.card_giftcard_rounded), label: 'Rewards'),
              BottomNavigationBarItem(icon: Icon(Icons.leaderboard_rounded), label: 'Rank'),
              BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Profile'),
            ],
          ),
        );
      },
    );
  }
}
