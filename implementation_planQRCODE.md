# QR Code Scanning and Current Location Tracking Implementation Plan

## Goal Description
Implement a QR code scanning feature to automatically detect the user's current location on the floor map. The user will be able to:
1. Scan a QR code at the start to fetch their current location, then type their destination to calculate the route.
2. Scan a QR code mid-navigation to recalibrate their exact location if they deviate from the path.
3. View their current location marked on the floor map during navigation.

> [!IMPORTANT]
> **User Review Required:**
> We need to decide on a QR code scanning library. I recommend `@yudiel/react-qr-scanner` or `html5-qrcode` because they are robust and have good React support.
> Additionally, we need to decide what data the QR codes will hold. The simplest approach is for the QR code to hold a JSON string or a plain string with the node `id` and `floor` (e.g., `{"id":"node-123", "floor":0}`).

## Open Questions
- **QR Code Format**: Do you have existing physical QR codes with a specific data format, or will we generate them to match a format like `{"id": "node-1", "floor": 0}`?
- **QR Scanner Library**: Are you okay with using `@yudiel/react-qr-scanner` or `html5-qrcode`?

## Proposed Changes

### Dependencies
#### [MODIFY] package.json
- Add a new dependency for QR code scanning (e.g., `@yudiel/react-qr-scanner`).

---

### Components

#### [NEW] src/components/QRScannerModal.jsx
- A reusable modal component containing the QR reader.
- It will handle camera permissions and stream processing.
- Once a QR code is detected, it will parse the node ID and floor, and pass it back to the parent component.

#### [MODIFY] src/components/Floorplan.jsx
- Update the SVG drawing logic to render a pulsing "current location" dot (e.g., a blue circle with a pulse animation) at the current node's coordinates.
- Ensure the dot smoothly transitions to the next coordinate as the user moves.

---

### Pages

#### [MODIFY] src/pages/DirectionPage.jsx
- Add a "Scan QR for Current Location" button in the starting location input area.
- When clicked, open the `QRScannerModal`.
- On successful scan, automatically populate the starting location with the node from the QR code and proceed to destination selection.

#### [MODIFY] src/pages/NavigationPage.jsx
- Integrate the `QRScannerModal` for the mid-navigation recalibration feature.
- Add a floating action button or header button: "Recalibrate (Scan QR)".
- On successful scan, calculate a new route from the scanned node to the original destination and reset the navigation state (e.g., update the `count` or recalculate `detailedPath`).

## Verification Plan

### Automated Tests
- Validate that the QR code parser handles valid and invalid JSON safely.

### Manual Verification
- Test camera permissions in a browser (or mobile browser).
- Generate a test QR code holding dummy node data.
- Scan the code on the `DirectionPage` and verify it sets the starting point.
- Start navigation, deviate from the path, scan another QR code, and verify the route successfully recalibrates from the new location.
- Observe the floor map to ensure the current location dot appears and pulses correctly.
