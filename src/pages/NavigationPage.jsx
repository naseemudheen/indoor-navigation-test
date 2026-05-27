import React, { useState, useEffect, Fragment, useRef } from "react";
import { easeBounce, easeCircleInOut, easeCircleOut, easeElastic, easeLinear, easeQuadInOut } from 'd3-ease';
import {
  BottomNavigation,
  TopNavigationSection,
} from "../container/Navigation";
import { useLocation } from "react-router-dom";
import { CollegePath } from "../data";
import { select, scaleLinear, zoomIdentity, zoom } from "d3";
import dijkstrajs from "dijkstrajs";
import Floorplan from "../components/Floorplan";
import { getNaturalImageDimensions } from "../utils/helper";
import { RxTriangleLeft, RxTriangleRight } from "react-icons/rx";
import { ActionIcon } from "../components/Icons";
// import Labels from "../label.json";
// import {
//   newGround,
//   undergroundLabels,
//   firstLabels,
//   secondLabels,
//   cancerOneLabels,
//   cancerTwoLabels,
//   cancerThreeLabels,
// } from "../low-level-labels";
const Labels = [];
const newGround = [];
const undergroundLabels = [];
const firstLabels = [];
const secondLabels = [];
const cancerOneLabels = [];
const cancerTwoLabels = [];
const cancerThreeLabels = [];
const basementData = [];
import _groundData from "../data/maps/groundfloor_data.json";
const groundData = _groundData.nodes || _groundData;
const firstData = [];
const secondData = [];
import { ChevronDown, ChevronUp } from "../components/Icons";
import { IoCloseOutline } from "react-icons/io5";
import { FaWalking } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getRealPointCoordinateRelativeToDigitisationZone } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { setFloor } from "../redux/mapSlice";
import simpleFloor from "../assets/floors/simple.svg";
// import groundfloor from "../assets/floors/ground-floor.svg";
// import basementfloor from "../assets/floors/underground-floor.svg";
// import firstfloor from "../assets/floors/first-floor.svg";
// import secondfloor from "../assets/floors/second-floor.svg";
const groundfloor = simpleFloor;
const basementfloor = simpleFloor;
const firstfloor = simpleFloor;
const secondfloor = simpleFloor;
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import Lottie from "lottie-react";
import loader from "../assets/loader.json";
import FloorSwitcher from "../components/FloorSwitcher";
import { mergedData, normalFloors } from "../constants/floors";
// import CMFirstFloor from "../assets/floors/cw-floor-1.svg";
// import CMSecondFloor from "../assets/floors/cw-floor-2.svg";
// import CMThirdFloor from "../assets/floors/cw-floor-3.svg";
const CMFirstFloor = simpleFloor;
const CMSecondFloor = simpleFloor;
const CMThirdFloor = simpleFloor;
const cancerFirst = [];
const cancerSecond = [];
const cancerThird = [];
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
import SecurityIcon from "../assets/icons/security.svg";
import {
  BDoors,
  BStairs,
  BLift,
  BNurse,
  BEnquiry,
  BWards,
  BLabs,
  BPharmacy,
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
//   GRamp,
//   GSecurity,
//   GStairs,
//   GToilet,
//   GWard,
// } from "../data/icons/groundFloor";
const GDineArea = [];
const GDoctor = [];
const GDoors = [];
const GFood = [];
const GIcu = [];
const GLifts = [];
const GNurse = [];
const GPharmacy = [];
const GRamp = [];
const GSecurity = [];
const GStairs = [];
const GToilet = [];
const GWard = [];
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
import {
  calculateAngle,
  calculateAngleBetweenTwoPoints,
} from "../utils/helper/angleFinder";
import { reducedAngle } from "../utils/helper/reducedAngle";
import { calculateDirection } from "../utils/helper/directionFinder";
import { current } from "@reduxjs/toolkit";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "../components/ErrorPage";

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

const NavigationPage = () => {
  let { state } = useLocation();
  const floor = useSelector((state) => state.map.floor);
  const [turningPoint, setTurningPoint] = useState();
  const initialFloor = useSelector((state) => state.map.initialPath);
  const intermediateFloor = useSelector((state) => state.map.intermediatePath);
  const finalFloor = useSelector((state) => state.map.finalPath);
  const [activeIndex, setActiveIndex] = useState(0);
  const [startSearch, setStartSearch] = useState("");
  const [receivedBoolean, setReceivedBoolean] = useState(false);
  const [endsearch, setEndSearch] = useState("");
  const dispatch = useDispatch();
  const [floorPath, setFloorPath] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [lowLabels, setLowLabels] = useState();
  const [showrecent, setShowRecent] = useState(false);
  const [floorReached, setIsFloorReached] = useState(false);
  const [isReached, setIsReached] = useState(false);
  const [isGettingInitialState, setIsGettingInitalState] = React.useState(true);
  const [detailedPath, setDetailedPath] = useState([]);
  const [currentPath, setCurrentPath] = useState();
  const [trigger, setTrigger] = useState(false);
  const [prevTrigger, setPrevTrigger] = useState(false);
  const [floorChanged, setFloorChanged] = useState(false);
  const [iconData, setIconData] = useState([]);
  const floorCounter = useRef(0);
  const [passedFloors, setPassedFloors] = useState([]);
  const [initialFloorPassed, setInitialFloorPassed] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [remainingDistance, setRemainingDistance] = useState(state?.distance || 0);
  const [selectedNearbyDistance, setSelectedNearbyDistance] =
    React.useState(10);
  const [digitisationZone, setDigitisationZone] = React.useState({
    origin: [0, 0],
    width: 100,
    height: 100,
  });
  const [currentRotation, setCurrentRotation] = useState(0);
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
  const [unitsData, setUnitsData] = React.useState([]);
  const [selectedUnits, setSelectedUnits] = React.useState([]);
  const [focusViews, setFocusViews] = React.useState([]);
  const [isCreatingFocusView, setIsCreatingFocusView] = React.useState(false);
  const [selectedFocusView, setSelectedFocusView] = React.useState(null);
  const [pathData, setPathData] = useState(groundData);
  const [isCreatingPath, setIsCreatingPath] = React.useState(false);
  const [selectedStartPath, setSelectedStartPath] = React.useState("");
  const [selectedEndPath, setSelectedEndPath] = React.useState("");
  const [selectedPath, setSelectedPath] = React.useState([]);
  const [newselectedpath, setNewSelectedPath] = useState([]);
  const [startPoint, setStartPoint] = useState();
  const [endPoint, setEndPoint] = useState();
  const [message, setMessage] = useState("Go Straight To Next Point");
  const [count, setCount] = useState(0);
  const [currentPoint, setCurrentPoint] = useState([]);
  const [rotationList, setRotationList] = useState([]);
  const [turningPointList, setTurningPointList] = useState([]);
  const svgElementRef = React.useRef(null);
  const svgZoomRef = React.useRef(
    zoom().on("zoom", (event) => {
      console.log(event);
    }),
  );
  const handleSearchChange = (query) => {
    setStartSearch(query);
    const filtered = CollegePath.filter((item) =>
      item.id.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  
  
  useEffect(() => {
    let direction = 0;
    if (detailedPath?.length > 0 && !trigger && !prevTrigger) {
      direction = calculateDirection(
        detailedPath[count],
        detailedPath[count + 1],
      );
    } else if (detailedPath?.length > 0 && trigger) {
      console.log(detailedPath);
      console.log(count);

      console.log(detailedPath[count + 1]);
      console.log(detailedPath[count]);
      console.log("trigger");

      direction = calculateDirection(
        detailedPath[count],
        detailedPath[count + 1],
      );
    } else if (detailedPath?.length > 0 && prevTrigger) {
      console.log(count);

      console.log(detailedPath[count - 2]);
      console.log(detailedPath[count - 1]);
      direction = calculateDirection(
        detailedPath[count - 2],
        detailedPath[count - 1],
      );
      console.log(direction);
    }
    console.log(direction);
    
    setCurrentRotation(direction);
  }, [detailedPath]);

  const handleNextClick = async () => {
    if (count >= detailedPath.length - 1) {
      setMessage("Destination reached");
      setIsReached(true);
      return;
    }
    let angleDegrees = calculateAngle(
      detailedPath[count - 1],
      detailedPath[count],
      detailedPath[count + 1],
    );
    let futureAngleDegree = calculateAngle(
      detailedPath[count],
      detailedPath[count + 1],
      detailedPath[count + 2],
    );

    if (angleDegrees < 0) {
      angleDegrees += 360;
    }
    if (futureAngleDegree < 0) {
      futureAngleDegree += 360;
    }

    let rotation = 0;
    if (futureAngleDegree > 0 && futureAngleDegree <= 45) {
      setMessage("Turn slightly right");
      setTurningPoint(detailedPath[count + 1]);
    } else if (futureAngleDegree > 45 && futureAngleDegree <= 135) {
      setTurningPoint(detailedPath[count + 1]);
      setMessage("Turn right");
    } else if (futureAngleDegree > 135 && futureAngleDegree <= 225) {
      setMessage("Turn slightly left");
      setTurningPoint(detailedPath[count + 1]);
    } else if (futureAngleDegree > 225 && futureAngleDegree <= 315) {
      setMessage("Turn left");
      setTurningPoint(detailedPath[count + 1]);
    } else {
      setMessage("Go Straight To Next Point");
    }
    turningPointList.push(detailedPath[count + 1]);
    setIsRotated(true); // Assuming any movement implies rotation from previous state

    // Always rotate to the absolute direction of the next segment for Heading-Up
    const targetAngle = calculateDirection(
      detailedPath[count],
      detailedPath[count + 1],
    );

    // Find the shortest path to targetAngle from currentRotation
    let diff = (targetAngle - currentRotation) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const finalAngle = currentRotation + diff;

    setRotationList((prev) => [...prev, currentRotation]);
    setCurrentRotation(finalAngle);

    // Zoom exactly ONCE at the end with the correct finalAngle:
    await zoomToUnitAndDetectNearby(detailedPath[count + 1]?.id, finalAngle);

    setCount((prev) => Math.max(prev + 1, 0));
    await setPrevTrigger(false);
    await setTrigger(true);
  };
  console.log(count);

  const handlePrevClick = async () => {
    if (count <= 0) return; // Already at the first point, nothing to go back to

    const prevCount = count - 1; // Calculate the previous index upfront
    
    let currAngle = currentRotation;
    if (rotationList.length > 0) {
      const newHistory = [...rotationList];
      currAngle = newHistory.pop();
      setRotationList(newHistory);
    }

    // Update directional message using the previous waypoint
    if (currAngle > 0 && currAngle <= 45) {
      setMessage("Turn slightly right");
      setTurningPoint(detailedPath[prevCount]);
    } else if (currAngle > 45 && currAngle <= 135) {
      setTurningPoint(detailedPath[prevCount]);
      setMessage("Turn right");
    } else if (currAngle > 135 && currAngle <= 225) {
      setMessage("Turn slightly left");
      setTurningPoint(detailedPath[prevCount]);
    } else if (currAngle > 225 && currAngle <= 315) {
      setMessage("Turn left");
      setTurningPoint(detailedPath[prevCount]);
    } else {
      setMessage("Go Straight To Next Point");
    }

    // Zoom to the PREVIOUS waypoint using the correct (popped) angle
    await zoomToUnitAndDetectNearby(detailedPath[prevCount]?.id, currAngle);

    // Batch all state updates together — no intermediate awaits to avoid
    // stale-closure issues and spurious intermediate re-renders
    setCurrentRotation(currAngle);
    setTrigger(false);
    setPrevTrigger(true);
    setCount(prevCount);
    console.log("Going back to:", prevCount);
  };
  console.log(count);

  const stopPrevTrigger = () => {
    setPrevTrigger(false);
  };

  const stopTrigger = () => {
    setTrigger(false);
  };

  const handleNewPath = (path) => {
    setNewSelectedPath(path);
  };
  const handleEndSearchChange = (query) => {
    setEndSearch(query);
    const filtered = CollegePath.filter((item) =>
      item.id.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredData(filtered);
  };
  useEffect(() => {
    if (turningPoint) {
      zoomToUnitAndDetectNearby(detailedPath[count]?.id, currentRotation);
    }
  }, [currentRotation]);

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
    if (!svgElementRef.current) return;
    const d3Svg = select(svgElementRef.current);
    d3Svg
      .select(".floorplan-svg-group")
      .selectAll(".line-nearby-radius")
      .remove();
    d3Svg
      .select(".floorplan-svg-group")
      .selectAll(".circle-nearby-radius")
      .remove();
  }

  function zoomToUnitAndDetectNearby(id, rotation) {
    const selectedCenterUnit = pathData?.find((item, index) => item.id === id);
    const centerCoordinates = getRealPointCoordinateRelativeToDigitisationZone(
      digitisationZone,
      0, // Pass 0 because Floorplan.jsx now rotates around the point itself, making its position static in parent space.
      selectedCenterUnit?.coordinates[0],
      selectedCenterUnit?.coordinates[1],
    );
    select(svgElementRef.current)?.transition().duration(800).ease(easeQuadInOut).call(
      svgZoomRef.current.transform,
      zoomIdentity
        .translate(floorplan.width / 2, floorplan.height / 2)
        // .scale(2.5)
        .scale(14)
        .translate(-centerCoordinates[0], -centerCoordinates[1]),
    );
  }
  // -- zoom and reset zoom pan --

  function zoomIn() {
    select(svgElementRef.current).transition().call(svgZoomRef.current.scaleBy, 2);
    setSelectedFocusView(null);
    resetSelectedUnits();
  }

  function zoomOut() {
    select(svgElementRef.current).transition().call(svgZoomRef.current.scaleBy, 0.5);
    setSelectedFocusView(null);
    resetSelectedUnits();
  }

  function resetZoomAndPosition() {
    select(svgElementRef.current)
      .transition()
      .call(
        svgZoomRef.current.transform,
        zoomIdentity.translate(0, 0).scale(1),
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
    setupInitialData();
    // const reversed = [...arr].reverse()
  }, []);
  // useEffect(()=>{
  //   if(finalFloor?.startPoint?.id!==null){
  //     zoomToUnitAndDetectNearby(finalFloor?.startPoint?.id)
  //   }
  // },[floor])
  // useEffect(() => {
  //   if(currentPath?.length!==0){
  //     console.log(floor);
  //     console.log(currentPath);
  //     const arr = currentPath?.map(id => CollegePath?.find(item => item.id === id)).filter(Boolean);
  //     console.log(arr);
  //     setDetailedPath(arr);
  //   }
  // }, [floor])
  useEffect(() => {
    if (initialFloor.path === null) {
      window.location.href = "/home";
    }
  }, []);

console.log(initialFloor);
console.log(finalFloor);



  useEffect(() => {
    // changeFloorplanData(initialFloor?.floor);
    let finalEqual = false;
    console.log(currentPath);
    
    if(currentPath){
      finalEqual = currentPath?.length === finalFloor.path?.length && 
      currentPath.every((element, index) => element === finalFloor.path[index]); 
    }

    console.log(finalEqual);
    console.log(currentPath);
    
    const selectedStartPathFloor = state?.path.find(
      (item, index) => {
        // Check if this floor segment contains the start point
        const areEqual = item.path.length === initialFloor.path.length && 
        item.path.every((element, index) => element === initialFloor.path[index]);
        return item.floor === initialFloor.floor && 
               areEqual;
      }
    );
    console.log(selectedStartPathFloor);
    
    const selectedEndPathFloor = state?.path.find(
      (item, index) => {
        // Check if this floor segment contains the end point
        const areEqual = item.path.length === finalFloor.path?.length && 
                 item.path.every((element, index) => element === finalFloor.path[index]);
        return item.floor === finalFloor.floor &&
               areEqual;
      }
    );
    console.log(initialFloorPassed);
    
    if (floor === initialFloor.floor && !initialFloorPassed) {
      console.log(selectedStartPathFloor);
      
      setCurrentPath(selectedStartPathFloor.path);
      const arr = selectedStartPathFloor.path
        ?.map((id) => mergedData?.find((item) => item.id === id))
        .filter(Boolean);
      setDetailedPath(arr);
      setStartPoint(initialFloor.startPoint);
      setEndPoint(initialFloor.endPoint);
      changeFloorplanData(initialFloor.floor);
      console.log('passed here');
      
      setInitialFloorPassed(true);
    } else if (floor === intermediateFloor.floor) {
      // setCount(0);
      console.log('intermedia aanu');
      
      setCurrentPath(intermediateFloor.path);
      const arr = intermediateFloor?.path
        ?.map((id) => mergedData?.find((item) => item.id === id))
        .filter(Boolean);
      setDetailedPath(arr);
      setStartPoint(intermediateFloor.startPoint);
      setEndPoint(intermediateFloor.endPoint);
      changeFloorplanData(intermediateFloor.floor);
    } else if (floor === finalFloor.floor && initialFloorPassed) {
      // setCount(0);
      console.log('last aanu');
      
      setCurrentPath(selectedEndPathFloor?.path);
      const arr = selectedEndPathFloor?.path
        ?.map((id) => mergedData?.find((item) => item.id === id))
        .filter(Boolean);
      setDetailedPath(arr);
      setStartPoint(finalFloor.startPoint);
      setEndPoint(finalFloor.endPoint);
      changeFloorplanData(finalFloor.floor);
    }
  }, [floor]);

  useEffect(() => {
    if (!state?.path) return;

    let totalDist = 0;
    let foundCurrentFloor = false;

    state.path.forEach((segment) => {
      if (foundCurrentFloor) {
        // Add all distances in this future floor segment
        for (let i = 0; i < segment.path.length - 1; i++) {
          const node = mergedData.find((n) => n.id === segment.path[i]);
          const nextNodeId = segment.path[i + 1];
          const neighbor = node?.neighbors?.find((nb) => nb.id === nextNodeId);
          if (neighbor) totalDist += neighbor.distance;
        }
      } else if (segment.floor === floor) {
        foundCurrentFloor = true;
        // Add distances from current 'count' index to end of this current floor segment
        for (let i = count; i < segment.path.length - 1; i++) {
          const node = mergedData.find((n) => n.id === segment.path[i]);
          const nextNodeId = segment.path[i + 1];
          const neighbor = node?.neighbors?.find((nb) => nb.id === nextNodeId);
          if (neighbor) totalDist += neighbor.distance;
        }
      }
    });

    setRemainingDistance(totalDist / 0.002198);
  }, [count, floor, state?.path]);
  useEffect(() => {
    function getFloorsBetween(floors, start, end) {
      // Handle case where start is less than end
      if (start <= end) {
        return floors.filter((floor) => floor >= start && floor <= end);
      }
      // Handle case where start is greater than end
      return floors.filter((floor) => floor <= start && floor >= end).reverse();
    }
    if(floor === initialFloor.floor && intermediateFloor.floor !== null){
      const result = getFloorsBetween(
        normalFloors,
        initialFloor.floor,
        intermediateFloor.floor,
      );
      setFloorPath(result);
    }else if(floor === initialFloor.floor && intermediateFloor.floor === null){
      const result = getFloorsBetween(
        normalFloors,
        initialFloor.floor,
        finalFloor.floor,
      );
      setFloorPath(result)
    } else if(floor === intermediateFloor.floor){
      const result = getFloorsBetween(
        normalFloors,
        intermediateFloor.floor,
        finalFloor.floor,
      );
      setFloorPath(result);
    }
   
  }, [floorChanged]);
  useEffect(() => {
    if (
      detailedPath?.length > 0 ||
      detailedPath?.length === newselectedpath?.length + 1
    ) {
      // const keys = Object?.keys(detailedPath[count]?.messages)
      // console.log(keys);
      // for (const key of keys) {
      //   console.log(key, 'hi');
      //   setMessage(detailedPath[count]?.messages[key].message);
      // }
      // setMessage(detailedPath[count]?.messages?.find((item,index)=> item.id === detailedPath[count+1]?.id)?.message);
      let obj = detailedPath.find(
        (item) => item.id === newselectedpath[count - 1],
      );
    }
  }, [count, newselectedpath, detailedPath]);
  // console.log(message)
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

  function handleFloorChange(value) {
    console.log(value, "hi");
    setFloorChanged(true);
    // changeFloorplanData(-1)
  }

  function closeModal() {
    // setFloorChanged(false);
  }

  function switchFloor(currentFloor) {
    console.log(floorPath);
    // if(floorPath.length>1){
      floorCounter.current = floorCounter.current + 1;
    // }
    console.log(floorPath[floorCounter.current]);
    
    passedFloors.push(floorPath[floorCounter.current]);
    console.log(floorCounter.current);
     // Check if we've reached intermediate floor
    if (floorPath[floorCounter.current] === finalFloor?.floor) {
      setCount(0)
      console.log('final');
      setTrigger(true);
      // setCount((prev) => Math.max(prev + 1, 0));
      setFloorChanged(false);
      setPassedFloors([])
      changeFloorplanData(finalFloor?.floor);
    }
    // Check if we've reached final floor
    else if (floorPath[floorCounter.current] === intermediateFloor?.floor) {
      console.log('intermediate');
      setPassedFloors([])
      setTrigger(true);
      setCount((prev) => Math.max(prev + 1, 0));
      setFloorChanged(false);
      // Reset counter and update floor path for next segment
      floorCounter.current = 0;
      const result = getFloorsBetween(
        normalFloors,
        intermediateFloor.floor,
        finalFloor.floor
      );
      setFloorPath(result);
      changeFloorplanData(intermediateFloor.floor);
    } 
    // Handle intermediate floors
    else {

      changeFloorplanData(floorPath[floorCounter.current]);
    }
  }

  function prevSwitchFloor(currentFloor) {
    floorCounter.current = floorCounter.current - 1;
    passedFloors.pop();

    if (floorPath[floorCounter.current] === initialFloor.floor) {
      changeFloorplanData(initialFloor.floor);
      setPrevTrigger(true);
      setCount(initialFloor.path.length - 1);
      setFloorChanged(false);
    } else {
      console.log(floorCounter.current);
      changeFloorplanData(floorPath[floorCounter.current]);
    }
  }
  console.log(passedFloors);
  // useEffect(() => {
  //   if (prevTrigger) {
  //     prevSwitchFloor(floor);
  //   }
  // }, [prevTrigger])
  console.log(startPoint,endPoint);
  console.log(currentPath);
  console.log(currentRotation);
  
  
  
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
    <div className="h-full max-w-3xl floorplan-container">
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
        selectedStartPath={startPoint}
        selectedEndPath={endPoint}
        currentPath={currentPath}
        totalPath={state?.path}
        trigger={trigger}
        prevTrigger={prevTrigger}
        onFloorChange={handleFloorChange}
        stair={state?.stair}
        index={count}
        setIndex={setCount}
        isReached={isReached}
        setIsReached={setIsReached}
        labels={Labels}
        lowLabels={lowLabels}
        zoomToUnit={zoomToUnitAndDetectNearby}
        onPathChange={handleNewPath}
        setCurrentPoint={setCurrentPoint}
        icons={iconData}
        turningPoint={turningPoint}
        passedFloors={passedFloors}
      />
      <TopNavigationSection message={message} currentFloor={floor} />
      {/* <BottomNavigation/> */}
      <div className="fixed bottom-0 flex flex-col items-end w-full h-auto max-w-3xl gap-4">
        <div className="flex flex-col mr-4 divide-y w-fit">
          <button
            onClick={handleNextClick}
            onMouseUp={stopTrigger}
            className="rounded-t-[20px] bg-[#29AB87] py-4 px-3 w-full"
          >
            <ActionIcon className="h-5 w-[35px]" />
          </button>
          <button
            onClick={handlePrevClick}
            onMouseUp={stopTrigger}
            disabled={count <= 0}
            className={`rounded-b-[20px] ${count <= 0 ? "bg-gray-400 opacity-50 cursor-not-allowed" : "bg-[#29AB87]"} py-4 px-3 w-max`}
          >
            <ActionIcon className="h-5 -rotate-180 w-[35px]" />
          </button>
        </div>
        <div className="flex items-center justify-between w-full gap-3 px-3 py-2 bg-white drop-shadow-md">
          <div>
            <h4 className="text-[#E97E00] font-semibold text-[20px]">
              {endPoint?.name}
            </h4>
            <p className="text-[#00000099] font-semibold">
              {Math.max(0, Math.floor(remainingDistance / 82))} minutes{" "}
              <span className="font-medium">
                ({Math.max(0, Math.round(remainingDistance))} mtr)
              </span>
            </p>
            <p className="flex items-center text-xs text-[#00000066]">
              In every turning press the
              <span className="flex flex-col mx-3 rotate-90 divide-y w-fit">
                <div className="rounded-t-lg bg-[#29AB87] py-1 px-1">
                  <ActionIcon className="w-2 h-2" />
                </div>
                <div className="rounded-b-lg bg-[#29AB87] py-1 px-1">
                  <ActionIcon className="w-2 h-2 -rotate-180" />
                </div>
              </span>
              button
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#EAF7F3] font-black text-xl flex justify-center items-center rounded-full w-12 h-12 text-[#29AB87]">
              {/* <FaWalking className="text-[#29AB87] w-6 h-6" /> */}
              {floor}
            </div>
            <Link to="/home">
              <div className="p-2 border border-[#0000001A] flex justify-center items-center rounded-full w-fit">
                <IoCloseOutline className="w-8 h-8" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <FloorSwitcher
        bottomSpace="bottom-[20vh]"
        activeIndex={activeIndex}
        floorFunction={(floor) => changeFloorplanData(floor)}
      />
      {/* <Dialog
          open={floorChanged}
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={closeModal}
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4">
            
            </div>
          </div>
        </Dialog> */}

      <Transition appear show={floorChanged} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  transition
                  className="w-full max-w-md p-6 px-4 overflow-hidden text-center align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                >
                  <DialogTitle
                    as="h3"
                    className="flex justify-center text-[#E97E00] font-bold items-center w-full gap-2 text-lg leading-6 text-center "
                  >
                    Your Destination in {finalFloor.floor} Floor
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Take Stairs/Lift and move to destination floor
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <button
                      type="button"
                      className="inline-flex text-[#c4c4c4] items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold  hover:bg-[#bde2d8] hover:text-[#29AB87]  border-[#c4c4c4] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => prevSwitchFloor(floor)}
                    >
                      <RxTriangleLeft className="w-6 h-6" />
                      Prev
                    </button>
                    <div className="flex gap-2">
                      {floorPath.map((item, index) => {
                        return (
                          <button
                            className={`text-[clamp(0.2rem,5vw,1rem)] flex rounded-full p-2 px-4 ${
                              passedFloors.includes(item) ? "bg-[#29AB87] text-white " : ""
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      className="inline-flex justify-center items-center rounded-md border border-transparent bg-[#29AB87] px-4 py-2 text-sm font-semibold text-[#d9e4e1] hover:bg-[#bde2d8] hover:text-[#29AB87] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => switchFloor(floor)}
                    >
                      Next
                      <RxTriangleRight className="w-6 h-6" />
                    </button>
                  </div>
                </DialogPanel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
    </ErrorBoundary>
  );
};

export default NavigationPage;
