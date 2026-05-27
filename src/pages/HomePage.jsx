import React, { useCallback, useEffect, useState } from "react";
import { FooterNav, Header } from "../container/Home";
import { DirectIcon } from "../components/Icons";
import { Link } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
// import floor from "../assets/floors/ground-floor-alt.svg";
import DirectionFloor from "../components/DirectionFloor";
import { useDispatch, useSelector } from "react-redux";
const basementData = [];
import groundData from "../data/maps/groundfloor_data.json";
const firstData = [];
const secondData = [];
const cancerFirst = [];
const cancerSecond = [];
const cancerThird = [];
import simpleFloor from "../assets/floors/simple.svg";
// import groundfloor from "../assets/floors/ground-floor.svg";
// import basementfloor from "../assets/floors/underground-floor.svg";
// import firstfloor from "../assets/floors/first-floor.svg";
// import secondfloor from "../assets/floors/second-floor.svg";
// import CMFirstFloor from "../assets/floors/cw-floor-1.svg";
// import CMSecondFloor from "../assets/floors/cw-floor-2.svg";
// import CMThirdFloor from "../assets/floors/cw-floor-3.svg";
const floor = simpleFloor;
const groundfloor = simpleFloor;
const basementfloor = simpleFloor;
const firstfloor = simpleFloor;
const secondfloor = simpleFloor;
const CMFirstFloor = simpleFloor;
const CMSecondFloor = simpleFloor;
const CMThirdFloor = simpleFloor;
import { scaleLinear, zoomIdentity, zoom, merge, easeCircleInOut } from "d3";
import Lottie from "lottie-react";
import loader from "../assets/loader.json";
import { getNaturalImageDimensions } from "../utils/helper";
import { setFloor } from "../redux/mapSlice";
// import {
//   newGround,
//   undergroundLabels,
//   firstLabels,
//   secondLabels,
//   cancerOneLabels,
//   cancerTwoLabels,
//   cancerThreeLabels,
// } from "../low-level-labels";
// import labels from "../label.json";
const newGround = [];
const undergroundLabels = [];
const firstLabels = [];
const secondLabels = [];
const cancerOneLabels = [];
const cancerTwoLabels = [];
const cancerThreeLabels = [];
const labels = [];
import { EntryExit } from "../utils/rooms/ground";
import FloorSwitcher from "../components/FloorSwitcher";
import door from "../assets/icons/door.svg";
import stairIcon from "../assets/icons/stair.svg";
import LiftIcon from "../assets/icons/lift.svg";
import IcuIcon from "../assets/icons/icu.svg";
import DoctorIcon from "../assets/icons/doctor.svg";
import NurseIcon from "../assets/icons/nurse.svg";
import ToiletIcon from "../assets/icons/toilet.svg";
import BloodIcon from "../assets/icons/blood.svg";
import OperationIcon from "../assets/icons/operation.svg";
import ProfessorIcon from "../assets/icons/professor.svg";
import wardIcon from "../assets/icons/ward.svg";
import CanteenIcon from "../assets/icons/canteen.svg";
import DineIcon from "../assets/icons/dining-area.svg";
import PharmacyIcon from "../assets/icons/pharmacy.svg";
import RampIcon from "../assets/icons/ramp.svg";
import LabIcon from "../assets/icons/lab.svg";
import EntryIcon from "../assets/icons/door.svg"
import SecurityIcon from "../assets/icons/security.svg";
import CounterIcon from "../assets/icons/ticker-counter.svg"
import {
  BDoors,
  BStairs,
  BLift,
  BNurse,
  BEnquiry,
  BWards,
  BLabs,
  BPharmacy,
  BEntry,
} from "../data/icons/basement";
// import {
//   GDineArea,
//   GDoctor,
//   GDoors,
//   GFood,
//   GIcu,
//   GLifts,
//   GNurse,
//   GPharmacy,
//   GStairs,
//   GToilet,
//   GWard,
//   GSecurity,
//   GEntry,
//   GCounter,
//   GRamp
// } from "../data/icons/groundFloor";
const GDineArea = [];
const GDoctor = [];
const GDoors = [];
const GFood = [];
const GIcu = [];
const GLifts = [];
const GNurse = [];
const GPharmacy = [];
const GStairs = [];
const GToilet = [];
const GWard = [];
const GSecurity = [];
const GEntry = [];
const GCounter = [];
const GRamp = [];
import {
  FDoctors,
  FBlood,
  FDoors,
  FIcu,
  FLift,
  FNurse,
  FOperationT,
  FProfessor,
  FStair,
  FToilet,
  FWard,
} from "../data/icons/firstFloor";
import {
  SCanteen,
  SDining,
  SDoctor,
  SDoors,
  SIcu,
  SLift,
  SNurse,
  SOt,
  SStairs,
  SToilet,
  SWard,
} from "../data/icons/secondFloor";
import {
  C1Doors,
  C1Lift,
  C1Pharmacy,
  C1Ward,
  C1Ramp,
  C1Stair,
} from "../data/icons/cancerFloor1";
import {
  C3Doors,
  C3Lift,
  C3Pharmacy,
  C3Ramp,
  C3Stair,
  C3Ward,
} from "../data/icons/cancerFloor3";
import { Helmet } from "react-helmet-async";
function simplifyPathObjects(paths) {
  return paths.map((path) => ({
    coordinates: path.coordinates,
  }));
}
function getFloorplanImage(type) {
  switch (type) {
    case -1: {
      return basementfloor;
    }
    case 0: {
      return groundfloor;
    }
    case 1: {
      return firstfloor;
    }
    case 2: {
      return secondfloor;
    }
    case "C1": {
      return CMFirstFloor;
    }
    case "C2": {
      return CMSecondFloor;
    }
    case "C3": {
      return CMThirdFloor;
    }
  }
}
const HomePage = () => {
  const mergedBaseIcons = [
    ...BDoors,
    ...BEnquiry,
    ...BLift,
    ...BNurse,
    ...BStairs,
    ...BWards,
  ];
  const mergedData = [
    ...groundData,
    // ...basementData,
    // ...firstData,
    // ...secondData,
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const handleFloorChange = useCallback((floor) => {
    changeFloorplanData(floor);
  }, []);
  const dispatch = useDispatch();
  const [iconData, setIconData] = useState([]);
  const floor = useSelector((state) => state.map.floor);
  const initialFloor = useSelector((state) => state.map.initialPath);
  const [startSearch, setStartSearch] = useState("");
  const [endsearch, setEndSearch] = useState("");
  const [startfilteredData, setStartFilteredData] = useState([]);
  const [endfilteredData, setEndFilteredData] = useState([]);
  const [showrecent, setShowRecent] = useState(false);
  const [lowLabels, setLowLabels] = useState([]);
  const [isGettingInitialState, setIsGettingInitalState] = React.useState(true);
  const [selectedNearbyDistance, setSelectedNearbyDistance] =
    React.useState(10);
  const [digitisationZone, setDigitisationZone] = React.useState({
    origin: [0, 0],
    width: 100,
    height: 100,
  });
  const [currentRotation, setCurrentRotation] = React.useState(0);
  const [floorplan, setFloorplan] = React.useState({
    floorplanPath: "",
    width: 0,
    height: 0,
  });
  const [digitisationZoneForNonRotate, setDigitisationZoneForNonRotate] =
    React.useState({
      origin: [0, 0],
      width: 100,
      height: 100,
    });
  const [currentRotationForNonRotate] = React.useState(0);
  const [floorplanForNonRotate, setFloorplanForNonRotate] = React.useState({
    floorplanPath: "",
    width: 0,
    height: 0,
  });
  const [unitsCount, setUnitsCount] = React.useState(1);

  const [currentfloordata, setCurrentFloorData] = useState({});
  const finalFloor = useSelector((state) => state.map.finalPath);
  const [unitsData, setUnitsData] = React.useState([]);
  const [selectedUnits, setSelectedUnits] = React.useState([]);
  const [focusViews, setFocusViews] = React.useState([]);
  const [isCreatingFocusView, setIsCreatingFocusView] = React.useState(false);
  const [selectedFocusView, setSelectedFocusView] = React.useState(null);
  const [pathData, setPathData] = React.useState(mergedData);
  const [isCreatingPath, setIsCreatingPath] = React.useState(false);
  const [selectedStartPath, setSelectedStartPath] = React.useState();
  const [selectedOtherStartPath, setSelectedOtherStartPath] = useState();
  const [selectedEndPath, setSelectedEndPath] = React.useState("");
  const [selectedPath, setSelectedPath] = React.useState([]);
  const [selectedStair, setSelectedStair] = useState();
  const [totalSelectedPath, setTotalSelectedPath] = useState([]);
  const [currentStart, setCurrentStart] = useState();
  const [currentEnd, setCurrentEnd] = useState();

  const [mapData, setMapData] = useState();
  const svgElementRef = React.useRef(null);
  const svgZoomRef = React.useRef(
    zoom().on("zoom", (event) => {
      console.log(event);
    }),
  );
  const handleSearchChange = (query) => {
    setStartSearch(query);
    // setSelectedStartPath(null)
    const filtered = mergedData.filter((item) =>
      item.name?.toLowerCase().includes(query.toLowerCase()),
    );
    setStartFilteredData(filtered);
  };
  const handleEndSearchChange = (query) => {
    setEndSearch(query);
    // setSelectedEndPath(null)
    console.log(query);
    const filtered = mergedData.filter((item) =>
      item.name?.toLowerCase().includes(query.toLowerCase()),
    );
    console.log(filtered);
    setEndFilteredData(filtered);
  };
  function setupInitialData() {
    setIsGettingInitalState(true);
    getNaturalImageDimensions(groundfloor)
      .then((result) => {
        setFloorplan(result);
        setFloorplanForNonRotate(result);
        setDigitisationZone({
          origin: [100, 800],
          width: result.width,
          height: result.height,
        });
        // setDigitisationZoneForNonRotate({
        //   origin: [0, 0],
        //   width: result.width,
        //   height: result.height
        // });
        // setUnitsData([]);
        if (floor === 0) {
          setPathData(groundData);
          setUnitsData([]);
          setIconData([]);
          setLowLabels([]);
        } else if (floor === 1) {
          setPathData(firstData);
          setUnitsData([]);
          setIconData([
            { type: "blood", data: FBlood, icon: BloodIcon },
            { type: "doctor", data: FDoctors, icon: DoctorIcon },
            { type: "door", data: FDoors, icon: door },
            { type: "icu", data: FIcu, icon: IcuIcon },
            { type: "lift", data: FLift, icon: LiftIcon },
            { type: "nurse", data: FNurse, icon: NurseIcon },
            { type: "ot", data: FOperationT, icon: OperationIcon },
            { type: "professor", data: FProfessor, icon: ProfessorIcon },
            { type: "stair", data: FStair, icon: stairIcon },
            { type: "toilet", data: FToilet, icon: ToiletIcon },
            { type: "ward", data: FWard, icon: wardIcon },
          ]);
          setLowLabels(firstLabels);
        } else if (floor === -1) {
          setPathData(basementData);
          setUnitsData(undergroundLabels);
          setIconData([
            { type: "door", data: BDoors, icon: door },
            { type: "stair", data: BStairs, icon: stairIcon },
            { type: "lift", data: BLift, icon: LiftIcon },
            { type: "ward", data: BWards, icon: wardIcon },
            { type: "nurse", data: BNurse, icon: NurseIcon },
            { type: "enquiry", data: BEnquiry, icon: IcuIcon },
            { type: "lab", data: BLabs, icon: LabIcon },
            { type: "pharmacy", data: BPharmacy, icon: PharmacyIcon },
            { type: "entry", data: BEntry, icon: EntryIcon }
          ]);
          handleClick(-1);
          setLowLabels(undergroundLabels);
        } else if (floor === "C1") {
          setPathData(cancerFirst);
          setIconData([
            { type: "door", data: C1Doors, icon: door },
            { type: "stair", data: C1Stair, icon: stairIcon },
            { type: "lift", data: C1Lift, icon: LiftIcon },
            { type: "ward", data: C1Ward, icon: wardIcon },
            { type: "pharmacy", data: C1Pharmacy, icon: PharmacyIcon },
            { type: "ramp", data: C1Ramp, icon: RampIcon },
          ]);
          setLowLabels(cancerOneLabels);
          setUnitsData(C1Doors);
        } else if (floor === "C2") {
          setPathData(cancerSecond);
          setUnitsData(C3Doors);
          setIconData([
            { type: "pharmacy", data: C1Pharmacy, icon: PharmacyIcon },
          ]);
          setLowLabels(cancerTwoLabels);
        } else if (floor === "C3") {
          setPathData(cancerThird);
          setLowLabels(cancerThreeLabels);
          setIconData([
            { type: "door", data: C3Doors, icon: door },
            { type: "stair", data: C3Stair, icon: stairIcon },
            { type: "lift", data: C3Lift, icon: LiftIcon },
            { type: "ward", data: C3Ward, icon: wardIcon },
            { type: "pharmacy", data: C3Pharmacy, icon: PharmacyIcon },
            { type: "ramp", data: C3Ramp, icon: RampIcon },
          ]);
          setUnitsData(C3Doors);
        } else {
          setPathData(secondData);
          setLowLabels(secondLabels);
          setIconData([
            { type: "canteent", data: SCanteen, icon: CanteenIcon },
            { type: "dine", data: SDining, icon: DineIcon },
            { type: "doctor", data: SDoctor, icon: DoctorIcon },
            { type: "door", data: SDoors, icon: door },
            { type: "icu", data: SIcu, icon: IcuIcon },
            { type: "lift", data: SLift, icon: LiftIcon },
            { type: "nurse", data: SNurse, icon: NurseIcon },
            { type: "ot", data: SOt, icon: OperationIcon },
            { type: "stair", data: SStairs, icon: stairIcon },
            { type: "toilet", data: SToilet, icon: ToiletIcon },
            { type: "ward", data: SWard, icon: wardIcon },
          ]);
          setUnitsData([]);
        }
        setIsGettingInitalState(false);
      })
      .catch((err) => console.log(err));
  }
  function changeFloorplanData(type = "") {
    setDigitisationZone({ origin: [100, 800], width: 100, height: 100 });
    setSelectedFocusView(null);
    resetSelectedUnits();
    dispatch(setFloor(type));
    console.log(type);
    if (type === -1) {
      setPathData(basementData);
      setUnitsData(undergroundLabels);
      setIconData([
        { type: "door", data: BDoors, icon: door },
        { type: "stair", data: BStairs, icon: stairIcon },
        { type: "lift", data: BLift, icon: LiftIcon },
        { type: "ward", data: BWards, icon: wardIcon },
        { type: "nurse", data: BNurse, icon: NurseIcon },
        { type: "enquiry", data: BEnquiry, icon: IcuIcon },
        { type: "lab", data: BLabs, icon: LabIcon },
        { type: "pharmacy", data: BPharmacy, icon: PharmacyIcon },
        { type: "entry", data: BEntry, icon: EntryIcon }
      ]);
      handleClick(-1);
      setLowLabels(undergroundLabels);
    } else if (type === 0) {
      setPathData(groundData);
      setUnitsData([]);
      setIconData([]);
      setLowLabels([]);
      handleClick(0);
    } else if (type === 1) {
      setPathData(firstData);
      setUnitsData([]);
      setIconData([
        { type: "blood", data: FBlood, icon: BloodIcon },
        { type: "doctor", data: FDoctors, icon: DoctorIcon },
        { type: "door", data: FDoors, icon: door },
        { type: "icu", data: FIcu, icon: IcuIcon },
        { type: "lift", data: FLift, icon: LiftIcon },
        { type: "nurse", data: FNurse, icon: NurseIcon },
        { type: "ot", data: FOperationT, icon: OperationIcon },
        { type: "professor", data: FProfessor, icon: ProfessorIcon },
        { type: "stair", data: FStair, icon: stairIcon },
        { type: "toilet", data: FToilet, icon: ToiletIcon },
        { type: "ward", data: FWard, icon: wardIcon },
      ]);
      setLowLabels(firstLabels);
      handleClick(1);
    } else if (type == "C1") {
      setPathData(cancerFirst);
      setIconData([
        { type: "door", data: C1Doors, icon: door },
        { type: "stair", data: C1Stair, icon: stairIcon },
        { type: "lift", data: C1Lift, icon: LiftIcon },
        { type: "ward", data: C1Ward, icon: wardIcon },
        { type: "pharmacy", data: C1Pharmacy, icon: PharmacyIcon },
        { type: "ramp", data: C1Ramp, icon: RampIcon },
      ]);
      setLowLabels(cancerOneLabels);
      setUnitsData(C1Doors);
      handleClick(3);
    } else if (type == "C2") {
      setPathData(cancerSecond);
      setUnitsData(C3Doors);
      setIconData([{ type: "pharmacy", data: C1Pharmacy, icon: PharmacyIcon }]);
      setLowLabels(cancerTwoLabels);
      handleClick(4);
    } else if (type == "C3") {
      setPathData(cancerThird);
      setLowLabels(cancerThreeLabels);
      setIconData([
        { type: "door", data: C3Doors, icon: door },
        { type: "stair", data: C3Stair, icon: stairIcon },
        { type: "lift", data: C3Lift, icon: LiftIcon },
        { type: "ward", data: C3Ward, icon: wardIcon },
        { type: "pharmacy", data: C3Pharmacy, icon: PharmacyIcon },
        { type: "ramp", data: C3Ramp, icon: RampIcon },
      ]);
      setUnitsData(C3Doors);
      handleClick(5);
    } else {
      setPathData(secondData);
      setLowLabels(secondLabels);
      setIconData([
        { type: "canteent", data: SCanteen, icon: CanteenIcon },
        { type: "dine", data: SDining, icon: DineIcon },
        { type: "doctor", data: SDoctor, icon: DoctorIcon },
        { type: "door", data: SDoors, icon: door },
        { type: "icu", data: SIcu, icon: IcuIcon },
        { type: "lift", data: SLift, icon: LiftIcon },
        { type: "nurse", data: SNurse, icon: NurseIcon },
        { type: "ot", data: SOt, icon: OperationIcon },
        { type: "stair", data: SStairs, icon: stairIcon },
        { type: "toilet", data: SToilet, icon: ToiletIcon },
        { type: "ward", data: SWard, icon: wardIcon },
      ]);
      setUnitsData([]);
      handleClick(2);
    }
    setIsGettingInitalState(true);
    getNaturalImageDimensions(getFloorplanImage(type))
      .then((result) => {
        setFloorplan(result);
        setDigitisationZone({
          origin: [100, 800],
          width: result.width,
          height: result.height,
        });
        setIsGettingInitalState(false);
      })
      .catch((err) => console.log(err));
  }
  function resetSelectedUnits() {
    setSelectedUnits([]);
    svgElementRef.current
      ?.selectAll(".floorplan-svg-group")
      ?.selectAll(".line-nearby-radius")
      .remove();
    svgElementRef.current
      ?.selectAll(".floorplan-svg-group")
      ?.selectAll(".circle-nearby-radius")
      ?.remove();
  }

  function zoomToUnitAndDetectNearby(id) {
    console.log(id);
    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, Math.abs(digitisationZone.width)]);

    setSelectedFocusView(null);
    resetSelectedUnits();

    const selectedCenterUnit = pathData.find((item, index) => item.id === id);
    console.log(selectedCenterUnit);
    const centerCoordinates = getRealPointCoordinateRelativeToDigitisationZone(
      digitisationZone,
      currentRotation,
      selectedCenterUnit?.coordinates[0],
      selectedCenterUnit?.coordinates[1],
    );

    // svgElementRef.current
    //   .selectAll(".floorplan-svg-group")
    //   .append("circle")
    //   .attr("class", "circle-nearby-radius")
    //   .attr("cx", centerCoordinates[0])
    //   .attr("cy", centerCoordinates[1])
    //   .attr("r", sizeScale(selectedNearbyDistance))
    //   .attr("fill", "black")
    //   .attr("opacity", "0.5")
    //   .attr("stroke", "red");

    let newSelectedUnits = [];
    unitsData.forEach((item) => {
      const currentUnitCoordinates =
        getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          item.coordinates[0],
          item.coordinates[1],
        );

      const distanceFromCenter = Math.sqrt(
        (centerCoordinates[0] - currentUnitCoordinates[0]) ** 2 +
          (centerCoordinates[1] - currentUnitCoordinates[1]) ** 2,
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
        .translate(-centerCoordinates[0], -centerCoordinates[1]),
    );
  }
  console.log(selectedStartPath);

  // zoomToUnitAndDetectNearby('path-0')
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
      selectedEndPath,
    );
    console.log(result);
    // setSelectedPath(result);
    const result2 = findShortestPath(
      simplifiedPathData,
      selectedStartPath,
      selectedEndPath,
    );
    console.log(result2);
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

  function resetZoomAndPosition(x, y, z) {
    svgElementRef.current
      .transition()
      .call(
        svgZoomRef.current.transform,
        zoomIdentity.translate(x, y).scale(z),
      );
    setSelectedFocusView(null);
    resetSelectedUnits();
  }
  const handleClick = (index) => {
    setActiveIndex(index);
  };
  const handleRecentClose = (value) => {
    setShowRecent(value);
  };
  useEffect(() => {
    if (!isGettingInitialState) {
      if (floor === 0 || floor === 1 || floor === 2) {
        resetZoomAndPosition(-45691, -47246, 8.9);
      } else if (floor === -1) {
        console.log("woked");
        resetZoomAndPosition(-30435, -21766, 5);
      } else if (floor === "C1" || floor === "C2" || floor === "C3") {
        resetZoomAndPosition(-16409, -13761, 5);
      }
      // resetZoomAndPosition(-23682, -22432, 5);
    }
  }, [isGettingInitialState]);

  function getFloorData(floor) {
    switch (floor) {
      case 0:
        setPathData(groundData);
        return groundData;
      case -1:
        setPathData(basementData);
        return basementData;
      case 1:
        setPathData(firstData);
        return firstData;
      case 2:
        setPathData(secondData);
        return secondData;
      default:
        return CollegePath;
    }
  }

  console.log(selectedStartPath, 467);

  const findPath2 = (start, end, path) => {
    const simplifiedPathData = {};
    path?.forEach((item) => {
      simplifiedPathData[item.id] = {};
      item.neighbors.forEach((item1) => {
        simplifiedPathData[item.id][item1.id] = { distance: item1.distance };
      });
    });
    const result = dijkstrajs.find_path(simplifiedPathData, start?.id, end?.id);
    setSelectedPath(result);
    return result;
  };
  useEffect(() => {
    setupInitialData();
  }, []);

  // useEffect(() => {
  //   if(state){
  //     setSelectedEndPath(state.endPoint)
  //   }

  // }, [state])
  // console.log(
  //   groundData.map((item) => ({
  //     ...item,
  //     floor: 0,
  //   })),
  //   "testing"
  // );
  // console.log(basementData.map(item => ({
  //   ...item,
  //   id: `path-${parseInt(item.id.split('-')[1]) + 459}`,
  //   neighbors: item.neighbors.map(neighbor => ({
  //     ...neighbor,
  //     id: `path-${parseInt(neighbor.id.split('-')[1]) + 459}`,
  //   })),
  // })), 'testing');
  useEffect(() => {
    if (selectedStartPath && selectedEndPath) {
      console.log(selectedStartPath, "worked");
      console.log(selectedEndPath);
      if (selectedStartPath?.floor !== selectedEndPath?.floor) {
        if (selectedStartPath) {
          const fullStaircase = getFloorData(selectedStartPath.floor).find(
            (item) =>
              item.id ===
              findNearestStair(
                getFloorData(selectedStartPath.floor),
                selectedStartPath?.id,
              ),
          );
          setSelectedStair(fullStaircase);
          setSelectedPath(
            findPath2(
              selectedStartPath,
              fullStaircase,
              getFloorData(selectedStartPath.floor),
            ),
          );
          // if(totalSelectedPath.length===0){
          const newPath1 = findPath2(
            selectedStartPath,
            fullStaircase,
            getFloorData(selectedStartPath.floor),
          );
          // setTotalSelectedPath(newPath1)
          // }
          dispatch(
            setInitialPath({
              path: findPath2(
                selectedStartPath,
                fullStaircase,
                getFloorData(selectedStartPath.floor),
              ),
              floor: selectedStartPath.floor,
              startPoint: selectedStartPath,
              endPoint: fullStaircase,
            }),
          );

          //other floor
          const simpleOtherStart = fullStaircase?.neighbors.find(
            (item) => item.floor === selectedEndPath.floor,
          );
          const OtherStart = getFloorData(selectedEndPath.floor).find(
            (item) => item.id === simpleOtherStart?.id,
          );
          console.log(OtherStart);
          setSelectedPath(
            findPath2(
              OtherStart,
              selectedEndPath,
              getFloorData(selectedEndPath.floor),
            ),
          );
          console.log(
            findPath2(
              OtherStart,
              selectedEndPath,
              getFloorData(selectedEndPath.floor),
            ),
          );
          const newPath2 = [
            newPath1,
            findPath2(
              OtherStart,
              selectedEndPath,
              getFloorData(selectedEndPath.floor),
            ),
          ];
          setTotalSelectedPath(newPath2);
          dispatch(
            setFinalPath({
              path: findPath2(
                OtherStart,
                selectedEndPath,
                getFloorData(selectedEndPath.floor),
              ),
              floor: selectedEndPath.floor,
              startPoint: OtherStart,
              endPoint: selectedEndPath,
            }),
          );
        }
        // }else if(selectedEndPath){
        //   const simpleOtherStart = selectedStair?.neighbors.find((item)=> item.floor===selectedEndPath.floor)
        //   const OtherStart = getFloorData(selectedEndPath.floor).find((item)=>item.id === simpleOtherStart?.id)
        //   setSelectedPath(findPath2(OtherStart,selectedEndPath,getFloorData(selectedEndPath.floor)))
        //   const newPath = [totalSelectedPath,findPath2(OtherStart,selectedEndPath,getFloorData(selectedEndPath.floor))]
        //   setTotalSelectedPath(newPath)
        //   dispatch(setFinalPath({
        //     path:findPath2(OtherStart,selectedEndPath,getFloorData(selectedEndPath.floor)),
        //     floor:selectedEndPath.floor,
        //     startPoint:OtherStart,
        //     endPoint:selectedEndPath
        //   }))
        // }
      } else {
        setSelectedPath(
          findPath2(
            selectedStartPath,
            selectedEndPath,
            getFloorData(selectedEndPath?.floor),
          ),
        );
        if (totalSelectedPath.length === 0) {
          const newPath = [
            findPath2(
              selectedStartPath,
              selectedEndPath,
              getFloorData(selectedEndPath.floor),
            ),
          ];
          setTotalSelectedPath(newPath);
        }
        dispatch(
          setInitialPath({
            path: findPath2(
              selectedStartPath,
              selectedEndPath,
              getFloorData(selectedStartPath.floor),
            ),
            floor: selectedStartPath.floor,
            startPoint: selectedStartPath,
            endPoint: selectedEndPath,
          }),
        );
      }
    }
  }, [selectedStartPath, selectedEndPath, floor]);

  useEffect(() => {
    if (floor) {
      changeFloorplanData(floor);
    }
  }, []);

  if (isGettingInitialState) {
    return (
      <div className="App w-full h-[100dvh] flex justify-center items-center flex-col">
        <Lottie
          animationData={loader}
          className="w-[500px] h-[200px]"
          loop={true}
        />
        <h2 className="font-medium">Map is Loading...</h2>
      </div>
    );
  }
  // console.log(simplifyPathObjects(SWard), "doors");
  // console.log(
  //   newGround.map((item) => ({
  //     coordinates: item.coordinates,
  //     name: item.name,
  //   })),
  //   "oodod"
  // );
  //find biggest id
  const objectWithLargestId = mergedData.reduce((max, obj) => {
    const currentId = parseInt(obj.id.replace(/\D/g, ""), 10); // Extract numeric part of the ID
    const maxId = parseInt(max.id.replace(/\D/g, ""), 10);
    return currentId > maxId ? obj : max;
  }, mergedData[0]);

  console.log(objectWithLargestId, "kidu");

  return (
    <div className="w-full h-[100dvh] relative max-w-3xl">
        <Helmet>
        <title>Home</title>
        <meta name="description" content="Explore Government Medical College with Paadha's indoor navigation system. Discover the different floors, departments, and facilities available in the college." />
        <link rel="canonical" href="https://paadha.com/home" />
      </Helmet>
      {/* <TransformWrapper
      initialScale={5}
      initialPositionX={-1000}
      initialPositionY={-600}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <React.Fragment>
          <TransformComponent wrapperStyle={{width:'100%',height:'100%'}}>
            <img src={floor} alt="test" />
          </TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper> */}
      <div className="h-full floorplan-container">
        <DirectionFloor
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
          pathData={mergedData}
          selectedStartPath={selectedStartPath}
          selectedEndPath={selectedEndPath}
          currentPath={selectedPath}
          stair={selectedStair}
          zoomToUnit={zoomToUnitAndDetectNearby}
          totalPath={totalSelectedPath}
          labels={labels}
          lowLabels={lowLabels}
          icons={iconData}
        />
      </div>
      <Header />
      <div className="absolute bottom-0 w-full">
        <Link to="/directions">
          <div className="bg-[#29AB87] p-4 flex justify-center items-center w-fit rounded-[20px] fixed bottom-[15vh] right-[1rem] lg:right-[25rem] shadow-[0_2px_3px_1px_rgba(0,0,0,0.3)]">
            <DirectIcon />
          </div>
        </Link>

        <FooterNav />
      </div>
      <FloorSwitcher
        activeIndex={activeIndex}
        floorFunction={handleFloorChange}
      />
    </div>
  );
};

export default HomePage;
