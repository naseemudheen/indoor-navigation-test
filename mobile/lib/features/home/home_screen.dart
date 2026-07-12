import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lottie/lottie.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/featured_rooms.dart';
import '../../core/models/node.dart';
import '../../core/services/map_state_provider.dart';
import '../../core/utils/coordinate_utils.dart';
import '../auth/login_screen.dart';
import '../help/help_screen.dart';
import '../navigation/directions_screen.dart';
import '../navigation/navigation_screen.dart';
import 'widgets/map_viewport.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../core/constants/env_config.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final TransformationController _transformationController = TransformationController();
  final TextEditingController _searchController = TextEditingController();
  List<Node> _searchResults = [];
  bool _isSearching = false;
  int _currentBottomNavIndex = 0;

  @override
  void initState() {
    super.initState();
    // Fetch map data on initialization
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(mapStateProvider.notifier).fetchHospitalMap(1);
    });
  }

  @override
  void dispose() {
    _transformationController.dispose();
    _searchController.dispose();
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

  void _onSearchSelect(Node node) {
    setState(() {
      _searchController.text = node.name ?? '';
      _searchResults = [];
      _isSearching = false;
    });
    FocusScope.of(context).unfocus();

    // Map floor level in API matching UI indices:
    // We update the active floor to the selected node's floor
    ref.read(mapStateProvider.notifier).setActiveFloor(node.floor);
    
    // Animate map viewport to focus on the selected node coordinate
    _focusOnCoordinate(node.coordinates[0], node.coordinates[1]);
  }

  void _focusOnCoordinate(double pctX, double pctY) {
    // Coordinate workspace scale: 1080x1080
    const mapSize = 1080.0;
    
    final pos = CoordinateUtils.getRealPointCoordinateRelativeToDigitisationZone(
      DigitisationZone(origin: const [100, 800], width: mapSize, height: mapSize),
      0.0,
      pctX,
      pctY,
    );

    // Compute transformation matrix for InteractiveViewer to center at pos
    // Zoom scale = 4.0
    const zoomLevel = 4.0;
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    
    final x = (screenWidth / 2) - (pos[0] * zoomLevel);
    final y = (screenHeight / 2) - (pos[1] * zoomLevel);

    _transformationController.value = Matrix4.identity()
      ..translate(x, y)
      ..scale(zoomLevel);
  }

  Future<void> _startQRScan() async {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => Scaffold(
          appBar: AppBar(
            title: const Text('Scan QR to Start'),
            backgroundColor: AppColors.primary,
          ),
          body: MobileScanner(
            onDetect: (capture) async {
              final List<Barcode> barcodes = capture.barcodes;
              if (barcodes.isNotEmpty) {
                final code = barcodes.first.rawValue;
                if (code != null) {
                  // Pop scanner immediately
                  Navigator.of(context).pop();
                  _resolveQR(code);
                }
              }
            },
          ),
        ),
      ),
    );
  }

  Future<void> _resolveQR(String code) async {
    // Show loading dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: CircularProgressIndicator(color: AppColors.primary),
      ),
    );

    try {
      final res = await http.post(
        Uri.parse('${EnvConfig.baseUrl}/api/qr/resolve'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'qr_code': code}),
      );

      // Pop loading dialog
      if (mounted) Navigator.of(context).pop();

      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        final nodeId = data['node_id'] as String;
        final nodeName = data['name'] as String? ?? 'QR Location';
        final x = (data['x_coordinate'] as num? ?? 0.0).toDouble();
        final y = (data['y_coordinate'] as num? ?? 0.0).toDouble();

        // Check if node exists in state, otherwise create mock node
        final state = ref.read(mapStateProvider);
        Node? resolvedNode = state.nodes.firstWhere(
          (n) => n.id == nodeId,
          orElse: () => Node(
            id: nodeId,
            name: nodeName,
            coordinates: [x, y],
            floor: 0,
            neighbors: [],
          ),
        );

        // Move to Directions setup passing the start point
        if (mounted) {
          ref.read(mapStateProvider.notifier).selectStartPoint(resolvedNode);
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => DirectionsScreen(prefilledStart: resolvedNode),
            ),
          );
        }
      } else {
        _showErrorDialog('Invalid or inactive QR code.');
      }
    } catch (e) {
      if (mounted) Navigator.of(context).pop(); // Pop loading
      _showErrorDialog('Error contacting QR resolve API.');
    }
  }

  void _showErrorDialog(String msg) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('QR Code Error'),
        content: Text(msg),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK', style: TextStyle(color: AppColors.primary)),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(mapStateProvider);

    if (state.status == 'loading') {
      return Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Lottie.asset(
                'assets/loader.json',
                width: 240,
                height: 120,
              ),
              const SizedBox(height: 16),
              const Text(
                'Map is Loading...',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ],
          ),
        ),
      );
    }

    if (state.status == 'failed') {
      return Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 64, color: Colors.red),
                const SizedBox(height: 16),
                Text(
                  state.error ?? 'Failed to load map data',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => ref.read(mapStateProvider.notifier).fetchHospitalMap(1),
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                  child: const Text('Retry', style: TextStyle(color: Colors.white)),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      body: Stack(
        children: [
          // 1. Zoomable/Pannable Map Viewport
          Positioned.fill(
            child: state.nodes.isEmpty
                ? const Center(child: Text('No Map Nodes Found'))
                : MapViewport(
                    floorplanAsset: 'assets/floors/simple.svg',
                    floorplanWidth: 1080.0,
                    floorplanHeight: 1080.0,
                    digitisationZone: DigitisationZone(
                      origin: const [100, 800],
                      width: 1080.0,
                      height: 1080.0,
                    ),
                    rotation: 0.0,
                    nodes: state.nodes,
                    markers: state.markers,
                    activePath: state.activeFloorPath,
                    startNodeId: state.startPoint?.id,
                    endNodeId: state.endPoint?.id,
                    stairNodeId: state.stairPoint?.id,
                    transformationController: _transformationController,
                  ),
          ),

          // 2. Search & Featured Category Header Overlay
          Positioned(
            top: MediaQuery.of(context).padding.top + 12,
            left: 16,
            right: 16,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Search Input Field
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black26,
                        blurRadius: 4,
                        offset: Offset(0, 2),
                      )
                    ],
                  ),
                  child: TextField(
                    controller: _searchController,
                    onChanged: (val) => _handleSearch(val, state.nodes),
                    decoration: InputDecoration(
                      hintText: 'Where to go ?',
                      prefixIcon: const Icon(Icons.search, color: Colors.grey),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, color: Colors.grey),
                              onPressed: () {
                                _searchController.clear();
                                _handleSearch('', state.nodes);
                              },
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                ),
                
                // Featured Room Buttons List (horizontal scroll)
                if (!_isSearching)
                  Container(
                    margin: const EdgeInsets.only(top: 12),
                    height: 40,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: featuredRooms.length,
                      itemBuilder: (context, index) {
                        final room = featuredRooms[index];
                        return Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: ActionChip(
                            avatar: const Icon(Icons.room, size: 16, color: AppColors.primary),
                            label: Text(room.name ?? ''),
                            onPressed: () {
                              ref.read(mapStateProvider.notifier).selectEndPoint(room);
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (context) => DirectionsScreen(prefilledEnd: room),
                                ),
                              );
                            },
                            backgroundColor: Colors.white,
                            shape: StadiumBorder(
                              side: BorderSide(color: Colors.grey.shade300, width: 0.5),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),

          // 3. Search suggestions dropdown
          if (_isSearching && _searchResults.isNotEmpty)
            Positioned(
              top: MediaQuery.of(context).padding.top + 70,
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
                  shrinkWrap: true,
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
                      subtitle: Text('${node.floor == 0 ? "Ground" : "${node.floor}th"} Floor'),
                      trailing: const Icon(Icons.north_west, size: 16, color: Colors.grey),
                      onTap: () => _onSearchSelect(node),
                    );
                  },
                ),
              ),
            ),

          // 4. Floating buttons overlay (bottom right)
          Positioned(
            bottom: 120,
            right: 16,
            child: Column(
              children: [
                // Scan QR floating action button
                FloatingActionButton(
                  heroTag: 'qr_scanner_fab',
                  onPressed: _startQRScan,
                  backgroundColor: Colors.green.shade600,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  child: const Icon(Icons.qr_code_scanner),
                ),
                const SizedBox(height: 12),
                
                // Directions setup floating action button
                FloatingActionButton(
                  heroTag: 'directions_fab',
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (context) => const DirectionsScreen()),
                    );
                  },
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  child: const Icon(Icons.directions),
                ),
              ],
            ),
          ),

          // 5. Floor switcher vertical slider overlay (bottom left)
          Positioned(
            bottom: 120,
            left: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: const [
                  BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 2))
                ],
              ),
              child: Column(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_drop_up, color: Colors.black54),
                    onPressed: () {
                      if (state.activeFloor < 2) {
                        ref.read(mapStateProvider.notifier).setActiveFloor(state.activeFloor + 1);
                      }
                    },
                  ),
                  InkWell(
                    onTap: () => ref.read(mapStateProvider.notifier).setActiveFloor(0),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      color: state.activeFloor == 0 ? AppColors.primary : Colors.transparent,
                      child: Text(
                        'G',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: state.activeFloor == 0 ? Colors.white : Colors.black54,
                        ),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.arrow_drop_down, color: Colors.black54),
                    onPressed: () {
                      if (state.activeFloor > -1) {
                        ref.read(mapStateProvider.notifier).setActiveFloor(state.activeFloor - 1);
                      }
                    },
                  ),
                ],
              ),
            ),
          ),
          
          // 6. Bottom Navigation Bar (fixed bottom)
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              height: 70,
              decoration: const BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(color: Colors.black26, blurRadius: 6, offset: Offset(0, -2))
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  // Map tab
                  _buildBottomNavItem(
                    index: 0,
                    icon: Icons.location_on,
                    label: 'Map',
                    isActive: _currentBottomNavIndex == 0,
                    onTap: () {
                      setState(() => _currentBottomNavIndex = 0);
                    },
                  ),
                  // Help tab
                  _buildBottomNavItem(
                    index: 1,
                    icon: Icons.help_outline,
                    label: 'Help',
                    isActive: _currentBottomNavIndex == 1,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (context) => const HelpScreen()),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavItem({
    required int index,
    required IconData icon,
    required String label,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              color: isActive ? Colors.grey.shade300 : Colors.transparent,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(
              icon,
              color: isActive ? AppColors.primary : Colors.black38,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: isActive ? AppColors.primary : Colors.black38,
            ),
          )
        ],
      ),
    );
  }
}
