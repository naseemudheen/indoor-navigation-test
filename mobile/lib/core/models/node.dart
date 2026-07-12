class Node {
  final String id;
  final List<double> coordinates;
  final List<Neighbor> neighbors;
  final String? name;
  final bool isSearchable;
  final int floor; // added for floor classification (e.g. 0, 1, -1)

  Node({
    required this.id,
    required this.coordinates,
    required this.neighbors,
    this.name,
    this.isSearchable = false,
    this.floor = 0,
  });

  factory Node.fromJson(Map<String, dynamic> json) {
    var neighborsList = json['neighbors'] as List? ?? [];
    List<Neighbor> parsedNeighbors = neighborsList.map((n) => Neighbor.fromJson(n)).toList();

    return Node(
      id: json['id'] as String,
      coordinates: List<double>.from(
        (json['coordinates'] as List).map((c) => (c as num).toDouble()),
      ),
      neighbors: parsedNeighbors,
      name: json['name'] as String?,
      isSearchable: json['isSearchable'] as bool? ?? false,
      floor: json['floor'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'coordinates': coordinates,
      'neighbors': neighbors.map((n) => n.toJson()).toList(),
      'name': name,
      'isSearchable': isSearchable,
      'floor': floor,
    };
  }

  Node copyWith({
    String? id,
    List<double>? coordinates,
    List<Neighbor>? neighbors,
    String? name,
    bool? isSearchable,
    int? floor,
  }) {
    return Node(
      id: id ?? this.id,
      coordinates: coordinates ?? this.coordinates,
      neighbors: neighbors ?? this.neighbors,
      name: name ?? this.name,
      isSearchable: isSearchable ?? this.isSearchable,
      floor: floor ?? this.floor,
    );
  }
}

class Neighbor {
  final String id;
  final List<double> coordinates;
  final double distance;
  final bool isParent;

  Neighbor({
    required this.id,
    required this.coordinates,
    required this.distance,
    this.isParent = false,
  });

  factory Neighbor.fromJson(Map<String, dynamic> json) {
    return Neighbor(
      id: json['id'] as String,
      coordinates: List<double>.from(
        (json['coordinates'] as List).map((c) => (c as num).toDouble()),
      ),
      distance: (json['distance'] as num).toDouble(),
      isParent: json['isParent'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'coordinates': coordinates,
      'distance': distance,
      'isParent': isParent,
    };
  }
}
