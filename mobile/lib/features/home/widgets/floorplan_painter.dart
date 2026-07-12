import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class FloorplanPainter extends CustomPainter {
  final List<Offset> pathCoordinates;
  final double scale;

  FloorplanPainter({
    required this.pathCoordinates,
    required this.scale,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (pathCoordinates.length < 2) return;

    // We scale down the stroke widths as zoom scale increases
    // to keep them looking thin and consistent.
    final adjustedScale = scale > 1.0 ? scale : 1.0;
    
    // Outer Path (Shadow/Border)
    final outerPaint = Paint()
      ..color = AppColors.pathOutlineColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 9.0 / adjustedScale
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    // Inner Path (Core)
    final innerPaint = Paint()
      ..color = AppColors.pathLineColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6.0 / adjustedScale
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final path = Path();
    path.moveTo(pathCoordinates[0].dx, pathCoordinates[0].dy);
    
    for (int i = 1; i < pathCoordinates.length; i++) {
      path.lineTo(pathCoordinates[i].dx, pathCoordinates[i].dy);
    }

    // Draw the outer outline first, then the inner core
    canvas.drawPath(path, outerPaint);
    canvas.drawPath(path, innerPaint);
  }

  @override
  bool shouldRepaint(covariant FloorplanPainter oldDelegate) {
    return oldDelegate.pathCoordinates != pathCoordinates || oldDelegate.scale != scale;
  }
}
