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
  pathinfo
}) {
  const [pathData, setPathData] = React.useState(pathinfo);
  const [currentSelectedPathPoint, setCurrentSelectedPathPoint] =
    React.useState("");
    const [detailedSelectedPoint,setDetailedSelectedPoint] = useState({})
  const [isJoinMode, setIsJoinMode] = React.useState(false);
  const [isNameClicked,setIsNameClicked] = useState(false)
  const [message, setMessage] = useState();
  const [prevMessage,setPrevMessage] = useState()
  const [isMessage,setIsMessage] = useState(false)
  const [isDeleteMode, setIsDeleteMode] = React.useState(false);
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
      groupElement
        .selectAll(".path-floorplan-image")
        .data([floorplan])
        .join("image")
        .attr("class", "path-floorplan-image")
        .attr("xlink:href", (value) => value.floorplanPath)
        .attr("width", (value) => value.width)
        .attr("height", (value) => value.height);

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
        console.log("clicked for path");
        setUndoStack((prevUndoStack) => [...prevUndoStack, pathData]);
        if (isJoinMode || isDeleteMode) return;

        const coordinates = pointer(event);
        console.log(coordinates);
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
      .attr("r", sizeScale(3))
      .attr("fill", "blue")
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
      .attr("r", sizeScale(2))
      .attr("fill", "red")
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
        setDetailedSelectedPoint(data)
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
  console.log(pathData, "path here");
  function addname(e){
    const indexToUpdate = pathData.findIndex(item => item.id === currentSelectedPathPoint);
    if (indexToUpdate !== -1) {
      // Update the object
      setTimeout(() => {
        setPathData(prevArray => {
          const newArray = [...prevArray]; // Create a copy of the array
          newArray[indexToUpdate] = { ...detailedSelectedPoint, name: e.target.value }; // Update the object
          return newArray; // Return the updated array
        });
        setIsNameClicked(false)
      }, 2000);
    }
  }

  function addMessage() {
    const indexToUpdate = pathData.findIndex(
      (item) => item.id === currentSelectedPathPoint
    );

    setPathData((prevArray) => {
      const newArray = [...prevArray];
      // setPrevMessage(newArray[indexToUpdate].messages)
      console.log(prevMessage,'prevmesg');
      newArray[indexToUpdate] = {
        ...detailedSelectedPoint,
        messages: {
          ...newArray[indexToUpdate].messages,
          ...message
        },
      };
      return newArray;
    });
    setMessage(null)
  }
  console.log(detailedSelectedPoint,'updated detailed');
  return (
    <React.Fragment>
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
        <button onClick={()=> setIsNameClicked(!isNameClicked)}>Add Name</button>
        {
          isNameClicked && (
            <input type="text" onChange={addname} />
          )
        }  
        <span>{isDeleteMode ? " delete mode active" : ""}</span>
      </div>
      {currentSelectedPathPoint?.length !== 0 && (
          <div className="node2">
            {detailedSelectedPoint.id}
            <br />
            coordinates:{detailedSelectedPoint?.coordinates?.join(",")}
            <br />
            name:{detailedSelectedPoint.name?(
                 <p>{detailedSelectedPoint.name}</p>
              
            ):(
          
              <input type="text" onChange={addname} />
            )}
            <br />
            neighbors:
            {detailedSelectedPoint?.neighbors?.map((item) =>{
              console.log(item.id);
              console.log(pathData[pathData.findIndex((item1)=>item1.id === currentSelectedPathPoint)]?.messages?.[item && item.id]); 
              return  (
                <div>
                <p style={{ margin: 0 }}>{item?.id}</p>
                <button onClick={()=>setIsMessage(true)}>Add Message</button>
                {
                  isMessage && (
                      <input type="text" name={item?.id} defaultValue={pathData[pathData.findIndex((item1)=>item1.id === currentSelectedPathPoint)]?.messages?.[item && item.id]} onChange={(e)=>setMessage({...message,[e.target.name]:e.target.value})} />
                  )
                }
                {
                  pathData[pathData.findIndex((item1)=>item1.id === currentSelectedPathPoint)]?.messages?.[item && item.id] && (
                    <span style={{fontWeight:700}}>{pathData[pathData.findIndex((item1)=>item1.id === currentSelectedPathPoint)]?.messages?.[item && item.id]}</span>
                  )
                }
                </div>
              )
            })}
             {
                isMessage && (
                  <button onClick={addMessage}>Submit</button>
                )
              }
          </div>
        )}
      <div id="path-floorplan-container"></div>
    </React.Fragment>
  );
}
