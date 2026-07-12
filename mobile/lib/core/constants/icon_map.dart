class AppIconMap {
  static const Map<String, String> icons = {
    'door': 'assets/icons/door.svg',
    'stair': 'assets/icons/stair.svg',
    'lift': 'assets/icons/lift.svg',
    'icu': 'assets/icons/icu.svg',
    'doctor': 'assets/icons/doctor.svg',
    'nurse': 'assets/icons/nurse.svg',
    'toilet': 'assets/icons/toilet.svg',
    'blood': 'assets/icons/blood.svg',
    'operation': 'assets/icons/operation.svg',
    'professor': 'assets/icons/professor.svg',
    'ward': 'assets/icons/ward.svg',
    'canteen': 'assets/icons/canteen.svg',
    'dining': 'assets/icons/dining-area.svg',
    'pharmacy': 'assets/icons/pharmacy.svg',
    'ramp': 'assets/icons/ramp.svg',
    'lab': 'assets/icons/lab.svg',
    'security': 'assets/icons/security.svg',
    'counter': 'assets/icons/ticker-counter.svg',
    'dining-area': 'assets/icons/dining-area.svg',
    'bedroom': 'assets/icons/bedroom.svg',
    'kitchen': 'assets/icons/kitchen.svg',
    'porch': 'assets/icons/porch.svg',
  };

  static String getIconPath(String key) {
    final lowerKey = key.toLowerCase().trim();
    return icons[lowerKey] ?? 'assets/icons/door.svg';
  }
}
