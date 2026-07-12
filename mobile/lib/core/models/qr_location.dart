class QrLocation {
  final String nodeId;
  final String name;
  final double xCoordinate;
  final double yCoordinate;
  final int headingDirection;
  final String qrType;

  QrLocation({
    required this.nodeId,
    required this.name,
    required this.xCoordinate,
    required this.yCoordinate,
    required this.headingDirection,
    required this.qrType,
  });

  factory QrLocation.fromJson(Map<String, dynamic> json) {
    return QrLocation(
      nodeId: json['node_id'] as String,
      name: json['name'] as String? ?? '',
      xCoordinate: (json['x_coordinate'] as num? ?? 0.0).toDouble(),
      yCoordinate: (json['y_coordinate'] as num? ?? 0.0).toDouble(),
      headingDirection: json['heading_direction'] as int? ?? 0,
      qrType: json['qr_type'] as String? ?? 'TRANSIT',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'node_id': nodeId,
      'name': name,
      'x_coordinate': xCoordinate,
      'y_coordinate': yCoordinate,
      'heading_direction': headingDirection,
      'qr_type': qrType,
    };
  }
}
