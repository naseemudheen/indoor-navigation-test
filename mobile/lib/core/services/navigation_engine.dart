import 'dart:math' as math;
import 'dart:collection';
import '../models/node.dart';

class FloorPath {
  final int floor;
  final List<String> path;

  FloorPath({required this.floor, required this.path});
}

class NavigationEngine {
  // Predefined staircase node IDs from original React utils.js
  static const List<String> stairArr = [
    "path-12", "path-54", "path-72", "path-97", "path-131", "path-139",
    "path-156", "path-159", "path-234", "path-264", "path-281", "path-291",
    "path-335", "path-340", "path-346", "path-354", "path-410", "path-458",
    "path-463", "path-475", "path-479", "path-502", "path-526", "path-565",
    "path-595", "path-619", "path-620", "path-627", "path-634", "path-656",
    "path-659", "path-704",
  ];

  /// Core Dijkstra's Algorithm implementation matching dijkstrajs
  static List<String> findShortestPath(
      Map<String, Map<String, double>> graph, String start, String end) {
    if (!graph.containsKey(start) || !graph.containsKey(end)) {
      return [];
    }

    final distances = <String, double>{};
    final previous = <String, String?>{};
    final unvisited = Set<String>.from(graph.keys);

    for (var node in graph.keys) {
      distances[node] = double.infinity;
      previous[node] = null;
    }
    distances[start] = 0.0;

    while (unvisited.isNotEmpty) {
      // Find unvisited node with smallest distance
      String? currentNode;
      double minDistance = double.infinity;
      for (var node in unvisited) {
        if (distances[node]! < minDistance) {
          minDistance = distances[node]!;
          currentNode = node;
        }
      }

      if (currentNode == null || currentNode == end || distances[currentNode] == double.infinity) {
        break;
      }

      unvisited.remove(currentNode);

      final neighbors = graph[currentNode] ?? {};
      for (var neighbor in neighbors.keys) {
        final alt = distances[currentNode]! + neighbors[neighbor]!;
        if (alt < (distances[neighbor] ?? double.infinity)) {
          distances[neighbor] = alt;
          previous[neighbor] = currentNode;
        }
      }
    }

    final path = <String>[];
    String? current = end;
    while (current != null) {
      path.insert(0, current);
      current = previous[current];
    }

    if (path.isEmpty || path.first != start) {
      return [];
    }
    return path;
  }

  /// Separates path waypoints based on floor level
  static List<FloorPath> pathSeparator(List<Node> allNodes, List<String> pathNodeIds) {
    final result = <FloorPath>[];
    int? currentFloor;
    var currentPath = <String>[];

    for (var id in pathNodeIds) {
      // Find the node to obtain its floor property
      final node = allNodes.firstWhere((n) => n.id == id, orElse: () => Node(id: id, coordinates: [0, 0], neighbors: []));
      int itemFloor = node.floor;

      if (currentFloor == null) {
        currentFloor = itemFloor;
        currentPath.add(id);
      } else if (itemFloor != currentFloor) {
        if (currentPath.isNotEmpty) {
          result.add(FloorPath(floor: currentFloor, path: List.from(currentPath)));
        }
        currentFloor = itemFloor;
        currentPath = [id];
      } else {
        currentPath.add(id);
      }
    }

    if (currentPath.isNotEmpty && currentFloor != null) {
      result.add(FloorPath(floor: currentFloor, path: List.from(currentPath)));
    }

    return result;
  }

  /// Finds the nearest staircase waypoint from a starting point
  static String? findNearestStair(List<Node> floorMap, String startingPoint) {
    // 1. Build local graph representation
    final graph = <String, Map<String, double>>{};
    for (var node in floorMap) {
      graph[node.id] = {};
      for (var neighbor in node.neighbors) {
        graph[node.id]![neighbor.id] = neighbor.distance;
      }
    }

    if (!graph.containsKey(startingPoint)) {
      return null;
    }

    final visited = Set<String>();
    // Store as: [MapEntry(nodeId, distance)]
    final queue = Queue<MapEntry<String, double>>();
    queue.add(MapEntry(startingPoint, 0.0));

    while (queue.isNotEmpty) {
      final entry = queue.removeFirst();
      final nodeName = entry.key;
      final distance = entry.value;

      if (stairArr.contains(nodeName)) {
        return nodeName;
      }

      visited.add(nodeName);

      final neighbors = graph[nodeName] ?? {};
      for (var neighbor in neighbors.keys) {
        if (!visited.contains(neighbor)) {
          final neighborDistance = neighbors[neighbor]!;
          queue.add(MapEntry(neighbor, distance + neighborDistance));
        }
      }

      // Sort queue by accumulated distance to find shortest BFS path (simulating JS sort)
      final sortedList = queue.toList()..sort((a, b) => a.value.compareTo(b.value));
      queue.clear();
      queue.addAll(sortedList);
    }

    return null;
  }

  /// Calculates turn angle between three nodes A -> B -> C
  static double calculateAngle(Node A, Node B, Node C) {
    final pre = A.coordinates;
    final curr = B.coordinates;
    final post = C.coordinates;

    final ab = [curr[0] - pre[0], curr[1] - pre[1]];
    final bd = [post[0] - curr[0], post[1] - curr[1]];

    final crossProduct = ab[0] * bd[1] - ab[1] * bd[0];
    final dotProduct = ab[0] * bd[0] + ab[1] * bd[1];

    final angle = math.atan2(crossProduct, dotProduct);
    var angleDegrees = (angle * 180.0) / math.pi;
    return angleDegrees % 360.0;
  }

  /// Calculates direction heading for Heading-Up layout
  static double calculateDirection(Node from, Node to) {
    final x1 = from.coordinates[0];
    final y1 = from.coordinates[1];
    final x2 = to.coordinates[0];
    final y2 = to.coordinates[1];

    final dx = x2 - x1;
    final dy = y2 - y1;

    final angleRadians = math.atan2(dy, dx);
    final angleDegrees = (angleRadians * 180.0) / math.pi;

    // Apply Heading-Up formula: theta = alpha + 90
    final headingUpAngle = (angleDegrees + 90.0 + 360.0) % 360.0;
    return headingUpAngle;
  }

  /// Normalizes angle to be between 0 and 360
  static double reducedAngle(double angle) {
    return ((angle % 360.0) + 360.0) % 360.0;
  }

  /// Build a complete adjacency matrix/map from a list of nodes
  static Map<String, Map<String, double>> buildGraph(List<Node> nodes) {
    final graph = <String, Map<String, double>>{};
    for (var node in nodes) {
      graph[node.id] = {};
      for (var neighbor in node.neighbors) {
        graph[node.id]![neighbor.id] = neighbor.distance;
      }
    }
    return graph;
  }
}
