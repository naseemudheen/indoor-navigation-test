import 'package:flutter/material.dart';
import 'dart:math' as math;

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
    final adjustedScale = scale > 1.0 ? scale : 1.0;
    
    // 1. Draw Covered Path (Blue Neon Glow Design)
    if (coveredPath.length >= 2) {
      // Glow underlay
      final coveredGlowPaint = Paint()
        ..color = const Color(0x4D2563EB) // 30% opacity blue
        ..style = PaintingStyle.stroke
        ..strokeWidth = 16.0 / adjustedScale
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round
        ..maskFilter = MaskFilter.blur(BlurStyle.normal, 4.0 / adjustedScale);

      // Core line
      final coveredInnerPaint = Paint()
        ..color = const Color(0xFF2563EB)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 7.0 / adjustedScale
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round;

      // Dash painter
      final coveredDashPaint = Paint()
        ..color = Colors.white.withOpacity(0.7)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.0 / adjustedScale
        ..strokeCap = StrokeCap.round;

      final path = Path();
      path.moveTo(coveredPath[0].dx, coveredPath[0].dy);
      for (int i = 1; i < coveredPath.length; i++) {
        path.lineTo(coveredPath[i].dx, coveredPath[i].dy);
      }

      canvas.drawPath(path, coveredGlowPaint);
      canvas.drawPath(path, coveredInnerPaint);
      _drawDashedLine(canvas, coveredPath, coveredDashPaint, 8.0 / adjustedScale, 8.0 / adjustedScale);
    }

    // 2. Draw Remaining Path (Green Neon Glow Design)
    if (remainingPath.length >= 2) {
      // Glow underlay
      final remainingGlowPaint = Paint()
        ..color = const Color(0x4D10B981) // 30% opacity green
        ..style = PaintingStyle.stroke
        ..strokeWidth = 16.0 / adjustedScale
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round
        ..maskFilter = MaskFilter.blur(BlurStyle.normal, 4.0 / adjustedScale);

      // Core line
      final remainingInnerPaint = Paint()
        ..color = const Color(0xFF10B981)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 7.0 / adjustedScale
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round;

      // Dash painter
      final remainingDashPaint = Paint()
        ..color = Colors.white.withOpacity(0.7)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.0 / adjustedScale
        ..strokeCap = StrokeCap.round;

      final path = Path();
      path.moveTo(remainingPath[0].dx, remainingPath[0].dy);
      for (int i = 1; i < remainingPath.length; i++) {
        path.lineTo(remainingPath[i].dx, remainingPath[i].dy);
      }

      canvas.drawPath(path, remainingGlowPaint);
      canvas.drawPath(path, remainingInnerPaint);
      _drawDashedLine(canvas, remainingPath, remainingDashPaint, 8.0 / adjustedScale, 8.0 / adjustedScale);
    }
  }

  void _drawDashedLine(Canvas canvas, List<Offset> points, Paint paint, double dashLength, double gapLength) {
    for (int i = 0; i < points.length - 1; i++) {
      final p1 = points[i];
      final p2 = points[i + 1];
      
      final dx = p2.dx - p1.dx;
      final dy = p2.dy - p1.dy;
      final distance = math.sqrt(dx * dx + dy * dy);
      if (distance == 0) continue;
      
      final count = (distance / (dashLength + gapLength)).floor();
      
      for (int j = 0; j < count; j++) {
        final startRatio = (j * (dashLength + gapLength)) / distance;
        final endRatio = (startRatio + (dashLength / distance)).clamp(0.0, 1.0);
        
        canvas.drawLine(
          Offset(p1.dx + dx * startRatio, p1.dy + dy * startRatio),
          Offset(p1.dx + dx * endRatio, p1.dy + dy * endRatio),
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant FloorplanPainter oldDelegate) {
    return oldDelegate.remainingPath != remainingPath ||
        oldDelegate.coveredPath != coveredPath ||
        oldDelegate.scale != scale;
  }
}
