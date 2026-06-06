import fs from 'fs';
import path from 'path';

async function main() {
    // Load routing data
    const groundData = JSON.parse(fs.readFileSync('./src/data/maps/groundData.json', 'utf8'));

    // Dynamic import of ES module for low labels
    const { newGround } = await import('../src/low-level-labels.js');
    const lowLabels = newGround || [];

    // Load high priority labels
    const highLabels = JSON.parse(fs.readFileSync('./src/label.json', 'utf8'));

    // Load icons
    const iconsDir = './src/data/icons/groundFloor';
    const iconFiles = fs.readdirSync(iconsDir).filter(f => f.endsWith('.json') && f !== 'index.js');
    const icons = [];
    for (const file of iconFiles) {
        const type = file.replace('.json', '');
        const data = JSON.parse(fs.readFileSync(path.join(iconsDir, file), 'utf8'));
        data.forEach((item, index) => {
            icons.push({ type, coordinates: item.coordinates, index });
        });
    }

    // Build unified entities list
    const entities = [];
    const COORD_TOLERANCE = 0.0001; // tolerance for floating point matching

    const matchCoords = (c1, c2) => {
        return Math.abs(c1[0] - c2[0]) < COORD_TOLERANCE && Math.abs(c1[1] - c2[1]) < COORD_TOLERANCE;
    };

    // Helper to process nodes
    groundData.forEach(node => {
        // Find matching label
        const matchingLowLabel = lowLabels.find(l => matchCoords(l.coordinates, node.coordinates));
        const matchingHighLabel = highLabels.find(l => matchCoords(l.coordinates, node.coordinates));
        const matchingIcon = icons.find(i => matchCoords(i.coordinates, node.coordinates));
        
        const matchingLabel = matchingHighLabel || matchingLowLabel;
        const priority = matchingHighLabel ? "HIGH" : "LOW";

        const entityName = node.name && node.name !== "N/A" ? node.name : (matchingLabel ? matchingLabel.name : null);
        
        const entity = {
            id: node.id,
            coordinates: node.coordinates,
            entityType: matchingIcon ? matchingIcon.type.toUpperCase() : (entityName ? 'POI' : 'CORRIDOR'),
            search: {
                isSearchable: !!entityName,
                name: entityName || undefined
            },
            routing: {
                isNavigable: true,
                neighbors: node.neighbors
            },
            visuals: null
        };

        if (matchingIcon || matchingLabel) {
            entity.visuals = {};
            if (matchingIcon) entity.visuals.icon = matchingIcon.type;
            if (matchingLabel) {
                entity.visuals.label = {
                    text: matchingLabel.name,
                    priority: priority
                };
            }
        }
        
        entities.push(entity);
    });

    // Add unmatched labels
    const allLabels = [...highLabels.map(l => ({...l, priority: "HIGH"})), ...lowLabels.map(l => ({...l, priority: "LOW"}))];
    allLabels.forEach((label, idx) => {
        const isMatched = entities.find(e => matchCoords(e.coordinates, label.coordinates));
        if (!isMatched) {
            entities.push({
                id: `label-only-ground-${idx}`,
                coordinates: label.coordinates,
                entityType: 'LABEL',
                search: { isSearchable: false },
                routing: null,
                visuals: {
                    label: { text: label.name, priority: label.priority }
                }
            });
        }
    });

    // Add unmatched icons
    icons.forEach(icon => {
        const isMatched = entities.find(e => matchCoords(e.coordinates, icon.coordinates));
        if (!isMatched) {
            entities.push({
                id: `icon-only-ground-${icon.type}-${icon.index}`,
                coordinates: icon.coordinates,
                entityType: icon.type.toUpperCase(),
                search: { isSearchable: false },
                routing: null,
                visuals: {
                    icon: icon.type
                }
            });
        }
    });

    const output = {
        floorId: 0,
        floorName: "Ground Floor",
        entities
    };

    fs.writeFileSync('./src/data/maps/unified_groundData.json', JSON.stringify(output, null, 2));
    console.log('Successfully generated unified JSON model for groundFloor -> src/data/maps/unified_groundData.json');
}

main().catch(console.error);
