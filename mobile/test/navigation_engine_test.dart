import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/models/node.dart';
import 'package:mobile/core/services/navigation_engine.dart';

void main() {
  group('NavigationEngine Tests', () {
    test('Dijkstra finds shortest path in simple graph', () {
      final graph = {
        'A': {'B': 2.0, 'C': 5.0},
        'B': {'A': 2.0, 'C': 1.0, 'D': 10.0},
        'C': {'A': 5.0, 'B': 1.0, 'D': 2.0},
        'D': {'B': 10.0, 'C': 2.0},
      };

      final path = NavigationEngine.findShortestPath(graph, 'A', 'D');
      // Shortest route is A -> B -> C -> D with total weight 5
      expect(path, equals(['A', 'B', 'C', 'D']));
    });

    test('pathSeparator correctly groups node path by floor level', () {
      final allNodes = [
        Node(id: 'node-1', coordinates: [0.0, 0.0], neighbors: [], floor: 0),
        Node(id: 'node-2', coordinates: [0.0, 0.0], neighbors: [], floor: 0),
        Node(id: 'node-stair-0', coordinates: [0.0, 0.0], neighbors: [], floor: 0),
        Node(id: 'node-stair-1', coordinates: [0.0, 0.0], neighbors: [], floor: 1),
        Node(id: 'node-3', coordinates: [0.0, 0.0], neighbors: [], floor: 1),
      ];

      final path = ['node-1', 'node-2', 'node-stair-0', 'node-stair-1', 'node-3'];
      final separated = NavigationEngine.pathSeparator(allNodes, path);

      expect(separated.length, equals(2));
      expect(separated[0].floor, equals(0));
      expect(separated[0].path, equals(['node-1', 'node-2', 'node-stair-0']));
      expect(separated[1].floor, equals(1));
      expect(separated[1].path, equals(['node-stair-1', 'node-3']));
    });

    test('findNearestStair performs correct BFS search', () {
      final floorMap = [
        Node(
          id: 'start-node',
          coordinates: [0.0, 0.0],
          neighbors: [Neighbor(id: 'intermediate-node', coordinates: [0.0, 0.0], distance: 2.0)],
          floor: 0,
        ),
        Node(
          id: 'intermediate-node',
          coordinates: [0.0, 0.0],
          neighbors: [
            Neighbor(id: 'path-12', coordinates: [0.0, 0.0], distance: 1.0) // path-12 is a predefined stair node
          ],
          floor: 0,
        ),
        Node(
          id: 'path-12',
          coordinates: [0.0, 0.0],
          neighbors: [],
          floor: 0,
        ),
      ];

      final nearestStair = NavigationEngine.findNearestStair(floorMap, 'start-node');
      expect(nearestStair, equals('path-12'));
    });
  });
}
