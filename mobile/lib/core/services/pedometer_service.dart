import 'dart:async';
import 'dart:math' as math;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'sensor_service.dart';

class PedometerState {
  final int stepCount;
  final bool isActive;

  PedometerState({required this.stepCount, required this.isActive});

  PedometerState copyWith({int? stepCount, bool? isActive}) {
    return PedometerState(
      stepCount: stepCount ?? this.stepCount,
      isActive: isActive ?? this.isActive,
    );
  }
}

class PedometerService extends StateNotifier<PedometerState> {
  PedometerService() : super(PedometerState(stepCount: 0, isActive: false));

  StreamSubscription? _subscription;

  // Filter parameters matching React usePedometer.js
  double _lastAccelFiltered = 9.8;
  double _accelBaseline = 9.8;
  int _lastStepTimeMs = 0;
  bool _isAboveThreshold = false;

  static const double _alpha = 0.85; // Low-pass filter smoothing coefficient
  static const double _beta = 0.98;  // Baseline tracker smoothing coefficient (slow)
  static const double _thresholdMargin = 1.25; // Acceleration difference (m/s^2) above baseline
  static const int _stepCooldownMs = 350; // Cooldown between steps in milliseconds

  void startTracking(void Function() onStepDetected) {
    if (state.isActive) return;

    state = state.copyWith(isActive: true);

    _subscription = SensorService.accelerometerEventsStream.listen((event) {
      final x = event.x;
      final y = event.y;
      final z = event.z;

      // Magnitude of total acceleration (including gravity)
      final magnitude = math.sqrt(x * x + y * y + z * z);

      // Low-pass filter to smooth out high frequency noise
      _lastAccelFiltered = _alpha * _lastAccelFiltered + (1 - _alpha) * magnitude;

      // Slow low-pass filter to track average gravity baseline (~9.8 m/s^2)
      _accelBaseline = _beta * _accelBaseline + (1 - _beta) * magnitude;

      final diff = _lastAccelFiltered - _accelBaseline;
      final now = DateTime.now().millisecondsSinceEpoch;

      if (diff > _thresholdMargin) {
        if (!_isAboveThreshold && (now - _lastStepTimeMs > _stepCooldownMs)) {
          _isAboveThreshold = true;
          _lastStepTimeMs = now;
          state = state.copyWith(stepCount: state.stepCount + 1);
          onStepDetected();
        }
      } else if (diff < 0.2) {
        _isAboveThreshold = false;
      }
    });
  }

  void stopTracking() {
    _subscription?.cancel();
    _subscription = null;
    state = state.copyWith(isActive: false);
  }

  void resetSteps() {
    state = state.copyWith(stepCount: 0);
  }

  @override
  void dispose() {
    stopTracking();
    super.dispose();
  }
}

final pedometerProvider = StateNotifierProvider<PedometerService, PedometerState>((ref) {
  return PedometerService();
});
