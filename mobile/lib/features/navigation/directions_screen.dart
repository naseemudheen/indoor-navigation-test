import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/env_config.dart';
import '../../core/models/node.dart';
import '../../core/services/map_state_provider.dart';
import '../../core/services/navigation_engine.dart';
import 'navigation_screen.dart';

class DirectionsScreen extends ConsumerStatefulWidget {
  final Node? prefilledStart;
  final Node? prefilledEnd;

  const DirectionsScreen({
    super.key,
    this.prefilledStart,
    this.prefilledEnd,
  });

  @override
  ConsumerState<DirectionsScreen> createState() => _DirectionsScreenState();
}

class _DirectionsScreenState extends ConsumerState<DirectionsScreen> {
  final TextEditingController _startController = TextEditingController();
  final TextEditingController _endController = TextEditingController();
  String _activeField = 'origin'; // 'origin' | 'destination'
  List<Node> _searchResults = [];
  bool _isSearching = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final notifier = ref.read(mapStateProvider.notifier);
      if (widget.prefilledStart != null) {
        notifier.selectStartPoint(widget.prefilledStart!);
        _startController.text = widget.prefilledStart!.name ?? '';
      }
      if (widget.prefilledEnd != null) {
        notifier.selectEndPoint(widget.prefilledEnd!);
        _endController.text = widget.prefilledEnd!.name ?? '';
      }
    });
  }

  @override
  void dispose() {
    _startController.dispose();
    _endController.dispose();
    super.dispose();
  }

  void _handleSearch(String query, List<Node> allNodes) {
    if (query.isEmpty) {
      setState(() {
        _searchResults = [];
        _isSearching = false;
      });
      return;
    }

    final filtered = allNodes.where((node) {
      final name = node.name?.toLowerCase() ?? '';
      return name.contains(query.toLowerCase());
    }).toList();

    setState(() {
      _searchResults = filtered;
      _isSearching = true;
    });
  }

  void _onSelectNode(Node node) {
    final notifier = ref.read(mapStateProvider.notifier);
    if (_activeField == 'origin') {
      notifier.selectStartPoint(node);
      _startController.text = node.name ?? '';
      _activeField = 'destination'; // Auto-focus destination next
    } else {
      notifier.selectEndPoint(node);
      _endController.text = node.name ?? '';
    }

    setState(() {
      _searchResults = [];
      _isSearching = false;
    });
    FocusScope.of(context).unfocus();
  }

  double _calculateTotalDistance(List<Node> allNodes, List<FloorPath> fullPath) {
    double totalSvgDistance = 0.0;

    for (var floorPath in fullPath) {
      final pathIds = floorPath.path;
      for (int i = 0; i < pathIds.length - 1; i++) {
        final nodeAId = pathIds[i];
        final nodeBId = pathIds[i + 1];

        final nodeA = allNodes.firstWhere(
          (n) => n.id == nodeAId,
          orElse: () => Node(id: '', coordinates: [], neighbors: []),
        );

        if (nodeA.id.isNotEmpty) {
          final neighbor = nodeA.neighbors.firstWhere(
            (n) => n.id == nodeBId,
            orElse: () => Neighbor(id: '', coordinates: [], distance: 0.0),
          );
          totalSvgDistance += neighbor.distance;
        }
      }
    }

    return EnvConfig.convertSvgDistanceToMeters(totalSvgDistance);
  }

  String _getFloorName(int floor) {
    switch (floor) {
      case 0:
        return 'Ground Floor';
      case 1:
        return '1st Floor';
      case 2:
        return '2nd Floor';
      case -1:
        return 'UnderGround Floor';
      default:
        return 'Floor $floor';
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(mapStateProvider);
    final totalDistance = _calculateTotalDistance(state.nodes, state.fullPath);
    final estMinutes = (totalDistance / 82.0).floor();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            ref.read(mapStateProvider.notifier).clearRoute();
            Navigator.of(context).pop();
          },
        ),
        title: const Text(
          'Find Destination',
          style: TextStyle(color: AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 18),
        ),
      ),
      body: Stack(
        children: [
          // 1. Search fields container at the top
          Positioned(
            top: 16,
            left: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border, width: 0.8),
                boxShadow: AppColors.softShadow,
              ),
              child: Row(
                children: [
                  // Indicators
                  Column(
                    children: [
                      Container(
                        width: 16,
                        height: 16,
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.2),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: AppColors.primary,
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      CustomPaint(
                        size: const Size(2, 34),
                        painter: DottedLinePainter(),
                      ),
                      const SizedBox(height: 4),
                      const Icon(Icons.location_on_rounded, color: Colors.redAccent, size: 20),
                    ],
                  ),
                  const SizedBox(width: 12),
                  // Inputs
                  Expanded(
                    child: Column(
                      children: [
                        // Starting Location Input
                        Focus(
                          onFocusChange: (focused) {
                            if (focused) setState(() => _activeField = 'origin');
                          },
                          child: TextField(
                            controller: _startController,
                            onChanged: (val) => _handleSearch(val, state.nodes),
                            style: const TextStyle(fontSize: 14, color: AppColors.textDark),
                            decoration: InputDecoration(
                              hintText: 'Choose Starting',
                              hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 14),
                              filled: true,
                              fillColor: Color(0xFFF8FAFC),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(
                                  color: Colors.grey.shade200,
                                  width: 0.8,
                                ),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(
                                  color: Colors.grey.shade200,
                                  width: 0.8,
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(
                                  color: AppColors.primary,
                                  width: 1.5,
                                ),
                              ),
                              suffixIcon: _startController.text.isNotEmpty
                                  ? IconButton(
                                      icon: const Icon(Icons.clear, size: 16, color: AppColors.textMuted),
                                      onPressed: () {
                                        _startController.clear();
                                        ref.read(mapStateProvider.notifier).clearRoute();
                                      },
                                    )
                                  : null,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        // Destination Location Input
                        Focus(
                          onFocusChange: (focused) {
                            if (focused) setState(() => _activeField = 'destination');
                          },
                          child: TextField(
                            controller: _endController,
                            onChanged: (val) => _handleSearch(val, state.nodes),
                            style: const TextStyle(fontSize: 14, color: AppColors.textDark),
                            decoration: InputDecoration(
                              hintText: 'Choose Destination',
                              hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 14),
                              filled: true,
                              fillColor: Color(0xFFF8FAFC),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(
                                  color: Colors.grey.shade200,
                                  width: 0.8,
                                ),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(
                                  color: Colors.grey.shade200,
                                  width: 0.8,
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(
                                  color: AppColors.primary,
                                  width: 1.5,
                                ),
                              ),
                              suffixIcon: _endController.text.isNotEmpty
                                  ? IconButton(
                                      icon: const Icon(Icons.clear, size: 16, color: AppColors.textMuted),
                                      onPressed: () {
                                        _endController.clear();
                                        ref.read(mapStateProvider.notifier).clearRoute();
                                      },
                                    )
                                  : null,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Swap Button
                  IconButton(
                    icon: const Icon(Icons.swap_vert_rounded, color: AppColors.primary, size: 28),
                    onPressed: () {
                      final oldStart = _startController.text;
                      _startController.text = _endController.text;
                      _endController.text = oldStart;
                      ref.read(mapStateProvider.notifier).swapPoints();
                    },
                  ),
                ],
              ),
            ),
          ),

          // 2. Search suggestions overlay
          if (_isSearching && _searchResults.isNotEmpty)
            Positioned(
              top: 170,
              left: 16,
              right: 16,
              bottom: 120,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: const [
                    BoxShadow(color: Colors.black26, blurRadius: 6, offset: Offset(0, 3)),
                  ],
                ),
                child: ListView.builder(
                  padding: EdgeInsets.zero,
                  itemCount: _searchResults.length,
                  itemBuilder: (context, index) {
                    final node = _searchResults[index];
                    return ListTile(
                      leading: const CircleAvatar(
                        backgroundColor: Color(0xFFD9D9D9),
                        child: Icon(Icons.location_on, color: Colors.grey),
                      ),
                      title: Text(node.name ?? '', style: const TextStyle(fontWeight: FontWeight.w600)),
                      subtitle: Text('${_getFloorName(node.floor)}'),
                      trailing: const Icon(Icons.north_west, size: 16, color: Colors.grey),
                      onTap: () => _onSelectNode(node),
                    );
                  },
                ),
              ),
            ),

          // 3. Navigation summary bottom panel (displays when route is ready)
          if (state.startPoint != null && state.endPoint != null && !_isSearching)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
                  boxShadow: [
                    BoxShadow(color: Colors.black12, blurRadius: 12, offset: Offset(0, -4))
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      state.endPoint?.name ?? '',
                      style: const TextStyle(
                        color: AppColors.primaryDark,
                        fontWeight: FontWeight.bold,
                        fontSize: 22,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _getFloorName(state.endPoint?.floor ?? 0),
                      style: TextStyle(color: Colors.grey.shade600, fontSize: 14, fontWeight: FontWeight.w500),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Icon(Icons.access_time_rounded, color: AppColors.primary, size: 20),
                        const SizedBox(width: 6),
                        Text(
                          '$estMinutes min',
                          style: const TextStyle(
                            color: AppColors.textDark,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Icon(Icons.directions_walk_rounded, color: AppColors.primary, size: 20),
                        const SizedBox(width: 6),
                        Text(
                          '${totalDistance.toStringAsFixed(1)} meters',
                          style: const TextStyle(
                            color: AppColors.textDark,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Container(
                      decoration: BoxDecoration(
                        gradient: AppColors.primaryGradient,
                        borderRadius: BorderRadius.circular(30),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withOpacity(0.3),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          )
                        ],
                      ),
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => NavigationScreen(
                                fullPath: state.fullPath,
                                startPoint: state.startPoint!,
                                endPoint: state.endPoint!,
                                stairNode: state.stairPoint,
                                totalDistance: totalDistance,
                              ),
                            ),
                          );
                        },
                        icon: const Icon(Icons.navigation_rounded, color: Colors.white),
                        label: const Text('Start Navigation', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          shadowColor: Colors.transparent,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class DottedLinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.grey.shade400
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    
    double startY = 0;
    while (startY < size.height) {
      canvas.drawLine(Offset(0, startY), Offset(0, startY + 4), paint);
      startY += 8;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
