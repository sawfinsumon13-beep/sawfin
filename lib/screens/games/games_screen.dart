import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';

import '../../app/app_theme.dart';
import '../../models/app_user.dart';
import '../../models/game_config.dart';
import '../../services/game_service.dart';
import '../../services/user_repository.dart';
import '../../widgets/casino_widgets.dart';

class GamesScreen extends StatefulWidget {
  const GamesScreen({required this.user, super.key});

  final AppUser user;

  @override
  State<GamesScreen> createState() => _GamesScreenState();
}

class _GamesScreenState extends State<GamesScreen> {
  final _repository = UserRepository();
  final _gameService = GameService();
  var _busy = false;

  Future<bool> _record({
    required String gameId,
    required int cost,
    required GameOutcome outcome,
    required GameConfig config,
  }) async {
    if (_busy) {
      return false;
    }
    if (!config.enabled) {
      _showMessage('${config.title} is temporarily disabled by admins.');
      return false;
    }
    if (widget.user.balance < cost) {
      _showMessage('Not enough demo coins. Claim your daily bonus or try another game.');
      return false;
    }

    setState(() => _busy = true);
    try {
      final adjustedOutcome = outcome.withAdjustedRewards(
        rewardMultiplier: config.rewardMultiplier,
        difficulty: config.difficulty,
      );
      await _repository.recordGameOutcome(
        uid: widget.user.uid,
        gameId: gameId,
        outcome: adjustedOutcome,
      );
      _showMessage(
        '${adjustedOutcome.title}: ${adjustedOutcome.coinDelta >= 0 ? '+' : ''}${adjustedOutcome.coinDelta} coins',
      );
      return true;
    } catch (error) {
      _showMessage(error.toString());
      return false;
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  void _showMessage(String text) {
    if (!mounted) {
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(text), behavior: SnackBarBehavior.floating),
    );
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 5,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 18, 20, 8),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    'Games',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
                  ),
                ),
                CoinBadge(balance: widget.user.balance),
              ],
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: DemoOnlyBanner(),
          ),
          const SizedBox(height: 10),
          const TabBar(
            isScrollable: true,
            tabs: [
              Tab(icon: Icon(Icons.casino_rounded), text: 'Slots'),
              Tab(icon: Icon(Icons.track_changes_rounded), text: 'Wheel'),
              Tab(icon: Icon(Icons.style_rounded), text: 'Cards'),
              Tab(icon: Icon(Icons.grid_3x3_rounded), text: 'Dice'),
              Tab(icon: Icon(Icons.monetization_on_rounded), text: 'Flip'),
            ],
          ),
          Expanded(
            child: StreamBuilder<List<GameConfig>>(
              stream: _repository.watchGameConfigs(),
              builder: (context, snapshot) {
                final configs = snapshot.data ?? GameConfig.defaults;
                final slots = _config(configs, 'slot_machine');
                final wheel = _config(configs, 'lucky_wheel');
                final cards = _config(configs, 'card_match');
                final dice = _config(configs, 'dice');
                final coinFlip = _config(configs, 'coin_flip');

                return TabBarView(
                  children: [
                    _SlotGame(
                      service: _gameService,
                      disabled: _busy || !slots.enabled,
                      config: slots,
                      onRecord: (outcome) => _record(
                        gameId: 'slot_machine',
                        cost: GameService.slotCost,
                        outcome: outcome,
                        config: slots,
                      ),
                    ),
                    _WheelGame(
                      service: _gameService,
                      disabled: _busy || !wheel.enabled,
                      config: wheel,
                      onRecord: (outcome) => _record(
                        gameId: 'lucky_wheel',
                        cost: GameService.wheelCost,
                        outcome: outcome,
                        config: wheel,
                      ),
                    ),
                    _CardMatchGame(
                      user: widget.user,
                      service: _gameService,
                      disabled: _busy || !cards.enabled,
                      config: cards,
                      onRecord: (outcome) => _record(
                        gameId: 'card_match',
                        cost: GameService.cardMatchCost,
                        outcome: outcome,
                        config: cards,
                      ),
                    ),
                    _DiceGame(
                      service: _gameService,
                      disabled: _busy || !dice.enabled,
                      config: dice,
                      onRecord: (outcome) => _record(
                        gameId: 'dice',
                        cost: GameService.diceCost,
                        outcome: outcome,
                        config: dice,
                      ),
                    ),
                    _CoinFlipGame(
                      service: _gameService,
                      disabled: _busy || !coinFlip.enabled,
                      config: coinFlip,
                      onRecord: (outcome) => _record(
                        gameId: 'coin_flip',
                        cost: GameService.coinFlipCost,
                        outcome: outcome,
                        config: coinFlip,
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  GameConfig _config(List<GameConfig> configs, String id) {
    return configs.firstWhere(
      (config) => config.id == id,
      orElse: () => GameConfig.defaults.firstWhere((config) => config.id == id),
    );
  }
}

typedef OutcomeRecorder = Future<bool> Function(GameOutcome outcome);

class _GameLayout extends StatelessWidget {
  const _GameLayout({
    required this.title,
    required this.subtitle,
    required this.cost,
    required this.config,
    required this.child,
  });

  final String title;
  final String subtitle;
  final int cost;
  final GameConfig config;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        SectionHeader(
          title: title,
          subtitle:
              '$subtitle - Cost: $cost coins - ${config.difficulty} - x${config.rewardMultiplier.toStringAsFixed(2)} rewards',
        ),
        const SizedBox(height: 16),
        if (!config.enabled) ...[
          const CasinoCard(
            child: Row(
              children: [
                Icon(Icons.pause_circle_filled_rounded, color: CasinoColors.gold),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'This game is currently disabled by administrators.',
                    style: TextStyle(color: CasinoColors.muted),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],
        child,
      ],
    );
  }
}

class _SlotGame extends StatefulWidget {
  const _SlotGame({
    required this.service,
    required this.disabled,
    required this.config,
    required this.onRecord,
  });

  final GameService service;
  final bool disabled;
  final GameConfig config;
  final OutcomeRecorder onRecord;

  @override
  State<_SlotGame> createState() => _SlotGameState();
}

class _SlotGameState extends State<_SlotGame> {
  var _symbols = const ['7', 'BAR', 'STAR'];
  String? _message;

  Future<void> _spin() async {
    final outcome = widget.service.spinSlots();
    setState(() {
      _symbols = outcome.symbols;
      _message = outcome.message;
    });
    await widget.onRecord(outcome);
  }

  @override
  Widget build(BuildContext context) {
    return _GameLayout(
      title: 'Slot Machine',
      subtitle: 'Match reels for virtual rewards',
      cost: GameService.slotCost,
      config: widget.config,
      child: CasinoCard(
        child: Column(
          children: [
            Row(
              children: _symbols.map((symbol) {
                return Expanded(
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 280),
                    transitionBuilder: (child, animation) {
                      return ScaleTransition(scale: animation, child: child);
                    },
                    child: Container(
                      key: ValueKey(symbol + DateTime.now().microsecond.toString()),
                      margin: const EdgeInsets.all(6),
                      padding: const EdgeInsets.symmetric(vertical: 28),
                      decoration: BoxDecoration(
                        color: CasinoColors.surfaceLight,
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: CasinoColors.gold.withValues(alpha: .35)),
                      ),
                      child: Center(
                        child: Text(
                          symbol,
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.w900,
                                color: CasinoColors.gold,
                              ),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            if (_message != null) ...[
              const SizedBox(height: 12),
              Text(_message!, textAlign: TextAlign.center, style: const TextStyle(color: CasinoColors.muted)),
            ],
            const SizedBox(height: 20),
            FilledButton.icon(
              onPressed: widget.disabled ? null : _spin,
              icon: const Icon(Icons.play_arrow_rounded),
              label: const Text('Spin Reels'),
            ),
          ],
        ),
      ),
    );
  }
}

class _WheelGame extends StatefulWidget {
  const _WheelGame({
    required this.service,
    required this.disabled,
    required this.config,
    required this.onRecord,
  });

  final GameService service;
  final bool disabled;
  final GameConfig config;
  final OutcomeRecorder onRecord;

  @override
  State<_WheelGame> createState() => _WheelGameState();
}

class _WheelGameState extends State<_WheelGame> {
  var _turns = 0.0;
  var _result = 'Tap spin to start';

  Future<void> _spin() async {
    final outcome = widget.service.spinWheel();
    setState(() {
      _turns += 3 + (int.parse(outcome.symbols.first) / 500);
      _result = outcome.message;
    });
    await widget.onRecord(outcome);
  }

  @override
  Widget build(BuildContext context) {
    return _GameLayout(
      title: 'Lucky Wheel',
      subtitle: 'A smooth animated prize wheel',
      cost: GameService.wheelCost,
      config: widget.config,
      child: CasinoCard(
        child: Column(
          children: [
            Stack(
              alignment: Alignment.topCenter,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 18),
                  child: AnimatedRotation(
                    turns: _turns,
                    duration: const Duration(milliseconds: 900),
                    curve: Curves.easeOutBack,
                    child: CustomPaint(
                      size: const Size.square(230),
                      painter: _WheelPainter(),
                    ),
                  ),
                ),
                const Icon(Icons.arrow_drop_down_rounded, size: 46, color: CasinoColors.gold),
              ],
            ),
            const SizedBox(height: 12),
            Text(_result, style: const TextStyle(color: CasinoColors.muted)),
            const SizedBox(height: 20),
            FilledButton.icon(
              onPressed: widget.disabled ? null : _spin,
              icon: const Icon(Icons.rotate_right_rounded),
              label: const Text('Spin Wheel'),
            ),
          ],
        ),
      ),
    );
  }
}

class _WheelPainter extends CustomPainter {
  final _labels = const ['10', '25', '50', '75', '100', '150', '250', '500'];

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final radius = size.width / 2;
    final sweep = 2 * pi / _labels.length;
    final colors = [CasinoColors.goldDeep, CasinoColors.crimson, CasinoColors.surfaceLight, CasinoColors.emerald];
    for (var i = 0; i < _labels.length; i++) {
      final paint = Paint()..color = colors[i % colors.length];
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        i * sweep,
        sweep,
        true,
        paint,
      );
      final textPainter = TextPainter(
        text: TextSpan(
          text: _labels[i],
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      final angle = i * sweep + sweep / 2;
      final offset = Offset(
        center.dx + cos(angle) * radius * .58 - textPainter.width / 2,
        center.dy + sin(angle) * radius * .58 - textPainter.height / 2,
      );
      textPainter.paint(canvas, offset);
    }
    canvas.drawCircle(center, 32, Paint()..color = CasinoColors.background);
    canvas.drawCircle(center, 22, Paint()..color = CasinoColors.gold);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _CardMatchGame extends StatefulWidget {
  const _CardMatchGame({
    required this.user,
    required this.service,
    required this.disabled,
    required this.config,
    required this.onRecord,
  });

  final AppUser user;
  final GameService service;
  final bool disabled;
  final GameConfig config;
  final OutcomeRecorder onRecord;

  @override
  State<_CardMatchGame> createState() => _CardMatchGameState();
}

class _CardMatchGameState extends State<_CardMatchGame> {
  final _cards = <String>[];
  final _revealed = <int>{};
  final _matched = <int>{};
  int? _selected;
  var _moves = 0;
  var _checking = false;

  @override
  void initState() {
    super.initState();
    _reset();
  }

  void _reset() {
    final values = ['7', 'BAR', 'GEM', 'CHIP'];
    _cards
      ..clear()
      ..addAll([...values, ...values]..shuffle(Random.secure()));
    _revealed.clear();
    _matched.clear();
    _selected = null;
    _moves = 0;
    _checking = false;
  }

  Future<void> _tap(int index) async {
    if (widget.disabled ||
        _checking ||
        widget.user.balance < GameService.cardMatchCost ||
        _revealed.contains(index) ||
        _matched.contains(index)) {
      return;
    }

    setState(() => _revealed.add(index));
    if (_selected == null) {
      _selected = index;
      return;
    }

    final first = _selected!;
    _selected = null;
    _moves++;
    _checking = true;
    await Future<void>.delayed(const Duration(milliseconds: 650));
    if (!mounted) {
      return;
    }
    if (_cards[first] == _cards[index]) {
      setState(() {
        _matched.addAll([first, index]);
        _checking = false;
      });
      if (_matched.length == _cards.length) {
        final recorded = await widget.onRecord(widget.service.cardMatchWin(moves: _moves));
        if (recorded && mounted) {
          setState(_reset);
        }
      }
    } else {
      setState(() {
        _revealed.removeAll([first, index]);
        _checking = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return _GameLayout(
      title: 'Card Matching Game',
      subtitle: 'Clear the board with fewer moves',
      cost: GameService.cardMatchCost,
      config: widget.config,
      child: CasinoCard(
        child: Column(
          children: [
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
              ),
              itemCount: _cards.length,
              itemBuilder: (context, index) {
                final visible = _revealed.contains(index) || _matched.contains(index);
                return InkWell(
                  onTap: () => _tap(index),
                  borderRadius: BorderRadius.circular(16),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 220),
                    decoration: BoxDecoration(
                      color: visible ? CasinoColors.gold : CasinoColors.surfaceLight,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: CasinoColors.gold.withValues(alpha: .28)),
                    ),
                    child: Center(
                      child: Text(
                        visible ? _cards[index] : '?',
                        style: TextStyle(
                          color: visible ? const Color(0xFF201300) : CasinoColors.gold,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 18),
            Row(
              children: [
                Expanded(child: Text('Moves: $_moves', style: const TextStyle(color: CasinoColors.muted))),
                TextButton.icon(
                  onPressed: () => setState(_reset),
                  icon: const Icon(Icons.refresh_rounded),
                  label: const Text('Reset'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _DiceGame extends StatefulWidget {
  const _DiceGame({
    required this.service,
    required this.disabled,
    required this.config,
    required this.onRecord,
  });

  final GameService service;
  final bool disabled;
  final GameConfig config;
  final OutcomeRecorder onRecord;

  @override
  State<_DiceGame> createState() => _DiceGameState();
}

class _DiceGameState extends State<_DiceGame> {
  var _face = 1;

  Future<void> _roll() async {
    final outcome = widget.service.rollDice();
    setState(() => _face = int.parse(outcome.symbols.first));
    await widget.onRecord(outcome);
  }

  @override
  Widget build(BuildContext context) {
    return _GameLayout(
      title: 'Dice Game',
      subtitle: 'Roll high for demo coin wins',
      cost: GameService.diceCost,
      config: widget.config,
      child: CasinoCard(
        child: Column(
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 260),
              child: Icon(
                Icons.casino_rounded,
                key: ValueKey(_face),
                size: 132,
                color: CasinoColors.gold,
              ),
            ),
            Text(
              '$_face',
              style: Theme.of(context).textTheme.displayLarge?.copyWith(fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 20),
            FilledButton.icon(
              onPressed: widget.disabled ? null : _roll,
              icon: const Icon(Icons.grid_3x3_rounded),
              label: const Text('Roll Dice'),
            ),
          ],
        ),
      ),
    );
  }
}

class _CoinFlipGame extends StatefulWidget {
  const _CoinFlipGame({
    required this.service,
    required this.disabled,
    required this.config,
    required this.onRecord,
  });

  final GameService service;
  final bool disabled;
  final GameConfig config;
  final OutcomeRecorder onRecord;

  @override
  State<_CoinFlipGame> createState() => _CoinFlipGameState();
}

class _CoinFlipGameState extends State<_CoinFlipGame> {
  var _heads = true;

  Future<void> _flip(bool pickedHeads) async {
    final outcome = widget.service.flipCoin(pickedHeads: pickedHeads);
    setState(() => _heads = outcome.symbols.first == 'H');
    await widget.onRecord(outcome);
  }

  @override
  Widget build(BuildContext context) {
    return _GameLayout(
      title: 'Coin Flip',
      subtitle: 'Call heads or tails',
      cost: GameService.coinFlipCost,
      config: widget.config,
      child: CasinoCard(
        child: Column(
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 360),
              curve: Curves.easeOutBack,
              height: 180,
              width: 180,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(colors: [CasinoColors.gold, CasinoColors.goldDeep]),
                boxShadow: [
                  BoxShadow(color: CasinoColors.gold.withValues(alpha: .35), blurRadius: 30),
                ],
              ),
              child: Center(
                child: Text(
                  _heads ? 'H' : 'T',
                  style: const TextStyle(
                    color: Color(0xFF201300),
                    fontSize: 72,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: widget.disabled ? null : () => _flip(true),
                    child: const Text('Heads'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: widget.disabled ? null : () => _flip(false),
                    child: const Text('Tails'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
