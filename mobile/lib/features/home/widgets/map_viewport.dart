import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/icon_map.dart';
import '../../../core/models/marker.dart';
import '../../../core/models/node.dart';
import '../../../core/utils/coordinate_utils.dart';
import 'floorplan_painter.dart';
import 'dart:math' as math;

class MapViewport extends StatefulWidget {
  final String floorplanAsset;
  final double floorplanWidth;
  final double floorplanHeight;
  final DigitisationZone digitisationZone;
  final double rotation; // In degrees
  final List<Node> nodes;
  final List<MapMarker> markers;
  final List<String> activePath;
  final String? startNodeId;
  final String? endNodeId;
  final String? stairNodeId;
  final String? currentNodeId;
  final double? currentUserX;
  final double? currentUserY;
  final Function(String nodeId)? onNodeClicked;
  final TransformationController transformationController;

  const MapViewport({
    super.key,
    required this.floorplanAsset,
    required this.floorplanWidth,
    required this.floorplanHeight,
    required this.digitisationZone,
    required this.rotation,
    required this.nodes,
    required this.markers,
    required this.activePath,
    this.startNodeId,
    this.endNodeId,
    this.stairNodeId,
    this.currentNodeId,
    this.currentUserX,
    this.currentUserY,
    this.onNodeClicked,
    required this.transformationController,
  });

  @override
  State<MapViewport> createState() => _MapViewportState();
}

class _MapViewportState extends State<MapViewport> {
  double _zoomScale = 1.0;

  @override
  void initState() {
    super.initState();
    widget.transformationController.addListener(_handleZoomChange);
  }

  @override
  void dispose() {
    widget.transformationController.removeListener(_handleZoomChange);
    super.dispose();
  }

  void _handleZoomChange() {
    final scale = widget.transformationController.value.getMaxScaleOnAxis();
    if (scale != _zoomScale) {
      setState(() {
        _zoomScale = scale;
      });
    }
  }

