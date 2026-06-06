export function lerp(a, b, t) {
  return a + t * (b - a);
}

export function getRotatedCoordinate(cx, cy, x, y, angle) {
  const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = cos * (x - cx) - sin * (y - cy) + cx;
  const ny = cos * (y - cy) + sin * (x - cx) + cy;
  return [nx, ny];
}

export function getRealPointCoordinateRelativeToDigitisationZone(
  digitisationSpace,
  rotationInDegree,
  x,
  y,
) {
  const realPointCoordinates = [
    lerp(
      digitisationSpace.origin[0],
      digitisationSpace.origin[0] + digitisationSpace.width,
      x,
    ),
    lerp(
      digitisationSpace.origin[1],
      digitisationSpace.origin[1] + digitisationSpace.height,
      y,
    ),
  ];

  const digitisationZoneOriginCoordinate = [
    lerp(
      digitisationSpace.origin[0],
      digitisationSpace.origin[0] + digitisationSpace.width,
      0,
    ),
    lerp(
      digitisationSpace.origin[1],
      digitisationSpace.origin[1] + digitisationSpace.height,
      0,
    ),
  ];

  const realRotatedPointCoordinates = getRotatedCoordinate(
    digitisationZoneOriginCoordinate[0],
    digitisationZoneOriginCoordinate[1],
    realPointCoordinates[0],
    realPointCoordinates[1],
    rotationInDegree,
  );

  return realRotatedPointCoordinates;
}

export function getPercentageCoordinateRelativeToDigitisationZone(
  digitisationSpace,
  rotationInDegree,
  x,
  y,
) {
  console.log(x, y);
  const digitisationZoneOriginCoordinate = [
    lerp(
      digitisationSpace.origin[0],
      digitisationSpace.origin[0] + digitisationSpace.width,
      0,
    ),
    lerp(
      digitisationSpace.origin[1],
      digitisationSpace.origin[1] + digitisationSpace.height,
      0,
    ),
  ];

  const coordinatesBeforeRotation = getRotatedCoordinate(
    digitisationZoneOriginCoordinate[0],
    digitisationZoneOriginCoordinate[1],
    x,
    y,
    -rotationInDegree,
  );

  const coordinatesBeforeOriginChange = [
    coordinatesBeforeRotation[0] - digitisationSpace.origin[0],
    coordinatesBeforeRotation[1] - digitisationSpace.origin[1],
  ];
  console.log([
    coordinatesBeforeOriginChange[0] / digitisationSpace.width,
    coordinatesBeforeOriginChange[1] / digitisationSpace.height,
  ]);
  return [
    coordinatesBeforeOriginChange[0] / digitisationSpace.width,
    coordinatesBeforeOriginChange[1] / digitisationSpace.height,
  ];
}

export function findShortestPath(graph, start, end) {
  console.log(graph);
  const nodes = Object.keys(graph);
  const distances = {};
  const previous = {};
  let unvisited = new Set(nodes);

  // Initialize distances to Infinity and previous to null
  for (let node of nodes) {
    distances[node] = Infinity;
    previous[node] = null;
  }

  // Distance from start node to itself is 0
  distances[start] = 0;

  // Find the nearest staircase from the start node
  let nearestStaircase = null;
  let minStaircaseDistance = Infinity;
  console.log(previous);
  for (let node in graph) {
    if (node.startsWith("STAIR")) {
      console.log("found");
      console.log(graph[node]);
      const distance = graph[start][node]?.distance;
      if (distance < minStaircaseDistance) {
        minStaircaseDistance = distance;
        nearestStaircase = node;
      }
    }
  }

  // Update start node and its distance
  start = nearestStaircase;
  distances[start] = minStaircaseDistance;

  while (unvisited.size > 0) {
    let currentNode = Array.from(unvisited).reduce((a, b) =>
      distances[a] < distances[b] ? a : b,
    );
    unvisited.delete(currentNode);

    if (currentNode === end) {
      break;
    }

    for (let neighbor in graph[currentNode]) {
      let distance =
        distances[currentNode] + graph[currentNode][neighbor].distance;
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = currentNode;
      }
    }
  }

  // Extract the shortest path
  let path1 = []; // Path from start to nearest staircase
  let path2 = []; // Path from nearest staircase to end
  let current = end;
  let currentFloor = null;
  let staircaseEncountered = false;

  while (current) {
    const floor = graph[current][Object.keys(graph[current])[0]].floor;

    if (current === start || staircaseEncountered) {
      // Start a new array for the second path if we encounter the start node or staircase
      if (!staircaseEncountered) {
        path2.unshift(current);
        staircaseEncountered = true;
      } else {
        path2.unshift(current);
      }
    } else {
      // Add node to the first path until we reach the start node or staircase
      path1.unshift(current);
    }

    if (!staircaseEncountered) {
      current = previous[current];
    } else {
      // If staircase is encountered, continue backtracking only if on the same floor
      if (graph[current][previous[current]].floor === floor) {
        current = previous[current];
      } else {
        break; // Stop when we transition to a different floor
      }
    }
  }
  console.log(path1, path2);
  return [path1, path2];
}
const stairArr = [
  "path-12",
  "path-54",
  "path-72",
  "path-97",
  "path-131",
  "path-139",
  "path-156",
  "path-159",
  "path-234",
  "path-264",
  "path-281",
  "path-291",
  "path-335",
  "path-340",
  "path-346",
  "path-354",
  // "path-382",
  "path-410",
  "path-458",
  "path-463",
  "path-475",
  "path-479",
  "path-502",
  "path-526",
  "path-565",
  "path-595",
  "path-619",
  "path-620",
  "path-627",
  "path-634",
  "path-656",
  "path-659",
  "path-704",
];
export function findNearestStair(floorMap, startingPoint) {
  const simplifiedPathData = {};
  floorMap?.forEach((item) => {
    simplifiedPathData[item.id] = {};
    item.neighbors.forEach((item1) => {
      simplifiedPathData[item.id][item1.id] = { distance: item1.distance };
    });
  });

  const visited = new Set();
  const queue = [{ node: startingPoint, distance: 0 }];

  while (queue.length > 0) {
    const { node, distance } = queue.shift();
    let nodeName =
      typeof node === "object" ? Object.keys(node)[0] : String(node);

    // Check if the current node is one of the stair paths in stairArr
    if (stairArr.includes(nodeName)) {
      return nodeName;
    }

    visited.add(nodeName);

    // Iterate through the neighbors of the current node
    if (simplifiedPathData) {
      const neighbors = Object.keys(simplifiedPathData[nodeName]);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push({
            node: neighbor,
            distance:
              distance + simplifiedPathData[nodeName][neighbor].distance,
          });
          console.log(queue);
        }
      }
    }
    queue.sort((a, b) => a.distance - b.distance);
  }
  console.log("No staircase found");
  return null; // No staircase found
}
