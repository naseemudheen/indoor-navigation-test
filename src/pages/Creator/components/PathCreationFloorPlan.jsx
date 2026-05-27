import React, { useState } from "react";
import { select, pointer, zoom, scaleLinear, drag } from "d3";
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
  togglePathCreation,
  setPath,
}) {
  const [pathData, setPathData] = React.useState([]);
  const [currentSelectedPathPoint, setCurrentSelectedPathPoint] =
    React.useState("");
  const [detailedSelectedPoint, setDetailedSelectedPoint] = useState({});
  const [previouslySelectedPoint, setPrevisiouslySelectedPoint] = useState({});
  const [hoveredNode, setHoveredNode] = React.useState(null);
  const [isJoinMode, setIsJoinMode] = React.useState(false);
  const [isNameClicked, setIsNameClicked] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = React.useState(false);
  const [isEditingCoords, setIsEditingCoords] = React.useState(false);
  const [undoStack, setUndoStack] = React.useState([]);
  const [redoStack, setRedoStack] = React.useState([]);
  const translationRef = React.useRef([0, 0]);
  const scaleRef = React.useRef(1);
  const idCounter = React.useRef(0);
  function savePath() {
    if (pathData.length <= 0) return;
    const invalidNodes = pathData.filter(node => node.isSearchable && (!node.name || node.name.trim() === ""));
    if (invalidNodes.length > 0) {
      alert(`The following searchable nodes are missing mandatory names: ${invalidNodes.map(n => n.id).join(", ")}. Please assign names before saving.`);
      return;
    }
    setPath(pathData);
    togglePathCreation();
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

      svg.on("click", function (event) {
        setUndoStack((prevUndoStack) => [...prevUndoStack, pathData]);
        if (isJoinMode || isDeleteMode) return;
        console.log(idCounter.current);
        
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
        setPrevisiouslySelectedPoint(detailedSelectedPoint);
        
        setPathData((currentPathData) => {
          console.log(idCounter.current);
          if (currentPathData.length <= 0) {
            const pathPointObj = {
              id: `path-${idCounter.current}`,
              coordinates: scaledCoordinates,
              neighbors: [],
            };
            console.log(pathPointObj);
            setCurrentSelectedPathPoint(`path-${idCounter.current}`);
            return [pathPointObj];
          }
          const currentSelectedPathData = currentPathData.find((item) => {
            return item.id === currentSelectedPathPoint;
          });
          console.log(currentSelectedPathData);

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
                coordinates: currentSelectedPathData?.coordinates,
                distance: getDistance(
                  scaledCoordinates[0],
                  scaledCoordinates[1],
                  currentSelectedPathData?.coordinates[0],
                  currentSelectedPathData?.coordinates[1]
                ),
                isParent: true,
              },
            ],
          };

          const newCurrentSelectedPathData = {
            id: currentSelectedPathData?.id,
            coordinates: [...currentSelectedPathData?.coordinates],
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
          setDetailedSelectedPoint(pathPointObj);
          return [...newPathData, pathPointObj];
        });
        idCounter.current = idCounter.current + 1;
        setCurrentSelectedPathPoint(`path-${idCounter.current}`);
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
        .attr("opacity", "0")
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

        return getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          currentPathData?.coordinates[0],
          currentPathData?.coordinates[1]
        )[0];
      })
      .attr("cy", (value) => {
        const currentPathData = pathData.find((item) => item.id === value);

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
        setPrevisiouslySelectedPoint(detailedSelectedPoint);
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
          return;
        }

        if (isJoinMode) {
          const currentClickedPathData = data;

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
        setDetailedSelectedPoint(data);
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
  console.log(previouslySelectedPoint, "prev");
  console.log(detailedSelectedPoint, "now");
  // render line
  React.useEffect(() => {
    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
    const D3SVG = select(".path-floorplan-svg-group");

    const lineData = pathData
      ?.map((item) => {
        return item?.neighbors
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

  console.log(pathData);
  const activeNodeToShow = (hoveredNode && !isEditingCoords) ? hoveredNode : (currentSelectedPathPoint ? detailedSelectedPoint : null);
  const isSelectedNode = activeNodeToShow?.id === currentSelectedPathPoint;
  return (
    <React.Fragment>
      <div className="overlay-tools-container">
        <h4>Create Path Mode Active</h4>
        <div className="path-save-cancel-button-container">
          <button onClick={togglePathCreation}>cancel</button>
          <button onClick={savePath}>save</button>
          <button onClick={() => setIsJoinMode(!isJoinMode)}>join mode</button>
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>
          <span>{isJoinMode ? " join mode active" : ""}</span>
          <button onClick={() => setIsDeleteMode(!isDeleteMode)}>
            delete mode
          </button>

          <span>{isDeleteMode ? " delete mode active" : ""}</span>
        </div>
      </div>
      <div id="path-floorplan-container">
      {activeNodeToShow && (
          <div className="node" style={{ padding: "10px", background: "#f9f9f9", border: "1px solid #ccc", marginTop: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                {isSelectedNode ? "Node Details" : "Node Details (Hovered)"}
              </span>
              {isSelectedNode && (
                <button 
                  type="button" 
                  onClick={() => {
                    if (isEditingCoords) {
                      if (activeNodeToShow.isSearchable && (!activeNodeToShow.name || activeNodeToShow.name.trim() === "")) {
                        alert("Name is mandatory for searchable nodes.");
                        return;
                      }
                    }
                    setIsEditingCoords(!isEditingCoords);
                  }}
                  style={{ padding: "4px 12px", cursor: "pointer" }}
                >
                  {isEditingCoords ? "Done Editing" : "Edit Node"}
                </button>
              )}
            </div>
            <strong>ID:</strong> {activeNodeToShow.id}
            <br />
            
            {isEditingCoords && isSelectedNode ? (
              <>
                <div style={{ display: "flex", gap: "10px", margin: "5px 0", alignItems: "center" }}>
                  <strong>Coordinates:</strong>
                  <label>
                     <strong>X:</strong>{" "}
                    <input 
                      type="text" 
                      style={{ width: "120px" }}
                      value={activeNodeToShow?.coordinates?.[0] ?? 0} 
                      onKeyDown={(e) => {
                        if (
                          !/^[0-9.-]$/.test(e.key) && 
                          !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key) &&
                          !e.ctrlKey && !e.metaKey
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const newCoords = [e.target.value, activeNodeToShow.coordinates[1]];
                        updateNodeProperty("coordinates", newCoords);
                      }}
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        updateNodeProperty("coordinates", [isNaN(val) ? 0 : val, activeNodeToShow.coordinates[1]]);
                      }}
                    />
                  </label>
                  <label>
                    <strong>Y:</strong>{" "}
                    <input 
                      type="text" 
                      style={{ width: "120px" }}
                      value={activeNodeToShow?.coordinates?.[1] ?? 0} 
                      onKeyDown={(e) => {
                        if (
                          !/^[0-9.-]$/.test(e.key) && 
                          !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key) &&
                          !e.ctrlKey && !e.metaKey
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const newCoords = [activeNodeToShow.coordinates[0], e.target.value];
                        updateNodeProperty("coordinates", newCoords);
                      }} 
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        updateNodeProperty("coordinates", [activeNodeToShow.coordinates[0], isNaN(val) ? 0 : val]);
                      }}
                    />
                  </label>
                </div>
                {activeNodeToShow.isSearchable && (
                  <>
                    <label>
                      <strong>Name:</strong>{" "}
                      <input 
                        type="text" 
                        value={activeNodeToShow.name || ""} 
                        onChange={(e) => updateNodeProperty("name", e.target.value)} 
                      />
                    </label>
                    <br />
                  </>
                )}
                <label>
                  <strong>Floor:</strong>{" "}
                  <input 
                    type="number" 
                    value={activeNodeToShow.floor !== undefined ? activeNodeToShow.floor : ""} 
                    onChange={(e) => updateNodeProperty("floor", e.target.value === "" ? "" : parseInt(e.target.value, 10))} 
                  />
                </label>
                <br />
                <label>
                  <strong>Searchable:</strong>{" "}
                  <input 
                    type="checkbox" 
                    checked={activeNodeToShow.isSearchable || false} 
                    onChange={(e) => {
                      const checked = e.target.checked;
                      updateNodeProperty("isSearchable", checked);
                      if (!checked) {
                        updateNodeProperty("name", "");
                      }
                    }} 
                  />
                </label>
                <br />
              </>
            ) : (
              <>
                <div style={{ margin: "6px 0" }}>
                  <strong>Coordinates:</strong> {activeNodeToShow?.coordinates?.map(c => typeof c === 'number' ? c.toFixed(4) : c).join(", ")}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: activeNodeToShow.isSearchable ? "repeat(3, 1fr)" : "repeat(2, 1fr)", gap: "10px", margin: "8px 0", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", padding: "6px 0" }}>
                  {activeNodeToShow.isSearchable && (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <strong style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Name</strong>
                      <span style={{ fontSize: "0.85rem", color: "#1e293b", fontWeight: "500" }}>{activeNodeToShow.name || "N/A"}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <strong style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Floor</strong>
                    <span style={{ fontSize: "0.85rem", color: "#1e293b", fontWeight: "500" }}>{activeNodeToShow.floor !== undefined ? activeNodeToShow.floor : "N/A"}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <strong style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Searchable</strong>
                    <span style={{ fontSize: "0.85rem", color: "#1e293b", fontWeight: "500" }}>{activeNodeToShow.isSearchable ? "Yes" : "No"}</span>
                  </div>
                </div>
              </>
            )}

            <strong>Neighbors:</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
              {activeNodeToShow?.neighbors?.map((item) => (
                <span 
                  key={item.id} 
                  style={{ 
                    padding: "3px 8px", 
                    backgroundColor: "#f1f5f9", 
                    borderRadius: "4px", 
                    fontSize: "0.75rem", 
                    color: "#334155", 
                    fontFamily: "'SF Mono', 'Menlo', monospace",
                    border: "1px solid #e2e8f0"
                  }}
                >
                  {item?.id}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
