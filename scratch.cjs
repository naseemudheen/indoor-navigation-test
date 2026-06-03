const fs = require('fs');

const dataStr = fs.readFileSync('src/data/maps/groundfloor_data.json', 'utf8');
const data = JSON.parse(dataStr);

const nodes = data.nodes || data;

// Helper to pad the ID number
function padId(id) {
  if (!id) return id;
  const match = id.match(/^(.*?)-(\d+)$/);
  if (match) {
    const prefix = match[1];
    const num = String(match[2]).padStart(3, '0');
    return `${prefix}-${num}`;
  }
  return id;
}

// Update nodes
nodes.forEach((node) => {
  node.id = padId(node.id);
  if (node.neighbors) {
    node.neighbors.forEach((neighbor) => {
      neighbor.id = padId(neighbor.id);
    });
  }
});

fs.writeFileSync('src/data/maps/groundfloor_data.json', JSON.stringify(data, null, 2));
console.log('Done padding IDs to 3 digits.');
