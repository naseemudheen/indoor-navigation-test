import React, { useState } from "react";
import "./Creator.css";
import { scaleLinear, zoomIdentity,zoom, easeCircleInOut } from "d3";
import dijkstrajs from "dijkstrajs";

import FloorplanImage from "./assets/ground-md.svg";
import basementfloor from './assets/undergroud-md.svg'
import firstFloor from './assets/firstfloor-md.svg'
import secondFloor from './assets/2ndfloor-md.svg'
import CMFirstFloor from './assets/CW-1.svg'
import CMSecondFloor from './assets/CW-2.svg'
import CMThirdFloor from './assets/CW-3.svg'

// import FloorplanImage90 from "./static/floorplan90.png";
// import FloorplanImage180 from "./static/floorplan180.png";
// import FloorplanImage270 from "./static/floorplan270.png";
// import FloorplanImageFlipX from "./static/floorplanFlipX.png";
// import FloorplanImageFlipY from "./static/floorplanFlipY.png";

import Floorplan from "./components/FloorPlan";
import PathCreationFloorplan from "./components/PathCreationFloorPlan";
import PathEditingFloorplan from "./components/PathEditingFloorPlan";
import { getRealPointCoordinateRelativeToDigitisationZone } from "./utils";
import groundData2 from '../../data/maps/groundData.json'
import basmentData from '../../data/maps/basementData.json'
import secondData from '../../data/maps/secondFloorData.json'
import firstData from '../../data/maps/firstFloorData.json'
import cancerFirst from '../../data/maps/cancer1Data.json'
import cancerSecond from '../../data/maps/cancer2Data.json'
import cancerThird from '../../data/maps/cancer3Data.json'


function getNaturalImageDimensions(path) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;

      resolve({
        width,
        height,
        floorplanPath: path
      });
    };
    image.onerror = (err) => reject(err);

    image.src = path;
  });
}

function getFloorplanImage(type) {
  switch (type) {
    case "B": {
      return basementfloor;
    }
    case "G":{
      return FloorplanImage
    }
    case "1": {
      return firstFloor;
    }
    case "2": {
      return secondFloor;
    }
    // case "3": {
    //   return FloorplanImageFlipX;
    // }
    // case "flipY": {
    //   return FloorplanImageFlipY;
    // }
    // default: {
    //   return FloorplanImage;
    // }
  }
}

function getStatusText(indexNumber) {
  switch (indexNumber) {
    case 1: {
      return "A";
    }
    case 2: {
      return "N/A";
    }
    case 3: {
      return "SS";
    }
    default: {
      return "ES";
    }
  }
}

function getTimerPosition(indexNumber) {
  switch (indexNumber) {
    case 1: {
      return "top";
    }
    case 2: {
      return "bottom";
    }
    case 3: {
      return "left";
    }
    default: {
      return "right";
    }
  }
}

