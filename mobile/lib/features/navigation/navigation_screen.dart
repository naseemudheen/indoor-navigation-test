import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/env_config.dart';
import '../../core/models/node.dart';
import '../../core/services/map_state_provider.dart';
import '../../core/services/navigation_engine.dart';
import '../../core/services/pedometer_service.dart';
import '../../core/services/sensor_service.dart';
import '../../core/utils/coordinate_utils.dart';
import '../home/widgets/map_viewport.dart';
import 'dart:async';

class NavigationScreen extends ConsumerStatefulWidget {
  final List<FloorPath> fullPath;
  final Node startPoint;
  final Node endPoint;
  final Node? stairNode;
  final double totalDistance;

  const NavigationScreen({
    super.key,
    required this.fullPath,
    required this.startPoint,
    required this.endPoint,
    this.stairNode,
    required this.totalDistance,
  });

  @override
  ConsumerState<NavigationScreen> createState() => _NavigationScreenState();
}

class _NavigationScreenState extends ConsumerState<NavigationScreen> {
  final TransformationController _transformationController = TransformationController();
  
  int _currentPathIndex = 0; // Index in the active floor path segment
  int _currentFloorIndex = 0; // Index in the list of floors (fullPath)
  
  List<Node> _activeFloorNodes = [];
  List<String> _activeFloorPathIds = [];
  
  String _guidanceMessage = 'Go Straight To Next Point';
  double _currentRotation = 0.0;
  double _remainingDistance = 0.0;
  
  bool _isAutoMode = false;
  double _distanceCoveredOnSegment = 0.0;
  static const double _strideLength = 0.75; // Stride length in meters

  StreamSubscription<double>? _compassSubscription;

