import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/utils/coordinate_utils.dart';

void main() {
  group('CoordinateUtils Tests', () {
    test('lerp correctly interpolates', () {
      expect(CoordinateUtils.lerp(0.0, 100.0, 0.5), equals(50.0));
      expect(CoordinateUtils.lerp(10.0, 20.0, 0.2), equals(12.0));
    });

    test('getRotatedCoordinate rotates around center', () {
      final rotated = CoordinateUtils.getRotatedCoordinate(0.0, 0.0, 1.0, 0.0, 90.0);
      // Rotated 90 degrees around origin: (1, 0) becomes (0, 1)
      expect(rotated[0], closeTo(0.0, 0.0001));
      expect(rotated[1], closeTo(1.0, 0.0001));
    });

    test('getRealPointCoordinateRelativeToDigitisationZone calculates correct mapping', () {
      final zone = DigitisationZone(
        origin: const [100.0, 100.0],
        width: 1000.0,
        height: 1000.0,
      );

      // Map (0.5, 0.5) percentage coordinates relative to the 1000x1000 workspace
      final pos = CoordinateUtils.getRealPointCoordinateRelativeToDigitisationZone(
        zone,
        0.0, // No rotation
        0.5,
        0.5,
      );

      // (100 + 500, 100 + 500) = (600, 600)
      expect(pos[0], equals(600.0));
      expect(pos[1], equals(600.0));
    });
  });
}
