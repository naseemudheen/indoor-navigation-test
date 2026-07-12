import 'dart:convert';
import '../models/node.dart';
import '../models/marker.dart';
import 'api_client.dart';

class MapApi {
  static Future<MapDataResponse> fetchMapData(int floorId) async {
    try {
      final response = await ApiClient.get('/api/v1/map/data/$floorId');
      final data = json.decode(response.body);

      final nodesJson = data['nodes'] as List? ?? [];
      final markersJson = data['markers'] as List? ?? [];

      // Replicate normalization from React frontend:
      // Map node.floor to 0 if it is missing or null.
      final nodes = nodesJson.map((n) {
        final nodeMap = Map<String, dynamic>.from(n);
        if (!nodeMap.containsKey('floor') || nodeMap['floor'] == null) {
          nodeMap['floor'] = 0;
        }
        return Node.fromJson(nodeMap);
      }).toList();

      final markers = markersJson.map((m) => MapMarker.fromJson(m)).toList();

      return MapDataResponse(nodes: nodes, markers: markers);
    } catch (e) {
      rethrow;
    }
  }
}

class MapDataResponse {
  final List<Node> nodes;
  final List<MapMarker> markers;

  MapDataResponse({required this.nodes, required this.markers});
}