export default function App() {
  const [isGettingInitialState, setIsGettingInitalState] = React.useState(true);
  const [selectedNearbyDistance, setSelectedNearbyDistance] = React.useState(
    10
  );
  const [digitisationZone, setDigitisationZone] = React.useState({
    origin: [0, 0],
    width: 100,
    height: 100
  });
  const [currentRotation, setCurrentRotation] = React.useState(0);
  const [floorplan, setFloorplan] = React.useState({
    floorplanPath: "",
    width: 0,
    height: 0
  });
  const [
    digitisationZoneForNonRotate,
    setDigitisationZoneForNonRotate
  ] = React.useState({
    origin: [0, 0],
    width: 100,
    height: 100
  });
  const [currentRotationForNonRotate] = React.useState(0);
  const [floorplanForNonRotate, setFloorplanForNonRotate] = React.useState({
    floorplanPath: "",
    width: 0,
    height: 0
  });
  const [unitsCount, setUnitsCount] = React.useState(1);

  const [currentfloordata,setCurrentFloorData]=useState({

  })
  const [unitsData, setUnitsData] = React.useState([]);
  const [selectedUnits, setSelectedUnits] = React.useState([]);
  const [focusViews, setFocusViews] = React.useState([]);
  const [isCreatingFocusView, setIsCreatingFocusView] = React.useState(false);
  const [selectedFocusView, setSelectedFocusView] = React.useState(null);
  const [pathData, setPathData] = React.useState(groundData2);
  const [isCreatingPath, setIsCreatingPath] = React.useState(false);
  const [isEditingPath,setIsEditingPath]=useState(false)
  const [selectedStartPath, setSelectedStartPath] = React.useState("");
  const [selectedEndPath, setSelectedEndPath] = React.useState("");
  const [selectedPath, setSelectedPath] = React.useState([]);

  const svgElementRef = React.useRef(null);
  const svgZoomRef = React.useRef(zoom().on("zoom",(event)=>{
    console.log(event);
  }));

  function setupInitialData() {
    setIsGettingInitalState(true);
    getNaturalImageDimensions(FloorplanImage)
      .then((result) => {
        setFloorplan(result);
        setFloorplanForNonRotate(result)
        setDigitisationZone({
          origin: [100,800],
          width: result.width,
          height: result.height
        });
        setDigitisationZoneForNonRotate({
          origin: [100, 800],
          width: result.width,
          height: result.height
        });
        setUnitsData(
          Array(unitsCount)
            .fill(0)
            .map((item, index) => {
              return {
                id: index + 1,
                coordinates: [0.3738521229137074, 0.6627554052016315],
                status: false,
                shape: "circle",
                text: '16',
               
              };
            })
        );
        setIsGettingInitalState(false);
      })
      .catch((err) => console.log(err));
  }

  // -- floorplan and unit count update --

  function changeFloorplanData(type = "") {
    setDigitisationZone({ origin: [100, 800], width: 100, height: 100 });
    setSelectedFocusView(null);
    resetSelectedUnits();
    if(type==='B'){
      getNaturalImageDimensions(basementfloor)
      .then((result) => {
        setFloorplan(result);
        setDigitisationZone({
          origin: [100,800],
          width: result.width,
          height: result.height
        });
        setIsGettingInitalState(false);
      })
      .catch((err) => console.log(err));
      setPathData(basmentData)
    }else if(type==='G'){
      getNaturalImageDimensions(FloorplanImage)
      .then((result) => {
        setFloorplan(result);
        setDigitisationZone({
          origin: [100,800],
          width: result.width,
          height: result.height
        });
        setIsGettingInitalState(false);
      })
      .catch((err) => console.log(err));
      setPathData(groundData2)
    } else if(type==="1"){
      getNaturalImageDimensions(firstFloor)
      .then((result) => {
        setFloorplan(result);
        setDigitisationZone({
          origin: [100,800],
          width: result.width,
          height: result.height
        });
        setIsGettingInitalState(false);
      })
      .catch((err) => console.log(err));
      setPathData(firstData)
    }else if(type==='2'){
      getNaturalImageDimensions(secondFloor)
      .then((result) => {
        setFloorplan(result);
        setDigitisationZone({
          origin: [100,800],
          width: result.width,
          height: result.height
        });
        setIsGettingInitalState(false);
      })
      .catch((err) => console.log(err));
      setPathData(secondData)
    }else if(type==='C1'){
      getNaturalImageDimensions(CMFirstFloor)
      .then((result) => {
        setFloorplan(result);
        setDigitisationZone({
          origin: [100,800],
          width: result.width,
          height: result.height
        });
        setIsGettingInitalState(false);
      })
      .catch((err) => console.log(err));
      setPathData(cancerFirst)
    }else if(type==='C2'){
      getNaturalImageDimensions(CMSecondFloor)
      .then((result) => {
        setFloorplan(result);
        setDigitisationZone({
          origin: [100,800],
          width: result.width,
          height: result.height
        });
        setIsGettingInitalState(false);
      })
      .catch((err) => console.log(err));
      setPathData(cancerSecond)
    }else if(type==='C3'){
      getNaturalImageDimensions(CMThirdFloor)
      .then((result) => {
        setFloorplan(result);
        setDigitisationZone({
          origin: [100,800],
          width: result.width,
          height: result.height
        });
        setIsGettingInitalState(false);
      })
      .catch((err) => console.log(err));
      setPathData(cancerThird)
    }
    setIsGettingInitalState(true);
    
  }

  function changeUnitsCount(newUnitCount) {
    setSelectedFocusView(null);
    resetSelectedUnits();

    setUnitsData(
      Array(newUnitCount)
        .fill(0)
        .map((item, index) => {
          return {
            id: index + 1,
            coordinates: [0, 0],
            status: false,
            shape: "circle",
            text: getStatusText(index % 4),
            timerPosition: getTimerPosition(index % 4)
          };
        })
    );
  }

  // --- units data update ---

  function setAllUnitStatusToAvailable() {
    setUnitsData((value) =>
      value.map((item) => {
        return { ...item, status: false };
      })
    );
  }

  function setAllUnitStatusToUnavailable() {
    setUnitsData((value) =>
      value.map((item) => {
        return { ...item, status: true };
      })
    );
  }

  function setAllUnitStatusRandomly() {
    setUnitsData((value) =>
      value.map((item) => {
        return {
          ...item,
          status: Math.round(Math.random() * 10) > 5 ? true : false
        };
      })
    );
  }

  function changeAllUnitsShapeToRect() {
    resetSelectedUnits();

    setUnitsData((value) =>
      value.map((item) => {
        return {
          ...item,
          shape: "rect"
        };
      })
    );
  }

  function changeAllUnitsShapeToCircle() {
    resetSelectedUnits();

    setUnitsData((value) =>
      value.map((item) => {
        return {
          ...item,
          shape: "circle"
        };
      })
    );
  }

  function changeAllUnitsShapeToDiamond() {
    resetSelectedUnits();

    setUnitsData((value) =>
      value.map((item) => {
        return {
          ...item,
          shape: "diamond"
        };
      })
    );
  }

  function changeAllUnitsShapeRandomly() {
    resetSelectedUnits();

    setUnitsData((value) =>
      value.map((item) => {
        const rng = Math.round(Math.random() * 15);
        let shape = "rect";

        if (rng <= 5) {
          shape = "rect";
        }

        if (rng > 5 && rng <= 10) {
          shape = "circle";
        }

        if (rng > 10 && rng <= 15) {
          shape = "diamond";
        }

        return {
          ...item,
          shape: shape
        };
      })
    );
  }

  function moveAllUnitsRandomly() {
    setSelectedFocusView(null);
    resetSelectedUnits();

    setUnitsData((value) =>
      value.map((item) => {
        return {
          ...item,
          coordinates: [
            Math.round(Math.random() * digitisationZone.width) /
              digitisationZone.width,
            Math.round(Math.random() * digitisationZone.height) /
              digitisationZone.height
          ]
        };
      })
    );
  }

  // --- focus view creation ---

  function toggleFocusViewCreation() {
    setIsCreatingFocusView(!isCreatingFocusView);
  }

  // --- path creation ---

  function togglePathCreation() {
    setIsCreatingPath(!isCreatingPath);
  }
  function togglePathEditing(){
    setIsEditingPath(!isEditingPath)
  }

  // --- select unit and focus view ---

  function resetSelectedUnits() {
    setSelectedUnits([]);
    svgElementRef.current
      ?.selectAll(".floorplan-svg-group")
      ?.selectAll(".line-nearby-radius")
      .remove();
    svgElementRef.current
      .selectAll(".floorplan-svg-group")
      .selectAll(".circle-nearby-radius")
      .remove();
  }

  function zoomToUnitAndDetectNearby(id) {
    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, Math.abs(digitisationZone.width)]);

    setSelectedFocusView(null);
    resetSelectedUnits();

    const selectedCenterUnit = unitsData.find((item, index) => item.id === id);

    const centerCoordinates = getRealPointCoordinateRelativeToDigitisationZone(
      digitisationZone,
      currentRotation,
      selectedCenterUnit.coordinates[0],
      selectedCenterUnit.coordinates[1]
    );

    svgElementRef.current
      .selectAll(".floorplan-svg-group")
      .append("circle")
      .attr("class", "circle-nearby-radius")
      .attr("cx", centerCoordinates[0])
      .attr("cy", centerCoordinates[1])
      .attr("r", sizeScale(selectedNearbyDistance))
      .attr("fill", "black")
      .attr("opacity", "0.5")
      .attr("stroke", "red");

    let newSelectedUnits = [];
    unitsData.forEach((item) => {
      const currentUnitCoordinates = getRealPointCoordinateRelativeToDigitisationZone(
        digitisationZone,
        currentRotation,
        item.coordinates[0],
        item.coordinates[1]
      );

      const distanceFromCenter = Math.sqrt(
        (centerCoordinates[0] - currentUnitCoordinates[0]) ** 2 +
          (centerCoordinates[1] - currentUnitCoordinates[1]) ** 2
      );

      if (distanceFromCenter <= sizeScale(selectedNearbyDistance)) {
        newSelectedUnits = [...newSelectedUnits, item.id];

        svgElementRef.current
          .selectAll(".floorplan-svg-group")
          .append("line")
          .attr("class", "line-nearby-radius")
          .attr("x1", centerCoordinates[0])
          .attr("y1", centerCoordinates[1])
          .attr("x2", currentUnitCoordinates[0])
          .attr("y2", currentUnitCoordinates[1])
          .attr("style", "stroke:rgb(255,0,0);stroke-width:1");
      }
    });
    setSelectedUnits(newSelectedUnits);

    // zoom in

    const zoomLevelX = floorplan.width / sizeScale(selectedNearbyDistance * 2);
    const zoomLevelY = floorplan.height / sizeScale(selectedNearbyDistance * 2);
    const zoomLevel = Math.min(zoomLevelX, zoomLevelY);

    svgElementRef.current?.transition().duration(450).ease(easeCircleInOut).call(
      svgZoomRef.current.transform,
      zoomIdentity
        .translate(floorplan.width / 2, floorplan.height / 2)
        .scale(zoomLevel)
        .translate(-centerCoordinates[0], -centerCoordinates[1])
    );
  }

  function zoomToFocusView(id) {
    setSelectedFocusView(id);
    resetSelectedUnits();

    const widthSizeScale = scaleLinear()
      .domain([0, 1])
      .range([0, Math.abs(digitisationZone.width)]);
    const heightSizeScale = scaleLinear()
      .domain([0, 1])
      .range([0, Math.abs(digitisationZone.height)]);

    const selectedFV = focusViews.find((item, index) => index === id);

    const selectedFVX = selectedFV.map((item) => item[0]);
    const selectedFVY = selectedFV.map((item) => item[1]);

    const top = Math.min(...selectedFVY);
    const bottom = Math.max(...selectedFVY);
    const left = Math.min(...selectedFVX);
    const right = Math.max(...selectedFVX);

    const width = right - left;
    const height = bottom - top;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const realCenterCoordinate = getRealPointCoordinateRelativeToDigitisationZone(
      digitisationZone,
      currentRotation,
      centerX,
      centerY
    );

    const zoomLevelX = floorplan.width / widthSizeScale(width);
    const zoomLevelY = floorplan.height / heightSizeScale(height);
    const zoomLevel = Math.min(zoomLevelX, zoomLevelY);

    svgElementRef.current.transition().call(
      svgZoomRef.current.transform,
      zoomIdentity
        .translate(floorplan.width / 2, floorplan.height / 2)
        .scale(zoomLevel)
        .translate(-realCenterCoordinate[0], -realCenterCoordinate[1])
    );
  }

  // find path

  function findPath() {
    const simplifiedPathData = {};
    pathData.forEach((item) => {
      simplifiedPathData[item.id] = {};
      item.neighbors.forEach((item1) => {
        simplifiedPathData[item.id][item1.id] = item1.distance;
      });
    });

    // console.log(JSON.stringify(simplifiedPathData), JSON.stringify(pathData));

    const result = dijkstrajs.find_path(
      simplifiedPathData,
      selectedStartPath,
      selectedEndPath
    );
    setSelectedPath(result);
  }

  // -- zoom and reset zoom pan --

  function zoomIn() {
    svgElementRef.current.transition().call(svgZoomRef.current.scaleBy, 2);
    setSelectedFocusView(null);
    resetSelectedUnits();
  }

  function zoomOut() {
    svgElementRef.current.transition().call(svgZoomRef.current.scaleBy, 0.5);
    setSelectedFocusView(null);
    resetSelectedUnits();
  }

  function resetZoomAndPosition() {
    svgElementRef.current
      .transition()
      .call(
        svgZoomRef.current.transform,
        zoomIdentity.translate(0, 0).scale(1)
      );
    setSelectedFocusView(null);
    resetSelectedUnits();
  }

  React.useEffect(() => {
    setupInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isGettingInitialState) {
    return <div className="App">Loading...</div>;
  }
  console.log(groundData2);
  
  const flooringData = groundData2.map((item) => ({
    ...item,
    floor: 0,
  }));
  console.log(flooringData,'with floor');
  
  //  console.log(flooringData.map(item => ({
  //   ...item,
  //   id: `path-${parseInt(item.id.split('-')[1]) + 734}`,
  //   neighbors: item.neighbors.map(neighbor => ({
  //     ...neighbor,
  //     id: `path-${parseInt(neighbor.id.split('-')[1]) + 734}`,
  //   })),
  // })), 'testing2');

  return (
    <div className="creator-layout">
      <div className="creator-sidebar">
        <h2 className="creator-title">Paadha Creator</h2>
        
        <div className="sidebar-section">
          <h3 className="section-title">Floor Selection</h3>
          <div className="floor-buttons">
            <button className="floor-btn" onClick={() => changeFloorplanData("G")}>Ground Floor</button>
            <button className="floor-btn" onClick={() => changeFloorplanData("B")}>Basement</button>
            <button className="floor-btn" onClick={() => changeFloorplanData("1")}>First Floor</button>
            <button className="floor-btn" onClick={() => changeFloorplanData("2")}>Second Floor</button>
            <button className="floor-btn" onClick={() => changeFloorplanData("C1")}>Cancer 1</button>
            <button className="floor-btn" onClick={() => changeFloorplanData("C2")}>Cancer 2</button>
            <button className="floor-btn" onClick={() => changeFloorplanData("C3")}>Cancer 3</button>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Path Finding</h3>
          <div className="point-select-group">
            <label>Start Point</label>
            <select
              className="styled-select"
              value={selectedStartPath}
              onChange={(ev) => {
                setSelectedStartPath(ev.target.value);
                setSelectedEndPath("");
                setSelectedPath([]);
              }}
            >
              <option value="0">No start point selected</option>
              {pathData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="point-select-group">
            <label>End Point</label>
            <select
              className="styled-select"
              value={selectedEndPath}
              onChange={(ev) => {
                setSelectedEndPath(ev.target.value);
                setSelectedPath([]);
              }}
            >
              <option value="0">No end point selected</option>
              {pathData
                .filter((item) => item.name !== selectedStartPath)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <button className="primary-btn" onClick={findPath}>Search Path</button>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">View Controls</h3>
          <div className="action-buttons">
            <button className="secondary-btn" onClick={zoomIn}>Zoom In</button>
            <button className="secondary-btn" onClick={zoomOut}>Zoom Out</button>
            <button className="secondary-btn" onClick={resetZoomAndPosition}>Reset View</button>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Path Management</h3>
          <div className="action-buttons">
            {!isCreatingPath ? (
              <button className="outline-btn" id="create-path-button" onClick={togglePathCreation}>
                Create Path
              </button>
            ) : null}
            {!isEditingPath ? (
              <button className="outline-btn" id="edit-path-button" onClick={togglePathEditing}>
                Edit Path
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="creator-main">
        <div className="floorplan-container">
          <Floorplan
            isGettingInitialState={isGettingInitialState}
            svgElementRef={svgElementRef}
            svgZoomRef={svgZoomRef}
            floorplan={floorplan}
            digitisationZone={digitisationZone}
            currentRotation={currentRotation}
            unitsData={unitsData}
            focusViews={focusViews}
            resetSelectedFocusView={() => setSelectedFocusView(null)}
            resetSelectedUnits={resetSelectedUnits}
            selectedUnits={selectedUnits}
            pathData={pathData}
            selectedStartPath={selectedStartPath}
            selectedEndPath={selectedEndPath}
            selectedPath={selectedPath}
            zoomToUnit={zoomToUnitAndDetectNearby}
          />
        </div>
        
        {isCreatingPath && (
          <div className="overlay-tools-container">
            <h4>Create Path Mode Active</h4>
            <PathCreationFloorplan
              isGettingInitialState={isGettingInitialState}
              floorplan={floorplan}
              digitisationZone={digitisationZone}
              currentRotation={currentRotation}
              togglePathCreation={togglePathCreation}
              setPath={(data) => setPathData(data)}
            />
          </div>
        )}

        {isEditingPath && (
          <div className="overlay-tools-container">
            <h4>Edit Path Mode Active</h4>
            <PathEditingFloorplan
              isGettingInitialState={isGettingInitialState}
              floorplan={floorplan}
              digitisationZone={digitisationZone}
              currentRotation={currentRotation}
              togglePathEditing={togglePathEditing}
              pathinfo={pathData}
              setPath={(data) => setPathData(data)}
            />
          </div>
        )}
      </div>
    </div>
  );
}