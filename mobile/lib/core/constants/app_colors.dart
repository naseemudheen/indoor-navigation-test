import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF10B981); // Emerald Green
  static const Color primaryDark = Color(0xFF065F46); // Deep Forest Green
  static const Color secondary = Color(0xFFF59E0B); // Amber Accent
  static const Color pathLineColor = Color(0xFFD1FAE5); // Light emerald path center
  static const Color pathOutlineColor = Color(0xFF34D399); // Accent green path boundary
  
  static const Color background = Color(0xFFF8FAFC); // Slate-50 background
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF0F172A); // Slate-900 text
  static const Color textMuted = Color(0xFF64748B); // Slate-500 text
  static const Color border = Color(0xFFE2E8F0); // Slate-200 border
  static const Color divider = Color(0xFFF1F5F9); // Slate-100 divider

  static const Color startPin = Color(0xFF10B981); // Emerald
  static const Color endPin = Color(0xFFEF4444); // Red
  static const Color stairPin = Color(0xFF3B82F6); // Blue

  // Premium Gradients
  static const Gradient primaryGradient = LinearGradient(
    colors: [Color(0xFF10B981), Color(0xFF059669)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const Gradient secondaryGradient = LinearGradient(
    colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Premium shadows
  static List<BoxShadow> get softShadow => [
        BoxShadow(
          color: Colors.black.withOpacity(0.04),
          blurRadius: 12,
          offset: const Offset(0, 4),
        ),
        BoxShadow(
          color: Colors.black.withOpacity(0.02),
          blurRadius: 4,
          offset: const Offset(0, 2),
        ),
      ];
}
