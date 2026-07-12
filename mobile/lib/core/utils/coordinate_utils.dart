import 'dart:math' as math;

class DigitisationZone {
  final List<double> origin;
  final double width;
  final double height;

  DigitisationZone({
    required this.origin,
    required this.width,
    required this.height,
  });
}

class CoordinateUtils {
  static double lerp(double a, double b, double t) {
    return a + t * (b - a);
  }

  static List<double> getRotatedCoordinate(
      double cx, double cy, double x, double y, double angleInDegrees) {
    final radians = (math.pi / 180.0) * angleInDegrees;
    final cos = math.cos(radians);
    final sin = math.sin(radians);

    final nx = cos * (x - cx) - sin * (y - cy) + cx;
    final ny = cos * (y - cy) + sin * (x - cx) + cy;

    return [nx, ny];
  }

  static List<double> getRealPointCoordinateRelativeToDigitisationZone(
      DigitisationZone digitisationSpace,
      double rotationInDegree,
      double x,
      double y) {
    final realPointX = lerp(
      digitisationSpace.origin[0],
      digitisationSpace.origin[0] + digitisationSpace.width,
      x,
    );
    final realPointY = lerp(
      digitisationSpace.origin[1],
      digitisationSpace.origin[1] + digitisationSpace.height,
      y,
    );

    final originX = lerp(
      digitisationSpace.origin[0],
      digitisationSpace.origin[0] + digitisationSpace.width,
      0,
    );
    final originY = lerp(
      digitisationSpace.origin[1],
      digitisationSpace.origin[1] + digitisationSpace.height,
      0,
    );

    return getRotatedCoordinate(
      originX,
      originY,
      realPointX,
      realPointY,
      rotationInDegree,
    );
  }

  static List<double> getPercentageCoordinateRelativeToDigitisationZone(
      DigitisationZone digitisationSpace,
      double rotationInDegree,
      double x,
      double y) {
    final originX = lerp(
      digitisationSpace.origin[0],
      digitisationSpace.origin[0] + digitisationSpace.width,
      0,
    );
    final originY = lerp(
      digitisationSpace.origin[1],
      digitisationSpace.origin[1] + digitisationSpace.height,
      0,
    );

    final coordsBeforeRotation = getRotatedCoordinate(
      originX,
      originY,
      x,
      y,
      -rotationInDegree,
    );

    final coordsBeforeOriginChangeX = coordsBeforeRotation[0] - digitisationSpace.origin[0];
    final coordsBeforeOriginChangeY = coordsBeforeRotation[1] - digitisationSpace.origin[1];

    return [
      coordsBeforeOriginChangeX / digitisationSpace.width,
      coordsBeforeOriginChangeY / digitisationSpace.height,
    ];
  }
}