  @override
  void initState() {
    super.initState();
    _remainingDistance = widget.totalDistance;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _setupActiveFloor();
    });
  }

  @override
  void dispose() {
    _compassSubscription?.cancel();
    _transformationController.dispose();
    Future.microtask(() {
      ref.read(mapStateProvider.notifier).clearRoute();
    });
    super.dispose();
  }

  void _setupActiveFloor() {
    final state = ref.read(mapStateProvider);
    final activeFloorPath = widget.fullPath[_currentFloorIndex];
    
    // Set active floor level in StateNotifier to load corresponding UI floor map
    ref.read(mapStateProvider.notifier).setActiveFloor(activeFloorPath.floor);
    
    setState(() {
      _activeFloorPathIds = activeFloorPath.path;
      _activeFloorNodes = state.nodes;
      _currentPathIndex = 0;
      _distanceCoveredOnSegment = 0.0;
      _updateGuidanceAndRotation();
    });
  }

  void _updateGuidanceAndRotation() {
    if (_activeFloorPathIds.isEmpty || _currentPathIndex >= _activeFloorPathIds.length) return;

    final allNodes = ref.read(mapStateProvider).nodes;
    final currNodeId = _activeFloorPathIds[_currentPathIndex];
    final currNode = allNodes.firstWhere((n) => n.id == currNodeId);

    // Calculate heading direction of the segment (Heading-Up)
    double targetRotation = _currentRotation;
    String msg = 'Go Straight To Next Point';

    if (_currentPathIndex < _activeFloorPathIds.length - 1) {
      final nextNodeId = _activeFloorPathIds[_currentPathIndex + 1];
      final nextNode = allNodes.firstWhere((n) => n.id == nextNodeId);
      targetRotation = NavigationEngine.calculateDirection(currNode, nextNode);

      // Calculate turn prompt based on subsequent nodes
      if (_currentPathIndex > 0) {
        final prevNodeId = _activeFloorPathIds[_currentPathIndex - 1];
        final prevNode = allNodes.firstWhere((n) => n.id == prevNodeId);
        
        double angle = NavigationEngine.calculateAngle(prevNode, currNode, nextNode);
        if (angle < 0) angle += 360;

        if (angle > 0 && angle <= 45) {
          msg = 'Turn slightly right';
        } else if (angle > 45 && angle <= 135) {
          msg = 'Turn right';
        } else if (angle > 135 && angle <= 225) {
          msg = 'Turn slightly left';
        } else if (angle > 225 && angle <= 315) {
          msg = 'Turn left';
        }
      }
    } else {
      // Reached the end of the path on the active floor
      if (_currentFloorIndex < widget.fullPath.length - 1) {
        msg = 'Take Stairs / Lift to ${_getFloorName(widget.fullPath[_currentFloorIndex + 1].floor)}';
      } else {
        msg = 'Destination Reached';
      }
    }

    // Focus on active node coordinate with target rotation
    _focusOnCoordinate(currNode.coordinates[0], currNode.coordinates[1], targetRotation);

    setState(() {
      _guidanceMessage = msg;
      _currentRotation = targetRotation;
      if (_currentPathIndex == _activeFloorPathIds.length - 1 && _currentFloorIndex == widget.fullPath.length - 1) {
        _remainingDistance = 0.0;
      }
    });
  }

  void _focusOnCoordinate(double pctX, double pctY, double rotation) {
    const mapSize = 1080.0;
    
    final pos = CoordinateUtils.getRealPointCoordinateRelativeToDigitisationZone(
      DigitisationZone(origin: const [100, 800], width: mapSize, height: mapSize),
      rotation,
      pctX,
      pctY,
    );

    const zoomLevel = 3.5;
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    
    final x = (screenWidth / 2) - (pos[0] * zoomLevel);
    final y = (screenHeight / 2) - (pos[1] * zoomLevel);

    _transformationController.value = Matrix4.identity()
      ..translate(x, y)
      ..scale(zoomLevel);
  }

  void _handleNextClick() {
    if (_currentPathIndex >= _activeFloorPathIds.length - 1) {
      if (_currentFloorIndex < widget.fullPath.length - 1) {
        // Advance to next floor
        setState(() {
          _currentFloorIndex++;
          _setupActiveFloor();
        });
      }
      return;
    }

    // Subtract segment length from remaining distance
    final allNodes = ref.read(mapStateProvider).nodes;
    final currNode = allNodes.firstWhere((n) => n.id == _activeFloorPathIds[_currentPathIndex]);
    final nextNode = allNodes.firstWhere((n) => n.id == _activeFloorPathIds[_currentPathIndex + 1]);
    
    final edge = currNode.neighbors.firstWhere(
      (n) => n.id == nextNode.id,
      orElse: () => Neighbor(id: '', coordinates: [], distance: 0.0),
    );
    final segmentMeters = EnvConfig.convertSvgDistanceToMeters(edge.distance);

    setState(() {
      _currentPathIndex++;
      _distanceCoveredOnSegment = 0.0;
      _remainingDistance = (_remainingDistance - segmentMeters).clamp(0.0, double.infinity);
      _updateGuidanceAndRotation();
    });
  }

  void _handlePrevClick() {
    if (_currentPathIndex <= 0) {
      if (_currentFloorIndex > 0) {
        // Go back to previous floor
        setState(() {
          _currentFloorIndex--;
          final prevFloorPath = widget.fullPath[_currentFloorIndex];
          ref.read(mapStateProvider.notifier).setActiveFloor(prevFloorPath.floor);
          _activeFloorPathIds = prevFloorPath.path;
          _currentPathIndex = _activeFloorPathIds.length - 1;
          _distanceCoveredOnSegment = 0.0;
          _updateGuidanceAndRotation();
        });
      }
      return;
    }

    // Add back segment length to remaining distance
    final allNodes = ref.read(mapStateProvider).nodes;
    final currNode = allNodes.firstWhere((n) => n.id == _activeFloorPathIds[_currentPathIndex]);
    final prevNode = allNodes.firstWhere((n) => n.id == _activeFloorPathIds[_currentPathIndex - 1]);
    
    final edge = prevNode.neighbors.firstWhere(
      (n) => n.id == currNode.id,
      orElse: () => Neighbor(id: '', coordinates: [], distance: 0.0),
    );
    final segmentMeters = EnvConfig.convertSvgDistanceToMeters(edge.distance);

    setState(() {
      _currentPathIndex--;
      _distanceCoveredOnSegment = 0.0;
      _remainingDistance += segmentMeters;
      _updateGuidanceAndRotation();
    });
  }

  void _onStepDetected() {
    if (!_isAutoMode) return;

    if (_activeFloorPathIds.isEmpty || _currentPathIndex >= _activeFloorPathIds.length - 1) return;

    final allNodes = ref.read(mapStateProvider).nodes;
    final currNode = allNodes.firstWhere((n) => n.id == _activeFloorPathIds[_currentPathIndex]);
    final nextNode = allNodes.firstWhere((n) => n.id == _activeFloorPathIds[_currentPathIndex + 1]);

    final edge = currNode.neighbors.firstWhere(
      (n) => n.id == nextNode.id,
      orElse: () => Neighbor(id: '', coordinates: [], distance: 0.0),
    );
    final segmentMeters = EnvConfig.convertSvgDistanceToMeters(edge.distance);

    _distanceCoveredOnSegment += _strideLength;
    if (_distanceCoveredOnSegment >= segmentMeters) {
      _handleNextClick();
    }
  }

  Future<void> _toggleAutoMode() async {
    final pedometer = ref.read(pedometerProvider.notifier);
    if (_isAutoMode) {
      pedometer.stopTracking();
      _compassSubscription?.cancel();
      _compassSubscription = null;
      setState(() => _isAutoMode = false);
    } else {
      pedometer.startTracking(_onStepDetected);
      
      // Re-align map rotation dynamically using the compass heading stream
      _compassSubscription = SensorService.compassHeadingStream.listen((heading) {
        setState(() {
          _currentRotation = heading;
        });
      });

      setState(() => _isAutoMode = true);
    }
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

  IconData _getTurnDirectionIcon(String msg) {
    final lower = msg.toLowerCase();
    if (lower.contains('right')) {
      return lower.contains('slightly') ? Icons.turn_slight_right : Icons.turn_right;
    }
    if (lower.contains('left')) {
      return lower.contains('slightly') ? Icons.turn_slight_left : Icons.turn_left;
    }
    if (lower.contains('stairs') || lower.contains('lift')) {
      return Icons.unfold_more;
    }
    if (lower.contains('reached')) {
      return Icons.check_circle_outline;
    }
    return Icons.navigation;
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(mapStateProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // 1. Zoomable & Rotatable Map Viewport
          Positioned.fill(
            child: _activeFloorPathIds.isEmpty
                ? const Center(child: Text('Calculating route...'))
                : MapViewport(
                    floorplanAsset: 'assets/floors/simple.svg',
                    floorplanWidth: 1080.0,
                    floorplanHeight: 1080.0,
                    digitisationZone: DigitisationZone(
                      origin: const [100, 800],
                      width: 1080.0,
                      height: 1080.0,
                    ),
                    rotation: _currentRotation,
                    nodes: state.nodes,
                    markers: state.markers,
                    activePath: _activeFloorPathIds,
                    startNodeId: widget.startPoint.id,
                    endNodeId: widget.endPoint.id,
                    stairNodeId: widget.stairNode?.id,
                    currentNodeId: _activeFloorPathIds.isNotEmpty && _currentPathIndex < _activeFloorPathIds.length
                        ? _activeFloorPathIds[_currentPathIndex]
                        : null,
                    transformationController: _transformationController,
                  ),
          ),

          // 2. Top Navigation Prompt Header
          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            left: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border, width: 0.8),
                boxShadow: AppColors.softShadow,
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: AppColors.primary.withOpacity(0.1),
                    child: Icon(
                      _getTurnDirectionIcon(_guidanceMessage),
                      color: AppColors.primary,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      _guidanceMessage,
                      style: const TextStyle(
                        color: AppColors.textDark,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  )
                ],
              ),
            ),
          ),

          // 3. Bottom controls and info panel
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
                boxShadow: [
                  BoxShadow(color: Colors.black12, blurRadius: 12, offset: Offset(0, -4))
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Remaining Info Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Remaining Distance',
                            style: TextStyle(color: AppColors.textMuted, fontSize: 12, fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${_remainingDistance.toStringAsFixed(1)} mtr',
                            style: const TextStyle(
                              color: AppColors.textDark,
                              fontWeight: FontWeight.bold,
                              fontSize: 22,
                            ),
                          )
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppColors.secondary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          _getFloorName(widget.fullPath[_currentFloorIndex].floor),
                          style: const TextStyle(
                            color: AppColors.secondary,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 24),
                  
                  // Waypoint Navigation Buttons
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.primary, size: 20),
                        style: IconButton.styleFrom(
                          backgroundColor: AppColors.primary.withOpacity(0.08),
                          padding: const EdgeInsets.all(12),
                        ),
                        onPressed: _handlePrevClick,
                      ),
                      
                      // Auto Mode toggle button
                      Container(
                        decoration: BoxDecoration(
                          gradient: _isAutoMode ? AppColors.primaryGradient : null,
                          borderRadius: BorderRadius.circular(30),
                          border: _isAutoMode ? null : Border.all(color: AppColors.primary, width: 1.5),
                          boxShadow: _isAutoMode ? [
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.3),
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            )
                          ] : null,
                        ),
                        child: ElevatedButton.icon(
                          onPressed: _toggleAutoMode,
                          icon: Icon(
                            _isAutoMode ? Icons.directions_walk_rounded : Icons.play_arrow_rounded,
                            color: _isAutoMode ? Colors.white : AppColors.primary,
                          ),
                          label: Text(
                            _isAutoMode ? 'Auto: ON' : 'Start Auto',
                            style: TextStyle(
                              color: _isAutoMode ? Colors.white : AppColors.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            elevation: 0,
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                          ),
                        ),
                      ),

                      // Simulate virtual step button
                      if (_isAutoMode)
                        Container(
                          decoration: BoxDecoration(
                            gradient: AppColors.secondaryGradient,
                            borderRadius: BorderRadius.circular(30),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.secondary.withOpacity(0.3),
                                blurRadius: 8,
                                offset: const Offset(0, 4),
                              )
                            ],
                          ),
                          child: ElevatedButton(
                            onPressed: _onStepDetected,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                            ),
                            child: const Text('Step', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          ),
                        ),

                      IconButton(
                        icon: const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.primary, size: 20),
                        style: IconButton.styleFrom(
                          backgroundColor: AppColors.primary.withOpacity(0.08),
                          padding: const EdgeInsets.all(12),
                        ),
                        onPressed: _handleNextClick,
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  
                  // Exit Button
                  TextButton.icon(
                    onPressed: () {
                      ref.read(pedometerProvider.notifier).stopTracking();
                      _compassSubscription?.cancel();
                      ref.read(mapStateProvider.notifier).clearRoute();
                      Navigator.of(context).popUntil((route) => route.isFirst);
                    },
                    icon: const Icon(Icons.close_rounded, color: Colors.redAccent, size: 18),
                    label: const Text(
                      'Exit Navigation',
                      style: TextStyle(
                        color: Colors.redAccent,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
