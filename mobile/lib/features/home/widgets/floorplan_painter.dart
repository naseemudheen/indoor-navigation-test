import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class FloorplanPainter extends CustomPainter {
  final List<Offset> remainingPath;
  final List<Offset> coveredPath;
  final double scale;

  FloorplanPainter({
    required this.remainingPath,
    required this.coveredPath,
    required this.scale,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // We scale down the stroke widths as zoom scale increases
    // to keep them looking thin and consistent.
    final adjustedScale = scale > 1.0 ? scale : 1.0;
    
    // 1. Draw Covered Path (Dark Blue)
    if (coveredPath.length >= 2) {
      final coveredOuterPaint = Paint()
        ..color = const Color(0xFF1E3A8A).withOpacity(0.3)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 9.0 / adjustedScale
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round;

      final coveredInnerPaint = Paint()
        ..color = const Color(0xFF2563EB)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 6.0 / adjustedScale
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round;

      final path = Path();
      path.moveTo(coveredPath[0].dx, coveredPath[0].dy);
      
      for (int i = 1; i < coveredPath.length; i++) {
        path.lineTo(coveredPath[i].dx, coveredPath[i].dy);
      }

      canvas.drawPath(path, coveredOuterPaint);
      canvas.drawPath(path, coveredInnerPaint);
    }

    // 2. Draw Remaining Path (Green)
    if (remainingPath.length >= 2) {
      final remainingOuterPaint = Paint()
        ..color = AppColors.pathOutlineColor
        ..style = PaintingStyle.stroke
        ..strokeWidth = 9.0 / adjustedScale
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round;

      final remainingInnerPaint = Paint()
        ..color = AppColors.pathLineColor
        ..style = PaintingStyle.stroke
        ..strokeWidth = 6.0 / adjustedScale
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round;

      final path = Path();
      path.moveTo(remainingPath[0].dx, remainingPath[0].dy);
      
      for (int i = 1; i < remainingPath.length; i++) {
        path.lineTo(remainingPath[i].dx, remainingPath[i].dy);
      }

      canvas.drawPath(path, remainingOuterPaint);
      canvas.drawPath(path, remainingInnerPaint);
    }
  }

  @override
  bool shouldRepaint(covariant FloorplanPainter oldDelegate) {
    return oldDelegate.remainingPath != remainingPath ||
        oldDelegate.coveredPath != coveredPath ||
        oldDelegate.scale != scale;
  }
}
