import 'dart:math' as math;
import 'package:sensors_plus/sensors_plus.dart';

class SensorData {
  final double x;
  final double y;
  final double z;

  SensorData(this.x, this.y, this.z);

  @override
  String toString() => 'x: ${x.toStringAsFixed(2)}, y: ${y.toStringAsFixed(2)}, z: ${z.toStringAsFixed(2)}';
}

class SensorService {
  /// Stream of accelerometer data
  static Stream<SensorData> get accelerometerEventsStream {
    return accelerometerEventStream().map((e) => SensorData(e.x, e.y, e.z));
  }

  /// Stream of user-accelerometer data (excluding gravity)
  static Stream<SensorData> get userAccelerometerEventsStream {
    return userAccelerometerEventStream().map((e) => SensorData(e.x, e.y, e.z));
  }

  /// Stream of gyroscope data (angular velocity)
  static Stream<SensorData> get gyroscopeEventsStream {
    return gyroscopeEventStream().map((e) => SensorData(e.x, e.y, e.z));
  }

  /// Stream of magnetometer data (magnetic field)
  static Stream<SensorData> get magnetometerEventsStream {
    return magnetometerEventStream().map((e) => SensorData(e.x, e.y, e.z));
  }

  /// Compass stream calculated using magnetometer data (heading relative to Magnetic North in degrees: [0-360])
  static Stream<double> get compassHeadingStream {
    return magnetometerEventStream().map((event) {
      // heading = atan2(y, x) in radians
      double heading = math.atan2(event.y, event.x);
      
      // Convert to degrees
      double headingDegrees = heading * 180.0 / math.pi;
      
      // Normalize to 0-360
      headingDegrees = (headingDegrees + 360.0) % 360.0;
      
      return headingDegrees;
    });
  }
}
