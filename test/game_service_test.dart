import 'dart:math';

import 'package:flutter_test/flutter_test.dart';
import 'package:sawfin777/services/game_service.dart';

void main() {
  group('GameService', () {
    test('slot outcome always charges the slot cost from any prize', () {
      final service = GameService(random: Random(1));
      final outcome = service.spinSlots();

      expect(outcome.symbols, hasLength(3));
      expect(outcome.xp, greaterThan(0));
      expect(outcome.coinDelta, lessThanOrEqualTo(1000 - GameService.slotCost));
    });

    test('coin flip result records one visible side', () {
      final service = GameService(random: Random(2));
      final outcome = service.flipCoin(pickedHeads: true);

      expect(outcome.symbols, hasLength(1));
      expect(['H', 'T'], contains(outcome.symbols.single));
      expect(outcome.coinDelta, inInclusiveRange(-GameService.coinFlipCost, 25 - GameService.coinFlipCost));
    });
  });
}
