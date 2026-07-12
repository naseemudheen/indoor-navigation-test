import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('Splash screen smoke test', (WidgetTester tester) async {
    // Build our app wrapped in ProviderScope and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: PaadhaApp(),
      ),
    );

    // Verify that the splash screen shows 'Beta' text
    expect(find.text('Beta'), findsOneWidget);
  });
}
