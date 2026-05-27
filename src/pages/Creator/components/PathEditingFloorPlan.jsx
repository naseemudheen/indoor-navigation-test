import React, { useState } from "react";
import { select, pointer, zoom, scaleLinear, drag } from "d3";
import { IconMap } from "../../../constants/iconMap";
import {
  lerp,
  getRealPointCoordinateRelativeToDigitisationZone,
  getPercentageCoordinateRelativeToDigitisationZone,
} from "../utils";

function getDistance(x1, y1, x2, y2) {
  const a = x1 - x2;
  const b = y1 - y2;

  return Math.sqrt(a * a + b * b);
}

export default function Floorplan({
  isGettingInitialState,
  floorplan,
  digitisationZone,
  currentRotation,
  togglePathEditing,
  setPath,
  pathinfo,
  markerData,
  setMarkerData
}) {
  const [pathData, setPathData] = React.useState(pathinfo);
  const [currentSelectedPathPoint, setCurrentSelectedPathPoint] =
    React.useState("");
  const [detailedSelectedPoint,setDetailedSelectedPoint] = useState({})
  const [internalMarkerData, setInternalMarkerData] = React.useState(markerData || []);
  const [isMarkerMode, setIsMarkerMode] = React.useState(false);
  const [currentSelectedMarker, setCurrentSelectedMarker] = React.useState(null);
  const [hoveredNode, setHoveredNode] = React.useState(null);
  const [isJoinMode, setIsJoinMode] = React.useState(false);
  const [isNameClicked,setIsNameClicked] = useState(false)
  const [isDeleteMode, setIsDeleteMode] = React.useState(false);
  const [isEditingCoords, setIsEditingCoords] = React.useState(false);
  const [undoStack,setUndoStack] = React.useState([])
  const [redoStack, setRedoStack] = React.useState([]);
  const translationRef = React.useRef([0, 0]);
  const scaleRef = React.useRef(1);
  const idCounter = React.useRef(841);
  function findObjectWithLargestId(pathData) {
    if (!pathData || pathData.length === 0) return null;
  
    let largestIdObject = pathData[0];
    let largestIdNumber = parseInt(largestIdObject.id.split('-')[1], 10);
  
    pathData.forEach((item) => {
      const currentIdNumber = parseInt(item.id.split('-')[1], 10);
      if (currentIdNumber > largestIdNumber) {
        largestIdNumber = currentIdNumber;
        largestIdObject = item;
      }
    });
  
    return largestIdObject;
  }
  const largestIdObject = findObjectWithLargestId(pathData);
console.log(largestIdObject,'largestIdObject');
  function savePath() {
    if (pathData.length <= 0) return;
    const invalidNodes = pathData.filter(node => node.isSearchable && (!node.name || node.name.trim() === ""));
    if (invalidNodes.length > 0) {
      alert(`The following searchable nodes are missing mandatory names: ${invalidNodes.map(n => n.id).join(", ")}. Please assign names before saving.`);
      return;
    }
    setPath(pathData, internalMarkerData);
    togglePathEditing();
  }
  function undo() {
    if (undoStack.length > 0) {
      const newUndoStack = [...undoStack];
      const lastState = newUndoStack.pop();
      setRedoStack((prevRedoStack) => [...prevRedoStack, pathData]);
      setPathData(lastState);
      setUndoStack(newUndoStack);
    }
  }

  
  function redo() {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const nextState = newRedoStack.pop();
      setUndoStack((prevUndoStack) => [...prevUndoStack, pathData]);
      setPathData(nextState);
      setRedoStack(newRedoStack);
    }
  }
  React.useEffect(() => {
    if (!isGettingInitialState) {
      const svg = select("#path-floorplan-container")
        .selectAll(".path-floorplan-svg")
        .data([floorplan])
        .join("svg")
        .attr("class", "path-floorplan-svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", (value) => `0 0 ${value.width} ${value.height}`);

      const groupElement = svg
        .selectAll(".path-floorplan-svg-group")
        .data([floorplan])
        .join("g")
        .attr("class", "path-floorplan-svg-group");

      const defs = svg.selectAll("defs").data([0]).join("defs");
      const pattern = defs.selectAll("pattern#grid").data([0]).join("pattern")
        .attr("id", "grid")
        .attr("width", 20)
        .attr("height", 20)
        .attr("patternUnits", "userSpaceOnUse");
        
      pattern.selectAll("path").data([0]).join("path")
        .attr("d", "M 20 0 L 0 0 0 20")
        .attr("fill", "none")
        .attr("stroke", "rgba(0,0,0,0.2)")
        .attr("stroke-width", 1);

      groupElement
        .selectAll(".path-floorplan-image")
        .data([floorplan])
        .join("image")
        .attr("class", "path-floorplan-image")
        .attr("xlink:href", (value) => value.floorplanPath)
        .attr("width", (value) => value.width)
        .attr("height", (value) => value.height);

      groupElement
        .selectAll(".grid-overlay")
        .data([floorplan])
        .join("rect")
        .attr("class", "grid-overlay")
        .attr("width", (value) => value.width)
        .attr("height", (value) => value.height)
        .attr("fill", "url(#grid)")
        .style("pointer-events", "none");

      svg.call(
        zoom().on("zoom", (ev) => {
          const transform = ev.transform;

          translationRef.current = [transform.x, transform.y];
          scaleRef.current = transform.k;

          groupElement.attr(
            "transform",
            `translate(${transform.x}, ${transform.y}) scale(${transform.k})`
          );
        })
      );

      //PATH CREATION HERE !!!!!!

      svg.on("click", function (event) {
        console.log("clicked for path/marker");
        setUndoStack((prevUndoStack) => [...prevUndoStack, pathData]);
        
        const coordinates = pointer(event);
        const xCoordinate =
          (coordinates[0] - translationRef.current[0]) / scaleRef.current;
        const yCoordinate =
          (coordinates[1] - translationRef.current[1]) / scaleRef.current;

        const scaledCoordinates =
          getPercentageCoordinateRelativeToDigitisationZone(
            digitisationZone,
            currentRotation,
            xCoordinate,
            yCoordinate
          );

        if (isMarkerMode) {
          if (isDeleteMode || isJoinMode) return;
          const newMarker = {
            id: `marker-${Date.now()}`,
            type: "label",
            text: "New Marker",
            coordinates: scaledCoordinates
          };
          setInternalMarkerData([...internalMarkerData, newMarker]);
          setCurrentSelectedMarker(newMarker.id);
          setCurrentSelectedPathPoint("");
          return;
        }

        if (isJoinMode || isDeleteMode) return;

        setPathData((currentPathData) => {
          if (currentPathData.length <= 0) {
            const pathPointObj = {
              id: `path-${idCounter.current}`,
              coordinates: scaledCoordinates,
              neighbors: [],
            };

            return [pathPointObj];
          }

          const currentSelectedPathData = currentPathData.find(
            (item) =>{
              console.log(item,currentSelectedPathPoint);
              return item.id === currentSelectedPathPoint
            } 
          );

          if (!currentSelectedPathData) {
            const pathPointObj = {
              id: `path-${idCounter.current}`,
              coordinates: scaledCoordinates,
              neighbors: [],
            };
            setDetailedSelectedPoint(pathPointObj);
            return [...currentPathData, pathPointObj];
          }

          const pathPointObj = {
            id: `path-${idCounter.current}`,
            coordinates: scaledCoordinates,
            neighbors: [
              {
                id: currentSelectedPathData?.id,
                coordinates: currentSelectedPathData.coordinates,
                distance: getDistance(
                  scaledCoordinates[0],
                  scaledCoordinates[1],
                  currentSelectedPathData.coordinates[0],
                  currentSelectedPathData.coordinates[1]
                ),
                isParent: true,
              },
            ],
          };

          const newCurrentSelectedPathData = {
            id: currentSelectedPathData.id,
            coordinates: [...currentSelectedPathData.coordinates],
            neighbors: [
              ...currentSelectedPathData.neighbors,
              {
                id: pathPointObj.id,
                coordinates: pathPointObj.coordinates,
                distance: getDistance(
                  currentSelectedPathData.coordinates[0],
                  currentSelectedPathData.coordinates[1],
                  scaledCoordinates[0],
                  scaledCoordinates[1]
                ),
              },
            ],
          };

          const newPathData = currentPathData.map((item) => {
            if (item.id === currentSelectedPathPoint) {
              return newCurrentSelectedPathData;
            }

            return item;
          });
          setDetailedSelectedPoint(pathPointObj)
          // console.log(pathPointObj,5678);
          return [...newPathData, pathPointObj];
        });
        setCurrentSelectedPathPoint(`path-${idCounter.current}`);
        idCounter.current = idCounter.current + 1;
      });
      const undoStack = [];
      const redoStack = [];
    }
  }, [
    isGettingInitialState,
    floorplan,
    digitisationZone,
    currentRotation,
    currentSelectedPathPoint,
    isJoinMode,
    isDeleteMode,
  ]);

  React.useEffect(() => {
    if (!isGettingInitialState) {
      const D3SVG = select(".path-floorplan-svg-group");

      const digitisationZoneOriginCoordinate = [
        lerp(
          digitisationZone.origin[0],
          digitisationZone.origin[0] + digitisationZone.width,
          0
        ),
        lerp(
          digitisationZone.origin[1],
          digitisationZone.origin[1] + digitisationZone.height,
          0
        ),
      ];

      D3SVG.selectAll(".path-digitisation-zone-rect")
        .data([digitisationZone])
        .join("rect")
        .attr("class", "path-digitisation-zone-rect")
        .attr("x", (value) =>
          Math.min(value.origin[0], value.origin[0] + value.width)
        )
        .attr("y", (value) =>
          Math.min(value.origin[1], value.origin[1] + value.height)
        )
        .attr("width", (value) => Math.abs(value.width))
        .attr("height", (value) => Math.abs(value.height))
        .attr("fill", "black")
        .attr("opacity", "0.2")
        .attr("stroke-width", 2)
        .attr("stroke", "blue")
        .attr(
          "transform",
          `rotate(${currentRotation}, ${digitisationZoneOriginCoordinate[0]}, ${digitisationZoneOriginCoordinate[1]})`
        );

      D3SVG.selectAll(".path-digitisation-zone-origin-point")
        .data([digitisationZone])
        .join("circle")
        .attr("class", "path-digitisation-zone-origin-point")
        .attr("r", "5")
        .attr("fill", "blue")
        .attr("cx", (value) => value.origin[0])
        .attr("cy", (value) => value.origin[1])
        .attr(
          "transform",
          `rotate(${currentRotation}, ${digitisationZoneOriginCoordinate[0]}, ${digitisationZoneOriginCoordinate[1]})`
        );
      D3SVG.selectAll(".path-digitisation-zone-right-bottom-point")
        .data([digitisationZone])
        .join("circle")
        .attr("class", "path-digitisation-zone-right-bottom-point")
        .attr("r", "5")
        .attr("fill", "green")
        .attr("cx", (value) => value.origin[0] + value.width)
        .attr("cy", (value) => value.origin[1] + value.height)
        .attr(
          "transform",
          `rotate(${currentRotation}, ${digitisationZoneOriginCoordinate[0]}, ${digitisationZoneOriginCoordinate[1]})`
        );
    }
  }, [isGettingInitialState, digitisationZone, currentRotation]);

  // render current selected path point
  React.useEffect(() => {
    if (!currentSelectedPathPoint) return;
 
    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
    const D3SVG = select(".path-floorplan-svg-group");

    D3SVG.selectAll(".path-current-selected-point")
      .data([currentSelectedPathPoint])
      .join("circle")
      .attr("class", "path-current-selected-point")
      .attr("r", (value) => {
        const nodeObj = pathData.find(item => item.id === value);
        return nodeObj?.isSearchable ? sizeScale(4.5) : sizeScale(3.0);
      })
      .attr("fill", "blue")
      .attr("stroke", "#fff")
      .attr("stroke-width", (value) => {
        const nodeObj = pathData.find(item => item.id === value);
        return nodeObj?.isSearchable ? sizeScale(0.8) : sizeScale(0.4);
      })
      .attr("cx", (value) => {
        const currentPathData = pathData.find((item) => item.id === value);
        if (!currentPathData) return 0;
        return getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          currentPathData?.coordinates[0],
          currentPathData?.coordinates[1]
        )[0];
      })
      .attr("cy", (value) => {
        const currentPathData = pathData.find((item) => item.id === value);
        if (!currentPathData) return 0;
        return getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          currentPathData?.coordinates[0],
          currentPathData?.coordinates[1]
        )[1];
      })
      .on("click", function (event, data) {
        event.stopPropagation();
        return;
      })
      .on("mouseover", function (event, value) {
        const nodeObj = pathData.find(item => item.id === value);
        if (nodeObj) {
          setHoveredNode(nodeObj);
        }
      })
      .on("mouseout", function (event, value) {
        setHoveredNode(null);
      });
     
  }, [
    isGettingInitialState,
    floorplan,
    digitisationZone,
    currentRotation,
    pathData,
    currentSelectedPathPoint,
  ]);

  // render path points
  React.useEffect(() => {
    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
    const D3SVG = select(".path-floorplan-svg-group");

    D3SVG.selectAll(".path-point")
      .data(pathData.filter((item) => item.id !== currentSelectedPathPoint))
      .join("circle")
      .attr("class", "path-point")
      .attr("r", (value) => value.isSearchable ? sizeScale(3.8) : sizeScale(2.0))
      .attr("fill", (value) => value.isSearchable ? "#ef4444" : "#94a3b8")
      .attr("opacity", (value) => value.isSearchable ? 0.9 : 0.6)
      .attr("stroke", "#fff")
      .attr("stroke-width", (value) => value.isSearchable ? sizeScale(0.8) : sizeScale(0.4))
      .attr(
        "cx",
        (value) =>
          getRealPointCoordinateRelativeToDigitisationZone(
            digitisationZone,
            currentRotation,
            value.coordinates[0],
            value.coordinates[1]
          )[0]
      )
      .attr(
        "cy",
        (value) =>
          getRealPointCoordinateRelativeToDigitisationZone(
            digitisationZone,
            currentRotation,
            value.coordinates[0],
            value.coordinates[1]
          )[1]
      )
      .on("click", function (event, data) {
        event.stopPropagation();

        if (isDeleteMode) {
          const currentClickedPathData = data;

          const newPathData = pathData
            .map((item) => {
              const newItemData = {
                id: item.id,
                coordinates: [...item.coordinates],
                neighbors: item.neighbors.filter(
                  (item1) => item1.id !== currentClickedPathData.id
                ),
              };

              return newItemData;
            })
            .filter((item) => item.id !== currentClickedPathData.id);

          setPathData(newPathData);
          if (currentSelectedPathPoint === currentClickedPathData.id) {
            setCurrentSelectedPathPoint("");
            setDetailedSelectedPoint({});
          }
          return;
        }

        if (isJoinMode) {
          const currentClickedPathData = data;

          if (!currentSelectedPathPoint) {
            console.warn("No path selected to join with");
            return;
          }

          if (
            currentClickedPathData.neighbors.find(
              (item) => item.id === currentSelectedPathPoint
            )
          ) {
            console.log("already join");
            return;
          }

          setPathData((currentPathData) => {
            const currentSelectedPathData = currentPathData.find(
              (item) => item.id === currentSelectedPathPoint
            );

            const newCurrentClickedPathData = {
              id: currentClickedPathData.id,
              coordinates: [...currentClickedPathData.coordinates],
              neighbors: [
                ...currentClickedPathData.neighbors,
                {
                  id: currentSelectedPathData.id,
                  coordinates: currentSelectedPathData.coordinates,
                  distance: getDistance(
                    currentClickedPathData.coordinates[0],
                    currentClickedPathData.coordinates[1],
                    currentSelectedPathData.coordinates[0],
                    currentSelectedPathData.coordinates[1]
                  ),
                  isParent: true,
                },
              ],
            };

            const newCurrentSelectedPathData = {
              id: currentSelectedPathData.id,
              coordinates: [...currentSelectedPathData.coordinates],
              neighbors: [
                ...currentSelectedPathData.neighbors,
                {
                  id: currentClickedPathData.id,
                  coordinates: currentClickedPathData.coordinates,
                  distance: getDistance(
                    currentSelectedPathData.coordinates[0],
                    currentSelectedPathData.coordinates[1],
                    currentClickedPathData.coordinates[0],
                    currentClickedPathData.coordinates[1]
                  ),
                },
              ],
            };

            const newPathData = currentPathData.map((item) => {
              if (item.id === currentSelectedPathPoint) {
                return newCurrentSelectedPathData;
              }

              if (item.id === newCurrentClickedPathData.id) {
                return newCurrentClickedPathData;
              }

              return item;
            });

            return [...newPathData];
          });

          return;
        }

        setCurrentSelectedPathPoint(data.id);
        setDetailedSelectedPoint(data)
      })
      .on("mouseover", function (event, data) {
        setHoveredNode(data);
      })
      .on("mouseout", function (event, data) {
        setHoveredNode(null);
      });
  }, [
    isGettingInitialState,
    floorplan,
    digitisationZone,
    currentRotation,
    pathData,
    currentSelectedPathPoint,
    isJoinMode,
    isDeleteMode,
  ]);

  // render line
  React.useEffect(() => {
    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
    const D3SVG = select(".path-floorplan-svg-group");

    const lineData = pathData
      .map((item) => {
        return item.neighbors
          .map((item1) => {
            if (item1.isParent) return null;
            return [
              item.coordinates[0],
              item.coordinates[1],
              item1.coordinates[0],
              item1.coordinates[1],
            ];
          })
          .filter((item1) => item1 !== null);
      })
      .flat();

    D3SVG.selectAll(".line-path")
      .data(lineData)
      .join("line")
      .attr("class", "line-path")
      .attr("x1", (value) => {
        const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          value[0],
          value[1]
        );

        return coordinates[0];
      })
      .attr("y1", (value) => {
        const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          value[0],
          value[1]
        );

        return coordinates[1];
      })
      .attr("x2", (value) => {
        const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          value[2],
          value[3]
        );

        return coordinates[0];
      })
      .attr("y2", (value) => {
        const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          value[2],
          value[3]
        );

        return coordinates[1];
      })
      .attr("stroke", "red")
      .attr("stroke-width", () => sizeScale(1))
      .on("click", function (event, data) {
        event.stopPropagation();
      });
  }, [
    isGettingInitialState,
    floorplan,
    digitisationZone,
    currentRotation,
    pathData,
    currentSelectedPathPoint,
  ]);

  // render markers
  React.useEffect(() => {
    if (!isGettingInitialState) {
      const sizeScale = scaleLinear()
        .domain([0, 100])
        .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
      const D3SVG = select(".path-floorplan-svg-group");

      D3SVG.selectAll(".map-marker-hitbox")
        .data(internalMarkerData)
        .join("circle")
        .attr("class", "map-marker-hitbox")
        .attr("r", (value) => value.id === currentSelectedMarker ? sizeScale(4.5) : sizeScale(3.0))
        .attr("fill", "transparent")
        .attr("stroke", (value) => value.id === currentSelectedMarker ? "rgba(0, 0, 255, 0.5)" : "transparent")
        .attr("stroke-width", sizeScale(0.4))
        .attr("cx", (value) => getRealPointCoordinateRelativeToDigitisationZone(digitisationZone, currentRotation, value.coordinates[0], value.coordinates[1])[0])
        .attr("cy", (value) => getRealPointCoordinateRelativeToDigitisationZone(digitisationZone, currentRotation, value.coordinates[0], value.coordinates[1])[1])
        .on("click", function(event, data) {
           event.stopPropagation();
           if (isDeleteMode && isMarkerMode) {
             setInternalMarkerData(internalMarkerData.filter(m => m.id !== data.id));
             if (currentSelectedMarker === data.id) setCurrentSelectedMarker(null);
             return;
           }
           if (isMarkerMode) {
             setCurrentSelectedMarker(data.id);
             setCurrentSelectedPathPoint("");
           }
        });

      D3SVG.selectAll(".map-marker-icon")
        .data(internalMarkerData.filter(m => m.type === 'icon'))
        .join("image")
        .attr("class", "map-marker-icon")
        .attr("href", (value) => {
           const iconKey = value.iconType ? value.iconType.toLowerCase() : "toilet";
           return IconMap[iconKey] || IconMap["toilet"];
        })
        .attr("width", sizeScale(6.0))
        .attr("height", sizeScale(6.0))
        .attr("x", (value) => getRealPointCoordinateRelativeToDigitisationZone(digitisationZone, currentRotation, value.coordinates[0], value.coordinates[1])[0] - sizeScale(3.0))
        .attr("y", (value) => getRealPointCoordinateRelativeToDigitisationZone(digitisationZone, currentRotation, value.coordinates[0], value.coordinates[1])[1] - sizeScale(3.0))
        .style("pointer-events", "none");
        
      D3SVG.selectAll(".map-marker-text")
        .data(internalMarkerData.filter(m => m.type === 'label' || !m.type))
        .join("text")
        .attr("class", "map-marker-text")
        .attr("x", (value) => getRealPointCoordinateRelativeToDigitisationZone(digitisationZone, currentRotation, value.coordinates[0], value.coordinates[1])[0])
        .attr("y", (value) => getRealPointCoordinateRelativeToDigitisationZone(digitisationZone, currentRotation, value.coordinates[0], value.coordinates[1])[1] + sizeScale(1.0))
        .attr("text-anchor", "middle")
        .attr("font-size", `${sizeScale(3.5)}px`)
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .style("pointer-events", "none")
        .text((value) => value.text);
    }
  }, [
    isGettingInitialState,
    floorplan,
    digitisationZone,
    currentRotation,
    internalMarkerData,
    currentSelectedMarker,
    isMarkerMode,
    isDeleteMode
  ]);
  console.log(pathData, "path here");
  const updateNodeProperty = (property, value) => {
    const indexToUpdate = pathData.findIndex((item) => item.id === currentSelectedPathPoint);
    if (indexToUpdate !== -1) {
      setPathData((prevArray) => {
        const newArray = [...prevArray];
        newArray[indexToUpdate] = { ...newArray[indexToUpdate], [property]: value };
        return newArray;
      });
      setDetailedSelectedPoint((prev) => ({ ...prev, [property]: value }));
    }
  };

  console.log(detailedSelectedPoint,'updated detailed');
  const activeNodeToShow = (hoveredNode && !isEditingCoords) ? hoveredNode : (currentSelectedPathPoint ? detailedSelectedPoint : null);
  const isSelectedNode = activeNodeToShow?.id === currentSelectedPathPoint;

  const activeMarkerToShow = internalMarkerData.find(m => m.id === currentSelectedMarker);
  const updateMarkerProperty = (property, value) => {
    setInternalMarkerData(prev => prev.map(m => m.id === currentSelectedMarker ? { ...m, [property]: value } : m));
  };
  return (
    <React.Fragment>
      <div className="overlay-tools-container">
        <h4>Edit Path Mode Active</h4>
        <div className="path-save-cancel-button-container">
          <button onClick={togglePathEditing}>cancel</button>
          <button onClick={savePath}>save</button>
          <button onClick={() => setIsJoinMode(!isJoinMode)}>join mode</button>
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>
          <span>{isJoinMode ? " join mode active" : ""}</span>
          <button onClick={() => setIsDeleteMode(!isDeleteMode)}>
            delete mode
          </button>
          <span>{isDeleteMode ? " delete mode active" : ""}</span>
          <button onClick={() => { setIsMarkerMode(!isMarkerMode); setCurrentSelectedPathPoint(""); setCurrentSelectedMarker(null); setIsJoinMode(false); setIsDeleteMode(false); }}>
            marker mode
          </button>
          <span>{isMarkerMode ? " marker mode active" : ""}</span>
        </div>
      </div>
      {activeMarkerToShow && isMarkerMode && (
          <div className="node">
            <div className="node-header">
              <span className="node-header-title">Marker Details</span>
              <button
                type="button"
                className="node-edit-btn"
                style={{ backgroundColor: "#ff4d4f" }}
                onClick={() => {
                  setInternalMarkerData(internalMarkerData.filter(m => m.id !== activeMarkerToShow.id));
                  setCurrentSelectedMarker(null);
                }}
              >
                Delete
              </button>
            </div>
            <div className="node-row">
              <strong>ID:</strong>
              <span>{activeMarkerToShow.id}</span>
            </div>
            <div className="node-form-group">
              <div className="node-field">
                <span className="node-field-label">Type</span>
                <select value={activeMarkerToShow.type || "label"} onChange={(e) => updateMarkerProperty("type", e.target.value)}>
                  <option value="label">Label</option>
                  <option value="icon">Icon</option>
                </select>
              </div>
              {activeMarkerToShow.type === "icon" ? (
                <div className="node-field">
                  <span className="node-field-label">Icon Name</span>
                  <input type="text" value={activeMarkerToShow.iconType || ""} onChange={(e) => updateMarkerProperty("iconType", e.target.value)} placeholder="e.g. toilet, door, lift" />
                </div>
              ) : (
                <div className="node-field">
                  <span className="node-field-label">Label Text</span>
                  <input type="text" value={activeMarkerToShow.text || ""} onChange={(e) => updateMarkerProperty("text", e.target.value)} placeholder="e.g. Bedroom" />
                </div>
              )}
            </div>
          </div>
      )}
      {activeNodeToShow && !isMarkerMode && (
          <div className="node">
            <div className="node-header">
              <span className="node-header-title">
                {isSelectedNode ? "Node Details" : "Node Details (Hovered)"}
              </span>
              {isSelectedNode && (
                <button
                  type="button"
                  className="node-edit-btn"
                  onClick={() => {
                    if (isEditingCoords) {
                      if (activeNodeToShow.isSearchable && (!activeNodeToShow.name || activeNodeToShow.name.trim() === "")) {
                        alert("Name is mandatory for searchable nodes.");
                        return;
                      }
                      setPath(pathData);
                    }
                    setIsEditingCoords(!isEditingCoords);
                  }}
                >
                  {isEditingCoords ? "Done" : "Edit"}
                </button>
              )}
            </div>

            <div className="node-row">
              <strong>ID:</strong>
              <span>{activeNodeToShow.id}</span>
            </div>

            {isEditingCoords && isSelectedNode ? (
              <div className="node-form-group">
                <span className="node-field-label">Coordinates</span>
                <div className="node-coord-row">
                  <div className="node-field">
                    <span className="node-field-label">X</span>
                    <input
                      type="text"
                      value={activeNodeToShow?.coordinates?.[0] ?? 0}
                      onKeyDown={(e) => {
                        if (
                          !/^[0-9.\-]$/.test(e.key) &&
                          !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key) &&
                          !e.ctrlKey && !e.metaKey
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        updateNodeProperty("coordinates", [e.target.value, activeNodeToShow.coordinates[1]]);
                      }}
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        updateNodeProperty("coordinates", [isNaN(val) ? 0 : val, activeNodeToShow.coordinates[1]]);
                      }}
                    />
                  </div>
                  <div className="node-field">
                    <span className="node-field-label">Y</span>
                    <input
                      type="text"
                      value={activeNodeToShow?.coordinates?.[1] ?? 0}
                      onKeyDown={(e) => {
                        if (
                          !/^[0-9.\-]$/.test(e.key) &&
                          !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key) &&
                          !e.ctrlKey && !e.metaKey
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        updateNodeProperty("coordinates", [activeNodeToShow.coordinates[0], e.target.value]);
                      }}
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        updateNodeProperty("coordinates", [activeNodeToShow.coordinates[0], isNaN(val) ? 0 : val]);
                      }}
                    />
                  </div>
                </div>

                {activeNodeToShow.isSearchable && (
                  <div className="node-field">
                    <span className="node-field-label">Name</span>
                    <input
                      type="text"
                      value={activeNodeToShow.name || ""}
                      onChange={(e) => updateNodeProperty("name", e.target.value)}
                    />
                  </div>
                )}

                <div className="node-field">
                  <span className="node-field-label">Floor</span>
                  <input
                    type="number"
                    value={activeNodeToShow.floor !== undefined ? activeNodeToShow.floor : ""}
                    onChange={(e) => updateNodeProperty("floor", e.target.value === "" ? "" : parseInt(e.target.value, 10))}
                  />
                </div>

                <div className="node-field-checkbox">
                  <input
                    type="checkbox"
                    id="searchable-edit"
                    checked={activeNodeToShow.isSearchable || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      updateNodeProperty("isSearchable", checked);
                      if (!checked) {
                        updateNodeProperty("name", "");
                      }
                    }}
                  />
                  <label htmlFor="searchable-edit"><strong>Searchable</strong></label>
                </div>
              </div>
            ) : (
              <>
                <div className="node-row">
                  <strong>Coordinates:</strong>
                  <span>{activeNodeToShow?.coordinates?.map(c => typeof c === 'number' ? c.toFixed(4) : c).join(", ")}</span>
                </div>
                <div className="node-grid-row" style={{ gridTemplateColumns: activeNodeToShow.isSearchable ? "repeat(3, 1fr)" : "repeat(2, 1fr)" }}>
                  {activeNodeToShow.isSearchable && (
                    <div>
                      <strong>Name</strong>
                      <span>{activeNodeToShow.name || "—"}</span>
                    </div>
                  )}
                  <div>
                    <strong>Floor</strong>
                    <span>{activeNodeToShow.floor !== undefined ? activeNodeToShow.floor : "—"}</span>
                  </div>
                  <div>
                    <strong>Searchable</strong>
                    <span>{activeNodeToShow.isSearchable ? "Yes" : "No"}</span>
                  </div>
                </div>
              </>
            )}

            <div className="node-neighbors">
              <strong>Neighbors:</strong>
              <div className="node-neighbors-list">
                {activeNodeToShow?.neighbors?.map((item, index) => (
                  <span key={index} className="node-neighbor-item">{item?.id}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      <div id="path-floorplan-container"></div>
    </React.Fragment>
  );
}
