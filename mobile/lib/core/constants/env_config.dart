enum AppEnvironment {
  development,
  staging,
  production,
}

class EnvConfig {
  static AppEnvironment environment = AppEnvironment.development;

  static String get baseUrl {
    switch (environment) {
      case AppEnvironment.development:
        return 'http://192.168.1.100:8000';
      case AppEnvironment.staging:
        return 'https://staging-api.paadha.com';
      case AppEnvironment.production:
        return 'https://api.paadha.com';
    }
  }

  // Formula parameters to convert SVG coordinate distance to actual meters
  static const double svgDistanceScale = 3.70 / 0.179948798400245;

  static double convertSvgDistanceToMeters(double svgDistance) {
    return svgDistance * svgDistanceScale;
  }
}
