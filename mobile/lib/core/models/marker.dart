class MapMarker {
  final String id;
  final String type; // 'icon' or 'label'
  final List<double> coordinates;
  final String? text;
  final String? iconType;

  MapMarker({
    required this.id,
    required this.type,
    required this.coordinates,
    this.text,
    this.iconType,
  });

  factory MapMarker.fromJson(Map<String, dynamic> json) {
    return MapMarker(
      id: json['id'] as String,
      type: json['type'] as String? ?? 'label',
      coordinates: List<double>.from(
        (json['coordinates'] as List).map((c) => (c as num).toDouble()),
      ),
      text: json['text'] as String?,
      iconType: json['iconType'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'coordinates': coordinates,
      'text': text,
      'iconType': iconType,
    };
  }
}
