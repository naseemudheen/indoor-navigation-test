Here are the release notes generated from the commits on the `optimization` branch:

# Release Notes: Optimization Branch

## 🚀 Features & Enhancements

### 🗺️ Map & Navigation
* **Heading-Up Navigation**: The map now dynamically rotates to align with your travel direction for a more intuitive navigation experience.
* **Smart Map Rotation**: Map rotation now centers strictly around the user's current location. Floorplan elements natively maintain their correct orientation during map rotation.
* **Animated Pathing**: Implemented smooth animated path drawing and a current position pointer utilizing D3 transitions.
* **Destination Reached Flow**: Added comprehensive "Destination Reached" logic with a dedicated UI and enhanced navigation controls.

### 🔎 Search Experience
* **Upgraded Search Inputs**: Search fields have been significantly enhanced with clear buttons, keyboard navigation support, updated active field styling, and a new slide-in animation for search results.

## 💅 UI & Animation Polish
* **Dynamic Floorplans**: Icons, unit texts, and labels on the floorplan now smoothly animate their positions and rotations using D3 transitions.
* **Crisper Pathing**: D3 floorplan paths now use completely round stroke caps and joins for a much cleaner layout.
* **Icon Refinements**: Icon positioning and sizing was polished by replacing hardcoded offsets with proper centering attributes. Label visibility thresholds have also been fine-tuned.
* **Animation Tuning**: 
  * Decreased the floorplan path transition duration from 800ms to 500ms for a snappier feel.
  * Updated D3 easing functions from `easeCircleInOut` to `easeQuadInOut` and refined CSS rotation transitions.

## 🛠️ Refactoring & Reliability
* **Rotation Fixes**: Centered the floorplan rotation properly by moving the underlying SVG group.
* **Zoom Targeting**: Fixed an issue with navigation zoom targeting to ensure it accurately points to the next path unit.
* **Helper Robustness**: Added strict coordinate validation to helper functions (`angleFinder`, `directionFinder`).
