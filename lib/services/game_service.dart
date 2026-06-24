import 'dart:math';

class GameOutcome {
  const GameOutcome({
    required this.title,
    required this.message,
    required this.coinDelta,
    required this.xp,
    this.symbols = const [],
    this.achievement,
  });

  final String title;
  final String message;
  final int coinDelta;
  final int xp;
  final List<String> symbols;
  final String? achievement;
}

class GameService {
  GameService({Random? random}) : _random = random ?? Random.secure();

  final Random _random;

  static const slotCost = 25;
  static const wheelCost = 20;
  static const diceCost = 10;
  static const coinFlipCost = 10;
  static const cardMatchCost = 15;

  final List<String> _symbols = const ['7', 'BAR', 'STAR', 'GEM', 'CROWN', 'CHIP'];
  final List<int> _wheelRewards = const [10, 25, 50, 75, 100, 150, 250, 500];

  GameOutcome spinSlots() {
    final reels = List.generate(3, (_) => _symbols[_random.nextInt(_symbols.length)]);
    final allSame = reels.toSet().length == 1;
    final pair = reels.toSet().length == 2;
    final jackpot = allSame && reels.first == '7';
    final prize = jackpot ? 1000 : allSame ? 250 : pair ? 60 : 0;
    return GameOutcome(
      title: jackpot ? 'Jackpot!' : allSame ? 'Triple Match' : pair ? 'Pair Win' : 'Try Again',
      message: jackpot
          ? 'Three lucky sevens landed. Virtual coins only, no cash value.'
          : prize > 0
              ? 'Your reels paid out $prize demo coins.'
              : 'The house lights stay on. Spin again when ready.',
      coinDelta: prize - slotCost,
      xp: prize > 0 ? 30 : 8,
      symbols: reels,
      achievement: jackpot ? 'jackpot_first' : allSame ? 'triple_match' : null,
    );
  }

  GameOutcome spinWheel() {
    final reward = _wheelRewards[_random.nextInt(_wheelRewards.length)];
    return GameOutcome(
      title: 'Wheel Reward',
      message: 'The premium wheel awarded $reward demo coins.',
      coinDelta: reward - wheelCost,
      xp: 18,
      symbols: [reward.toString()],
      achievement: reward >= 250 ? 'wheel_royalty' : null,
    );
  }

  GameOutcome rollDice() {
    final dice = 1 + _random.nextInt(6);
    final prize = dice == 6 ? 80 : dice >= 4 ? 30 : 0;
    return GameOutcome(
      title: dice == 6 ? 'Six Shooter' : prize > 0 ? 'Dice Win' : 'Low Roll',
      message: 'You rolled $dice and ${prize > 0 ? 'won $prize' : 'missed'} demo coins.',
      coinDelta: prize - diceCost,
      xp: dice == 6 ? 20 : 8,
      symbols: [dice.toString()],
      achievement: dice == 6 ? 'dice_master' : null,
    );
  }

  GameOutcome flipCoin({required bool pickedHeads}) {
    final isHeads = _random.nextBool();
    final win = isHeads == pickedHeads;
    return GameOutcome(
      title: win ? 'Correct Call' : 'Wrong Side',
      message: 'Coin landed on ${isHeads ? 'heads' : 'tails'}.',
      coinDelta: (win ? 25 : 0) - coinFlipCost,
      xp: win ? 12 : 5,
      symbols: [isHeads ? 'H' : 'T'],
      achievement: win ? 'coin_caller' : null,
    );
  }

  GameOutcome cardMatchWin({required int moves}) {
    final bonus = max(0, 180 - moves * 5);
    return GameOutcome(
      title: 'Board Cleared',
      message: 'Matched every card in $moves moves.',
      coinDelta: 100 + bonus - cardMatchCost,
      xp: 35,
      achievement: moves <= 10 ? 'memory_ace' : 'card_clear',
    );
  }
}
