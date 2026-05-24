/**
 * mapAdapter.js
 * 
 * This utility function takes the unified API JSON payload for a floor and
 * parses it back into the separate arrays that the React frontend expects
 * (pathData, lowLabels, iconData, unitsData).
 * 
 * Once the API is ready, you can fetch the unified JSON and pass it through
 * this function before setting your React state.
 */

export function parseUnifiedFloorData(apiResponse, iconMap) {
    const pathData = [];
    const lowLabels = [];
    const labels = [];
    const iconsDataStructure = [];
    const unitsData = [];
    
    // Group icons by their type so we can build the iconData array properly
    const iconsByType = {};

    apiResponse.entities.forEach(entity => {
        // 1. Build pathData (Routing Graph)
        if (entity.routing && entity.routing.isNavigable) {
            pathData.push({
                id: entity.id,
                name: entity.search.name || "N/A",
                coordinates: entity.coordinates,
                neighbors: entity.routing.neighbors
            });
        }

        // 2. Build labels and lowLabels
        if (entity.visuals && entity.visuals.label) {
            const labelObj = {
                name: entity.visuals.label.text,
                coordinates: entity.coordinates
            };
            
            if (entity.visuals.label.priority === "HIGH") {
                labels.push(labelObj);
            } else {
                lowLabels.push(labelObj);
            }
        }

        // 3. Build icon arrays
        if (entity.visuals && entity.visuals.icon) {
            const type = entity.visuals.icon;
            if (!iconsByType[type]) {
                iconsByType[type] = [];
            }
            iconsByType[type].push({
                coordinates: entity.coordinates
            });
        }

        // 4. Build unitsData (for shapes, etc)
        if (entity.visuals && entity.visuals.shape) {
            unitsData.push({
                id: entity.id,
                coordinates: entity.coordinates,
                shape: entity.visuals.shape.type,
                text: entity.search.name || "",
                status: false // placeholder
            });
        }
    });

    // Construct the iconData format expected by DirectionPage
    // We expect the caller to provide an `iconMap` that maps a type (e.g. "stair")
    // to the actual imported SVG file (e.g. stairIcon)
    Object.keys(iconsByType).forEach(type => {
        iconsDataStructure.push({
            type: type,
            data: iconsByType[type],
            icon: iconMap[type] || null 
        });
    });

    return {
        pathData,
        lowLabels,
        labels,
        iconData: iconsDataStructure,
        unitsData
    };
}
