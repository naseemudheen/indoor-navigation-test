import React, { useEffect, useState, useRef } from "react";
import { DestinationSection } from "../container/Destination";
import StartingSection from "../container/Destination/StartingSection";
import { useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "../assets/loader.json";
import simpleFloor from "../assets/floors/simple.svg";
// import groundfloor from "../assets/floors/ground-floor.svg";
// import basementfloor from "../assets/floors/underground-floor.svg";
// import firstfloor from "../assets/floors/first-floor.svg";
// import secondfloor from "../assets/floors/second-floor.svg";
// import CMFirstFloor from "../assets/floors/cw-floor-1.svg";
// import CMSecondFloor from "../assets/floors/cw-floor-2.svg";
// import CMThirdFloor from "../assets/floors/cw-floor-3.svg";
const groundfloor = simpleFloor;
const basementfloor = simpleFloor;
const firstfloor = simpleFloor;
const secondfloor = simpleFloor;
const CMFirstFloor = simpleFloor;
const CMSecondFloor = simpleFloor;
const CMThirdFloor = simpleFloor;
import { scaleLinear, zoomIdentity, zoom, easeCircleInOut } from "d3";
import { MdLocationPin, MdNorthWest } from "react-icons/md";
import dijkstrajs from "dijkstrajs";
// import { CollegePath,basementData,groundData } from "../data";
const basementData = [];
import groundData from "../data/maps/groundfloor_data.json";
const firstData = [];
const secondData = [];
const cancerFirst = [];
const cancerSecond = [];
const cancerThird = [];
// import basementData from '../basement.json'
// import Labels from "../label.json";
const Labels = [];
import { useDispatch, useSelector } from "react-redux";
import {
  setFinalPath,
  setFloor,
  setInitialPath,
  setIntermediatePath,
  setSessionId,
} from "../redux/mapSlice";
import { getNaturalImageDimensions } from "../utils/helper";
import { getRealPointCoordinateRelativeToDigitisationZone } from "../utils";
// import {
//   newGround,
//   undergroundLabels,
//   firstLabels,
//   secondLabels,
//   cancerOneLabels,
//   cancerTwoLabels,
//   cancerThreeLabels,
// } from "../low-level-labels";
const newGround = [];
const undergroundLabels = [];
const firstLabels = [];
const secondLabels = [];
const cancerOneLabels = [];
const cancerTwoLabels = [];
const cancerThreeLabels = [];
import DirectionFloor from "../components/DirectionFloor";
const unified_groundData = [];
import { parseUnifiedFloorData } from "../utils/mapAdapter";

import { floors, mergedData } from "../constants/floors";
import { pathSeparator } from "../utils/helper/pathSeparator";
import { calculateDistance } from "../utils/helper/calculateDistance";
import FloorSwitcher from "../components/FloorSwitcher";
import { findPath } from "../utils/helper/findPath";
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
import { CollegePath } from "../data";
import { Helmet } from "react-helmet-async";

const SVG_ICON_MAP = {
  "doors": door,
  "stairs": stairIcon,
  "lift": LiftIcon,
  "doctor": DoctorIcon,
  "nurse": NurseIcon,
  "toilet": ToiletIcon,
  "icu": IcuIcon,
  "pharmacy": PharmacyIcon,
  "dinearea": DineIcon,
  "food": CanteenIcon,
  "security": SecurityIcon,
  "ramp": RampIcon,
  "ward": wardIcon,
  "blood": BloodIcon,
  "ot": OperationIcon,
  "professor": ProfessorIcon,
  "canteent": CanteenIcon,
  "dine": DineIcon,
  "lab": LabIcon,
  "enquiry": IcuIcon,
  "door": door,
  "stair": stairIcon,
  "dineArea": DineIcon,
  "counter": IcuIcon, // Use a generic icon if counter is not defined
  "entry": IcuIcon
};


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


const DirectionPage = () => {
  const dispatch = useDispatch();
  const floor = useSelector((state) => state.map.floor);
  const initialFloor = useSelector((state) => state.map.initialPath);
  console.log(initialFloor);
  console.log(floor);
  const [activeIndex, setActiveIndex] = useState(0);
  const [startSearch, setStartSearch] = useState("");
  const [endsearch, setEndSearch] = useState("");
  const [lowLabels, setLowLabels] = useState();
  const [highLabels, setHighLabels] = useState(Labels);
  const [startfilteredData, setStartFilteredData] = useState([]);
  const [endfilteredData, setEndFilteredData] = useState([]);
  const [showrecent, setShowRecent] = useState(false);
  const [activeField, setActiveField] = useState("destination");
  const destinationInputRef = useRef(null);
  const [isGettingInitialState, setIsGettingInitalState] = React.useState(true);
  const [pointSwapped, setPointSwapped] = useState(false);
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
  const finalFloor = useSelector((state) => state.map.finalPath);
  const [unitsData, setUnitsData] = React.useState([]);
  const [selectedUnits, setSelectedUnits] = React.useState([]);
  const [focusViews, setFocusViews] = React.useState([]);
  const [selectedFocusView, setSelectedFocusView] = React.useState(null);
  const [pathData, setPathData] = React.useState(mergedData);
  const [isCreatingPath, setIsCreatingPath] = React.useState(false);
  const [selectedStartPath, setSelectedStartPath] = React.useState();
  const [selectedOtherStartPath, setSelectedOtherStartPath] = useState();
  const [selectedEndPath, setSelectedEndPath] = React.useState();
  const [selectedPath, setSelectedPath] = React.useState([]);
  const [selectedStair, setSelectedStair] = useState();
  const [totalSelectedPath, setTotalSelectedPath] = useState([]);
  const [distance, setDistance] = useState();
  const [errMessage, setErrorMessage] = useState(false);
  const svgElementRef = React.useRef(null);
  const [iconData, setIconData] = useState([]);
  let { state } = useLocation();
  const svgZoomRef = React.useRef(
    zoom().on("zoom", (event) => {
      console.log(event);
    }),
  );
  const handleSearchChange = (query) => {
    console.log(selectedStartPath);
    // if (!selectedStartPath) {
    setStartSearch(query);
    // setSelectedStartPath(null)
    const filtered = mergedData.filter((item) =>
      item.name?.toLowerCase().includes(query.toLowerCase()),
    );
    setStartFilteredData(filtered);
    // }
  };
  const handleEndSearchChange = (query) => {
    // if (!selectedEndPath) {
    setEndSearch(query);
    // setSelectedEndPath(null)
    const filtered = mergedData.filter((item) =>
      item.name?.toLowerCase().includes(query.toLowerCase()),
    );
    setEndFilteredData(filtered);
    // }
  };

  const handleStartSearchEnter = (e) => {
    if (e.key === "Enter" && startfilteredData.length > 0) {
      const topResult = startfilteredData[0];
      if (topResult?.floor !== floor) {
        getFloorplanImage(topResult.floor);
        changeFloorplanData(topResult?.floor);
      }
      zoomToUnitAndDetectNearby(topResult?.id);
      setSelectedStartPath(topResult);
      setStartFilteredData([]);
      setShowRecent(false);
      setActiveField("destination");
      destinationInputRef.current?.focus();
    }
  };

  const handleEndSearchEnter = (e) => {
    if (e.key === "Enter" && endfilteredData.length > 0) {
      const topResult = endfilteredData[0];
      setSelectedEndPath(topResult);
      changeFloorplanData(topResult?.floor);
      setEndFilteredData([]);
      setShowRecent(false);
      // Close search view logic would go here if applicable
    }
  };


  const floorImages = [
    {
      type: -1,
      path: basementfloor,
    },
    {
      type: 0,
      path: groundfloor,
    },
    {
      type: 1,
      path: firstfloor,
    },
    {
      type: 2,
      path: secondfloor,
    },
    {
      type: "C1",
      path: cancerFirst,
    },
    {
      type: "C2",
      path: cancerSecond,
    },
    {
      type: "C3",
      path: cancerThird,
    },
  ];

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
          setHighLabels([]);
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
          setHighLabels(Labels);
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
          setHighLabels(Labels);
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
          setHighLabels(Labels);
          setUnitsData(C1Doors);
        } else if (floor === "C2") {
          setPathData(cancerSecond);
          setUnitsData(C3Doors);
          setIconData([
            { type: "pharmacy", data: C1Pharmacy, icon: PharmacyIcon },
          ]);
          setLowLabels(cancerTwoLabels);
          setHighLabels(Labels);
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
          setHighLabels(Labels);
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
          setHighLabels(Labels);
        }
        setIsGettingInitalState(false);
      })
      .catch((err) => console.log(err));
  }
  function changeFloorplanData(type) {
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
      setHighLabels(Labels);
    } else if (type === 0) {
      setPathData(groundData);
      setUnitsData([]);
      setIconData([]);
      setLowLabels([]);
      setHighLabels([]);
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
      setHighLabels(Labels);
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
      setHighLabels(Labels);
      setUnitsData(C1Doors);
      handleClick(3);
    } else if (type == "C2") {
      setPathData(cancerSecond);
      setUnitsData(C3Doors);
      setIconData([{ type: "pharmacy", data: C1Pharmacy, icon: PharmacyIcon }]);
      setLowLabels(cancerTwoLabels);
      setHighLabels(Labels);
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
      setHighLabels(Labels);
      handleClick(5);
    } else if(type == 2) {
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
      setHighLabels(Labels);
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

      // if (distanceFromCenter <= sizeScale(selectedNearbyDistance)) {
      //   newSelectedUnits = [...newSelectedUnits, item.id];

      //   svgElementRef.current
      //     .selectAll(".floorplan-svg-group")
      //     .append("line")
      //     .attr("class", "line-nearby-radius")
      //     .attr("x1", centerCoordinates[0])
      //     .attr("y1", centerCoordinates[1])
      //     .attr("x2", currentUnitCoordinates[0])
      //     .attr("y2", currentUnitCoordinates[1])
      //     .attr("style", "stroke:rgb(255,0,0);stroke-width:1");
      // }
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

  const findPath2 = (start, end, path) => {
    const simplifiedPathData = {};
    path?.forEach((item) => {
      simplifiedPathData[item.id] = {};
      item.neighbors.forEach((item1) => {
        simplifiedPathData[item.id][item1.id] = { distance: item1.distance };
      });
    });
    const result = dijkstrajs.find_path(simplifiedPathData, start?.id, end?.id);
    return result;
  };
  useEffect(() => {
    setupInitialData();
  }, [floor]);

  useEffect(() => {
    if (state) {
      setSelectedEndPath(state.endPoint);
    }
  }, [state]);
  const flooringData = cancerThird.map((item) => ({
    ...item,
    floor: "C3",
  }));
  // console.log(flooringData.map(item => ({
  //   ...item,
  //   id: `path-${parseInt(item.id.split('-')[1]) + 734}`,
  //   neighbors: item.neighbors.map(neighbor => ({
  //     ...neighbor,
  //     id: `path-${parseInt(neighbor.id.split('-')[1]) + 734}`,
  //   })),
  // })), 'testing2');
  
  const handleSendCoordinates = async()=>{
    try {
      const data ={
        device_id:navigator.userAgent,
        start_location:{
          name:selectedStartPath.name,
          floor:selectedStartPath.floor
        },
        end_location:{
          name:selectedEndPath.name,
          floor:selectedEndPath.floor
        }
      }

      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/navigation/guest-session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const response = await res.json();

      dispatch(setSessionId(response?.session_id));
      return response;
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(() => {
    if (selectedStartPath && selectedEndPath) {
      // if (totalSelectedPath.length === 0 || pointSwapped) {
      // setTotalSelectedPath([]);
      // merged path data
      handleSendCoordinates();
      
      const result2 = findPath2(selectedStartPath, selectedEndPath, mergedData);
      console.log(result2);

      // separate path based on floors
      const pathWithFloors = pathSeparator(floors, result2);
      console.log(pathWithFloors);

      // Extract start and end points for each floor
      const floorPaths = pathWithFloors.map(({ floor, path }) => ({
        floor,
        fullPath: path,
        start: mergedData.find((item) => item.id === path[0]), // First element
        end: mergedData.find((item) => item.id === path[path.length - 1]), // Last element
      }));

      //each floor separated paths
      const startFloorData = pathWithFloors?.find(
        (item) => item.floor == selectedStartPath.floor,
      );
      const endFloorData = pathWithFloors?.find(
        (item) => item.floor == selectedEndPath.floor,
      );

      // each floor starting and ending point
      const selectedStartPathFloor_End = mergedData?.find(
        (item) =>
          item.id == startFloorData?.path[startFloorData.path.length - 1],
      );
      const selectedEndPathFloor_Start = mergedData?.find(
        (item) => item.id == endFloorData?.path[0],
      );

      // calculate total distance
      const totalDistance = calculateDistance(result2);

      setDistance(totalDistance / 0.002198);
      setSelectedPath(
        pathWithFloors.find((item) => item.floor === selectedStartPath.floor)
          .path,
      );
      setTotalSelectedPath(pathWithFloors);
      console.log(selectedStartPath);

      if (floorPaths.length === 3) {
        //multi floor navigation
        console.log(floorPaths[0]); 
        console.log(floorPaths[1]);
        console.log(floorPaths[2]);
        

        dispatch(
          setInitialPath({
            path: floorPaths[0].fullPath,
            floor: floorPaths[0].floor,
            startPoint: floorPaths[0].start,
            endPoint: floorPaths[0].end,
          }),
        );

        dispatch(
          setIntermediatePath({
            path: floorPaths[1].fullPath,
            floor: floorPaths[1].floor,
            startPoint: floorPaths[1].start,
            endPoint: floorPaths[1].end,
          }),
        );

        dispatch(
          setFinalPath({
            path: floorPaths[2].fullPath,
            floor: floorPaths[2].floor,
            startPoint: floorPaths[2].start,
            endPoint: floorPaths[2].end,
          }),
        );
      } else if (floorPaths.length == 2) {
        dispatch(
          setInitialPath({
            path: startFloorData.path,
            floor: selectedStartPath.floor,
            startPoint: selectedStartPath,
            endPoint: selectedStartPathFloor_End,
          }),
        );

        dispatch(
          setFinalPath({
            path: endFloorData?.path,
            floor: selectedEndPath.floor,
            startPoint: selectedEndPathFloor_Start,
            endPoint: selectedEndPath,
          }),
        );
      } else {
        //single floor navigation
        dispatch(
          setInitialPath({
            path: pathWithFloors.find(
              (item) => item.floor == selectedStartPath.floor,
            ).path,
            floor: selectedStartPath.floor,
            startPoint: selectedStartPath,
            endPoint: selectedEndPath,
          }),
        );
      }
      // }
    }
    // if (selectedEndPath?.floor !== selectedStartPath?.floor) {
    //   if (floor === selectedStartPath?.floor) {
    //     console.log(initialFloor);

    //     console.log("worked");
    //     console.log(totalSelectedPath);
    //     setSelectedPath(initialFloor?.path);
    //   } else if (floor === selectedEndPath?.floor) {
    //     console.log("worked");
    //     setSelectedPath(totalSelectedPath[1]);
    //   }
    // }
  }, [
    selectedStartPath,
    selectedEndPath,
    // totalSelectedPath,
    floor,
  ]);

  useEffect(() => {
    if (selectedStartPath && selectedStartPath.floor === floor) {
      zoomToUnitAndDetectNearby(selectedStartPath?.id);
    }
    if (selectedEndPath && selectedEndPath.floor === floor) {
      zoomToUnitAndDetectNearby(selectedEndPath?.id);
    }
  }, [selectedStartPath, selectedEndPath]);

  // useEffect(() => {
  //   if (selectedEndPath?.floor !== selectedStartPath?.floor) {

  //     if (floor === selectedStartPath?.floor) {
  //       console.log(initialFloor.path);
  //       // setSelectedPath(totalSelectedPath[0]);
  //       setSelectedPath(initialFloor?.path);
  //     } else if (floor === selectedEndPath?.floor) {
  //       setSelectedPath(totalSelectedPath[1]);x
  //     }
  //   }
  // }, [floor, totalSelectedPath, selectedPath, selectedEndPath]);
  console.log(totalSelectedPath);
  // useEffect(() => {

  //     changeFloorplanData(floor);

  // }, []);
  useEffect(() => {
    //change path based on floor
    if (selectedEndPath && selectedStartPath) {
      const selectedStartPathFloor = totalSelectedPath.find(
        (item) => item.floor === selectedStartPath.floor,
      );
      const selectedEndPathFloor = totalSelectedPath.find(
        (item) => item.floor === selectedEndPath.floor,
      );
      // changeFloorplanData(selectedStartPathFloor?.floor)
      if (floor === initialFloor.floor) {
        setSelectedPath(selectedStartPathFloor?.path);
      } else if (floor === finalFloor.floor && selectedEndPathFloor?.path) {
        setSelectedPath(selectedEndPathFloor?.path);
      }
    }
  }, [floor, totalSelectedPath, selectedPath]);
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
  console.log(totalSelectedPath);
  
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
  const handleFloorChange = (floor) => {
    changeFloorplanData(floor);
  };

  return (
    <div className=" w-full h-[100dvh] relative">
      <Helmet>
      <title>Directions</title>
      <meta 
        name="description" 
        content="Find your way inside Government Medical College with Paadha's indoor navigation system. Get turn-by-turn directions between departments, wards, and facilities across multiple floors." 
      />
      <link rel="canonical" href="https://paadha.com/directions" />
      </Helmet>
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
          labels={highLabels}
          lowLabels={lowLabels}
          errMessage={errMessage}
          distance={distance}
          setErrMsg={setErrorMessage}
          icons={iconData}
        />
      </div>
      <DestinationSection
        searchStartQuery={startSearch}
        searchEndQuery={endsearch}
        startPoint={selectedStartPath}
        endPoint={selectedEndPath}
        setStartPoint={setSelectedStartPath}
        setEndPoint={setSelectedEndPath}
        onClose={handleRecentClose}
        onEndSearchChange={handleEndSearchChange}
        onSearchChange={handleSearchChange}
        setPointSwapped={setPointSwapped}
        onStartSearchEnter={handleStartSearchEnter}
        onEndSearchEnter={handleEndSearchEnter}
        activeField={activeField}
        onFocusOrigin={() => setActiveField("origin")}
        onFocusDestination={() => setActiveField("destination")}
        destinationRef={destinationInputRef}
      />


      <div className="w-full z-30 h-fit top-[11rem] bg-white absolute px-4 py-3">
        {(activeField === "origin"
          ? startfilteredData.length !== 0
          : endfilteredData.length !== 0) && (
          <h2 className="mt-5 mb-3 font-bold">
            {activeField === "origin"
              ? "Select Starting Point"
              : "Select Destination"}
          </h2>
        )}
        <div className={`space-y-4 animate-slide-in`} key={activeField}>
          {activeField === "origin" &&
            startfilteredData?.map((item, index) => (
              <div
                className="flex items-center w-full gap-6"
                key={index}
                onClick={() => {
                  if (item?.floor !== floor) {
                    console.log("floor switched", item.floor);
                    getFloorplanImage(item.floor);
                    changeFloorplanData(item?.floor);
                  }
                  zoomToUnitAndDetectNearby(item?.id);
                  setSelectedStartPath(item);
                  setStartFilteredData([]);
                  setShowRecent(false);
                  setActiveField("destination");
                  destinationInputRef.current?.focus();
                }}
              >
                <div className="p-2 rounded-full bg-[#D9D9D9B2] flex justify-center items-center">
                  <MdLocationPin />
                </div>
                <div className="flex flex-col border-b-[0.5px] border-[#0000004D] w-full py-2 font-semibold relative">
                  <h3 className="text-[#000000B2]">{item.name}</h3>
                  <p className="text-[#00000080] text-xs">
                    {(item.floor === 0 && "Ground") ||
                      (item.floor === -1 && "UnderGround") ||
                      (item.floor === 1 && "1st") ||
                      (item.floor === 2 && "2nd") ||
                      (item.floor == "C1" && "Cancer First ") ||
                      (item.floor == "C2" && "Cancer Second ") ||
                      (item.floor == "C3" && "Cancer Third ")}
                    Floor
                  </p>
                  <MdNorthWest className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            ))}
          {activeField === "destination" &&
            endfilteredData !== 0 &&
            endfilteredData?.map((item, index) => (
              <div
                className="flex items-center w-full gap-6"
                key={index}
                onClick={() => {
                  setSelectedEndPath(item);
                  changeFloorplanData(item?.floor);
                  setEndFilteredData([]);
                  setShowRecent(false);
                }}
              >
                <div className="p-2 rounded-full bg-[#D9D9D9B2] flex justify-center items-center">
                  <MdLocationPin />
                </div>
                <div className="flex flex-col border-b-[0.5px] border-[#0000004D] w-full py-2 font-semibold relative">
                  <h3 className="text-[#000000B2]">{item.name}</h3>
                  <p className="text-[#00000080] text-xs">
                    {(item.floor === 0 && "Ground") ||
                      (item.floor === -1 && "UnderGround") ||
                      (item.floor === 1 && "1st") ||
                      (item.floor === 2 && "2nd") ||
                      (item.floor == "C1" && "Cancer First ") ||
                      (item.floor == "C2" && "Cancer Second ") ||
                      (item.floor == "C3" && "Cancer Third ")}
                    Floor
                  </p>
                  <MdNorthWest className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            ))}
        </div>
      </div>
      <FloorSwitcher
        activeIndex={activeIndex}
        floorFunction={handleFloorChange}
        bottomSpace={"bottom-[22vh]"}
      />
      {selectedEndPath && selectedStartPath && (
        <StartingSection
          startPoint={selectedStartPath}
          endPoint={selectedEndPath}
          finalpath={totalSelectedPath}
          stair={selectedStair ? selectedStair : null}
          otherStart={selectedOtherStartPath ? selectedOtherStartPath : null}
          distance={distance}
        />
      )}
    </div>
  );
};

export default DirectionPage;
