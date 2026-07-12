import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/map_api.dart';
import '../models/marker.dart';
import '../models/node.dart';
import 'navigation_engine.dart';

class MapState {
  final List<Node> nodes;
  final List<MapMarker> markers;
  final int activeFloor; // Level: 0 (G), 1 (1st), 2 (2nd), -1 (B), etc.
  final String status; // 'idle' | 'loading' | 'succeeded' | 'failed'
  final String? error;
  
  // Navigation Routing States
  final Node? startPoint;
  final Node? endPoint;
  final List<String> activeFloorPath; // Path Node IDs for the currently viewed floor
  final List<FloorPath> fullPath;     // Full path divided by floors
  final Node? stairPoint;            // Connecting staircase node

  MapState({
    this.nodes = const [],
    this.markers = const [],
    this.activeFloor = 0,
    this.status = 'idle',
    this.error,
    this.startPoint,
    this.endPoint,
    this.activeFloorPath = const [],
    this.fullPath = const [],
    this.stairPoint,
  });

  MapState copyWith({
    List<Node>? nodes,
    List<MapMarker>? markers,
    int? activeFloor,
    String? status,
    String? error,
    Node? startPoint,
    Node? endPoint,
    List<String>? activeFloorPath,
    List<FloorPath>? fullPath,
    Node? stairPoint,
  }) {
    return MapState(
      nodes: nodes ?? this.nodes,
      markers: markers ?? this.markers,
      activeFloor: activeFloor ?? this.activeFloor,
      status: status ?? this.status,
      error: error ?? this.error,
      startPoint: startPoint ?? this.startPoint,
      endPoint: endPoint ?? this.endPoint,
      activeFloorPath: activeFloorPath ?? this.activeFloorPath,
      fullPath: fullPath ?? this.fullPath,
      stairPoint: stairPoint ?? this.stairPoint,
    );
  }
}

class MapStateNotifier extends StateNotifier<MapState> {
  MapStateNotifier() : super(MapState());

  /// Fetches hospital map data (nodes, markers) from backend API
  Future<void> fetchHospitalMap(int floorId) async {
    state = state.copyWith(status: 'loading', error: null);
    try {
      final response = await MapApi.fetchMapData(floorId);
      state = state.copyWith(
        status: 'succeeded',
        nodes: response.nodes,
        markers: response.markers,
      );
    } catch (e) {
      state = state.copyWith(status: 'failed', error: e.toString());
    }
  }

  void setActiveFloor(int floor) {
    state = state.copyWith(activeFloor: floor);
    _updateActiveFloorPath();
  }

  void selectStartPoint(Node start) {
    state = state.copyWith(startPoint: start, activeFloor: start.floor);
    _calculateRoute();
  }

  void selectEndPoint(Node end) {
    state = state.copyWith(endPoint: end);
    _calculateRoute();
  }

  void swapPoints() {
    final oldStart = state.startPoint;
    final oldEnd = state.endPoint;
    state = state.copyWith(
      startPoint: oldEnd,
      endPoint: oldStart,
      activeFloor: oldEnd?.floor ?? state.activeFloor,
    );
    _calculateRoute();
  }

  void clearRoute() {
    state = state.copyWith(
      startPoint: null,
      endPoint: null,
      activeFloorPath: [],
      fullPath: [],
      stairPoint: null,
    );
  }

  /// Calculates shortest path route using NavigationEngine (Dijkstra)
  void _calculateRoute() {
    final start = state.startPoint;
    final end = state.endPoint;

    if (start == null || end == null) return;

    final graph = NavigationEngine.buildGraph(state.nodes);
    
    // Check if start & end are on same floor
    if (start.floor == end.floor) {
      final pathIds = NavigationEngine.findShortestPath(graph, start.id, end.id);
      final floorPath = FloorPath(floor: start.floor, path: pathIds);
      
      state = state.copyWith(
        fullPath: [floorPath],
        stairPoint: null,
      );
    } else {
      // Inter-floor navigation: Find nearest staircase from start node
      final nearestStairId = NavigationEngine.findNearestStair(state.nodes, start.id);
      if (nearestStairId != null) {
        final stairNode = state.nodes.firstWhere((n) => n.id == nearestStairId);
        
        // Find path 1: Start -> Staircase
        final path1 = NavigationEngine.findShortestPath(graph, start.id, stairNode.id);
        
        // Find corresponding staircase connector node on end floor
        // Find neighbor staircase that has the end node's floor
        final stairNeighbor = stairNode.neighbors.firstWhere(
          (neighbor) {
            final neighborNode = state.nodes.firstWhere(
              (n) => n.id == neighbor.id,
              orElse: () => Node(id: neighbor.id, coordinates: [0, 0], neighbors: [], floor: -99),
            );
            return neighborNode.floor == end.floor;
          },
          orElse: () => Neighbor(id: '', coordinates: [], distance: 0),
        );

        if (stairNeighbor.id.isNotEmpty) {
          final otherStairNode = state.nodes.firstWhere((n) => n.id == stairNeighbor.id);
          
          // Find path 2: Other Staircase -> Destination
          final path2 = NavigationEngine.findShortestPath(graph, otherStairNode.id, end.id);
          
          state = state.copyWith(
            stairPoint: stairNode,
            fullPath: [
              FloorPath(floor: start.floor, path: path1),
              FloorPath(floor: end.floor, path: path2),
            ],
          );
        } else {
          // Fallback: Direct route if staircase connector neighbor not found
          final pathIds = NavigationEngine.findShortestPath(graph, start.id, end.id);
          state = state.copyWith(
            fullPath: [FloorPath(floor: start.floor, path: pathIds)],
            stairPoint: null,
          );
        }
      } else {
        // Fallback: Direct route if no staircase found
        final pathIds = NavigationEngine.findShortestPath(graph, start.id, end.id);
        state = state.copyWith(
          fullPath: [FloorPath(floor: start.floor, path: pathIds)],
          stairPoint: null,
        );
      }
    }

    _updateActiveFloorPath();
  }

  void _updateActiveFloorPath() {
    final currentFloorPaths = state.fullPath.where((fp) => fp.floor == state.activeFloor).toList();
    if (currentFloorPaths.isNotEmpty) {
      state = state.copyWith(activeFloorPath: currentFloorPaths.first.path);
    } else {
      state = state.copyWith(activeFloorPath: []);
    }
  }
}

final mapStateProvider = StateNotifierProvider<MapStateNotifier, MapState>((ref) {
  return MapStateNotifier();
});