  @override
  @override
  Widget build(BuildContext context) {
    final currentIndex = widget.activePath.indexOf(widget.currentNodeId ?? '');
    final coveredOffsets = <Offset>[];
    final remainingOffsets = <Offset>[];

    for (int i = 0; i < widget.activePath.length; i++) {
      final id = widget.activePath[i];
      final node = widget.nodes.firstWhere((n) => n.id == id, orElse: () => Node(id: id, coordinates: [0, 0], neighbors: []));
      if (node.coordinates.length == 2 && node.coordinates[0] != 0) {
        final pos = CoordinateUtils.getRealPointCoordinateRelativeToDigitisationZone(
          widget.digitisationZone,
          0.0,
          node.coordinates[0],
          node.coordinates[1],
        );
        final offset = Offset(pos[0], pos[1]);
        
        if (currentIndex != -1) {
          if (i <= currentIndex) {
            coveredOffsets.add(offset);
          }
          if (i >= currentIndex) {
            remainingOffsets.add(offset);
          }
        } else {
          remainingOffsets.add(offset);
        }
      }
    }

    final double adjustedScale = _zoomScale > 1.0 ? _zoomScale : 1.0;

    return InteractiveViewer(
      transformationController: widget.transformationController,
      maxScale: 15.0,
      minScale: 0.1,
      boundaryMargin: const EdgeInsets.all(2000),
      constrained: false,
      child: Transform(
        transform: Matrix4.identity()
          ..translate(widget.digitisationZone.origin[0], widget.digitisationZone.origin[1])
          ..rotateZ(-widget.rotation * math.pi / 180.0)
          ..translate(-widget.digitisationZone.origin[0], -widget.digitisationZone.origin[1]),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            // 1. Background Floor Plan SVG Map
            SvgPicture.asset(
              widget.floorplanAsset,
              width: widget.floorplanWidth,
              height: widget.floorplanHeight,
              fit: BoxFit.contain,
              alignment: Alignment.topLeft,
            ),

            // 2. Custom Painter layer for path line drawing
            Positioned.fill(
              child: CustomPaint(
                painter: FloorplanPainter(
                  remainingPath: remainingOffsets,
                  coveredPath: coveredOffsets,
                  scale: _zoomScale,
                ),
              ),
            ),

            // 3. Overlay pins and markers
            ...widget.nodes.map((node) {
              final isStart = node.id == widget.startNodeId;
              final isEnd = node.id == widget.endNodeId;
              final isStair = node.id == widget.stairNodeId;

              if (!isStart && !isEnd && !isStair) return const SizedBox.shrink();

              final pos = CoordinateUtils.getRealPointCoordinateRelativeToDigitisationZone(
                widget.digitisationZone,
                0.0,
                node.coordinates[0],
                node.coordinates[1],
              );

              final pinSize = 36.0 / adjustedScale;
              final color = isStart
                  ? AppColors.startPin
                  : (isEnd ? AppColors.endPin : AppColors.stairPin);

              return Positioned(
                left: pos[0] - (pinSize / 2),
                top: pos[1] - pinSize,
                child: GestureDetector(
                  onTap: () => widget.onNodeClicked?.call(node.id),
                  child: Icon(
                    Icons.location_on,
                    color: color,
                    size: pinSize,
                  ),
                ),
              );
            }),

            // 3.5. Current User Location Pointer
            if ((widget.currentUserX != null && widget.currentUserY != null) || widget.currentNodeId != null)
              Builder(
                builder: (context) {
                  double? targetX = widget.currentUserX;
                  double? targetY = widget.currentUserY;

                  if (targetX == null || targetY == null) {
                    final currentNode = widget.nodes.firstWhere(
                      (n) => n.id == widget.currentNodeId,
                      orElse: () => Node(id: '', coordinates: [], neighbors: []),
                    );
                    if (currentNode.coordinates.length == 2 && currentNode.id.isNotEmpty) {
                      targetX = currentNode.coordinates[0];
                      targetY = currentNode.coordinates[1];
                    }
                  }

                  if (targetX != null && targetY != null) {
                    final pos = CoordinateUtils.getRealPointCoordinateRelativeToDigitisationZone(
                      widget.digitisationZone,
                      0.0,
                      targetX,
                      targetY,
                    );
                    final pointerSize = 36.0 / adjustedScale;
                    return Positioned(
                      left: pos[0] - (pointerSize / 2),
                      top: pos[1] - (pointerSize / 2),
                      child: Transform.rotate(
                        angle: widget.rotation * math.pi / 180.0,
                        child: SvgPicture.asset(
                          'assets/icons/start-point.svg',
                          width: pointerSize,
                          height: pointerSize,
                        ),
                      ),
                    );
                  }
                  return const SizedBox.shrink();
                },
              ),

            // 4. Map markers (text labels and category icons)
            ...widget.markers.map((marker) {
              final pos = CoordinateUtils.getRealPointCoordinateRelativeToDigitisationZone(
                widget.digitisationZone,
                0.0,
                marker.coordinates[0],
                marker.coordinates[1],
              );

              if (marker.type == 'icon') {
                final iconSize = 18.0 / adjustedScale;
                final iconPath = AppIconMap.getIconPath(marker.iconType ?? 'door');

                return Positioned(
                  left: pos[0] - (iconSize / 2),
                  top: pos[1] - (iconSize / 2),
                  child: SvgPicture.asset(
                    iconPath,
                    width: iconSize,
                    height: iconSize,
                  ),
                );
              } else {
                final fontSize = 7.5 / adjustedScale;
                if (marker.text == null || marker.text!.isEmpty) return const SizedBox.shrink();

                return Positioned(
                  left: pos[0] - 100,
                  top: pos[1],
                  child: SizedBox(
                    width: 200,
                    child: Text(
                      marker.text!,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: AppColors.primaryDark,
                        fontSize: fontSize,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                );
              }
            }),
          ],
        ),
      ),
    );
  }
}
