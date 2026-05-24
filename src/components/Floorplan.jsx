import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState, useEffect, useMemo, memo, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  select,
  scaleLinear,
  zoom,
  zoomIdentity,
  easeQuadInOut,
  easeLinear,
  path,
  line,
  interpolate,
} from "d3";
import {
  renderTimerTop,
  renderTimerBottom,
  renderTimerLeft,
  renderTimerRight,
} from "./timerRenderer";
import { getRealPointCoordinateRelativeToDigitisationZone } from "../utils";
import { Link } from "react-router-dom";
import { Location } from "./Icons";
import { useSelector } from "react-redux";
import { resetInitialPath, setFloor } from "../redux/mapSlice";
import starIcon from "../assets/icons/start-point.svg";
import endIcon from "../assets/icons/end-point.svg";
import Rate from "./rate";
import { FaSpinner } from "react-icons/fa";
// import {
//   renderTimerTop,
//   renderTimerBottom,
//   renderTimerLeft,
//   renderTimerRight
// } from "./timerRenderer";

function getAngle(c, l) {
  let delta_x = l.x - c.x;
  let delta_y = l.y - c.y;
  let a = Math.atan2(delta_y, delta_x);
  return a; //in radians;
}

function polygonWithRoundedCorners(points, r) {
  //move to the first point
  let d = `M${points[0][0]},${points[0][1]}`;

  for (let i = 1; i < points?.length - 1; i++) {
    let previous = i - 1;
    let next = i + 1;
    let c = {}; //the control point
    c.x = points[i][0];
    c.y = points[i][1];
    let l1 = {};
    l1.x = points[previous][0];
    l1.y = points[previous][1];
    let l2 = {};
    l2.x = points[next][0];
    l2.y = points[next][1];
    let a1 = getAngle(c, l1);
    let a2 = getAngle(c, l2);

    //if great precision is needed remove .toFixed(3)
    //x1 and y1 are defining the start point of the Bézier
    let x1 = (c.x + r * Math.cos(a1))?.toFixed(3);
    let y1 = (c.y + r * Math.sin(a1))?.toFixed(3);
    //x2 and y2 are defining the end point of the Bézier
    let x2 = (c.x + r * Math.cos(a2))?.toFixed(3);
    let y2 = (c.y + r * Math.sin(a2))?.toFixed(3);
    //build the d attribute
    d += "L" + x1 + "," + y1 + " Q" + c.x + "," + c.y + " " + x2 + "," + y2;
  }
  //move to the last point and return the d attribute
  return (d += `L${points[points.length - 1][0]},${
    points[points.length - 1][1]
  }`);
}

export default function Floorplan({
  isGettingInitialState,
  svgElementRef,
  svgZoomRef,
  floorplan,
  digitisationZone,
  currentRotation,
  unitsData,
  focusViews,
  resetSelectedFocusView,
  resetSelectedUnits,
  selectedUnits,
  pathData,
  selectedStartPath,
  selectedEndPath,
  zoomToUnit,
  onFloorChange,
  passedFloors,
  currentPath,
  stair,
  labels,
  lowLabels,
  trigger,
  prevTrigger,
  totalPath,
  index,
  setIndex,
  onPathChange,
  icons,
  setCurrentPoint,
  turningPoint,
  isReached,
  setIsReached,
}) {
  const dispatch = useDispatch();
  const completedPath = useRef([]);
  const [trans, setTrans] = useState(null);
  const initialFloor = useSelector((state) => state.map.initialPath);
  const intermediateFloor = useSelector((state) => state.map.intermediatePath);
  const finalFloor = useSelector((state) => state.map.finalPath);
  const floor = useSelector((state) => state.map.floor);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [selectPath, setSelectPath] = useState([]);
  const [selectedPath, setSelectedPath] = useState(currentPath);
  const [newselectedpath, setNewSelectedPath] = useState([]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [defaultZoomApplied, setDefaultZoomApplied] = useState(false);
  const [isFloorReached, setIsFloorReached] = useState(false);
  const [slice, setSlice] = useState([]);
  const [selectedFocusView, setSelectedFocusView] = useState(null);
  const [selectedNearbyDistance, setSelectedNearbyDistance] = useState(10);
  const [rateSubmitted, setRateSubmitted] = useState(false);
  const [rateValue, setRateValue] = useState(0);
  const [rateLoading, setRateLoading] = useState(false);
  const sessionId = useSelector((state) => state.map.session_id);

  // Phase 4: Calculate the rotation origin based on the current waypoint.
  // By rotating the map around the user's current location, we ensure that
  // the user stays stationary in parent space during the rotation, which
  // eliminates the "swinging arc" effect that causes the camera bounce.
  const rotationOrigin = useMemo(() => {
    if (currentPath && currentPath[index]) {
      const currentUnitId = currentPath[index];
      const currentUnitData = pathData?.find((item) => item.id === currentUnitId);
      if (currentUnitData) {
        return getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          0,
          currentUnitData.coordinates[0],
          currentUnitData.coordinates[1],
        );
      }
    }
    // Fallback to the digitisation origin if no waypoint is selected
    return [digitisationZone.origin[0], digitisationZone.origin[1]];
  }, [currentPath, index, pathData, digitisationZone]);
  React.useEffect(() => {
    const lineData = pathData
      .map((item) => {
        return item.neighbors
          ?.map((item1) => {
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

    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
    const D3SVG = select("#layer-icons"); // Moved end-icons directly to the icons layer

    const pathPoints2 = D3SVG.selectAll(".path-point2")
      .data(pathData)
      .join("g")
      .attr("class", "path-point2 relative z-20");

    pathPoints2.selectAll("image")
      .data(d => [d])
      .join("image")
      .attr("xlink:href", (value) => {
        if (selectedEndPath?.floor === selectedStartPath?.floor) {
          // if (selectedStartPath?.id === value.id) {
          //   // return starIcon;
          // }
          if (selectedEndPath?.id === value.id) {
            return endIcon;
          }
        } else {
          // if (selectedStartPath?.id === value.id) {
          //   // return starIcon;
          // }
          if (selectedEndPath?.id === value.id) {
            return endIcon;
          }
          if (stair?.id === value?.id) {
            return "blue";
          }
        }
      })
      .attr("width", 70)
      .attr("height", 90)
      .attr("x", -35) // Center horizontally (width/2)
      .attr("y", -90); // Anchor at the bottom (full height)

    pathPoints2
      .transition()
      .duration(500)
      .ease(easeQuadInOut)
      .attr("transform", (value) => {
        const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          0, // Map is un-rotated internally, React CSS handles the spin
          value.coordinates[0],
          value.coordinates[1],
        );
        // Counter-rotate the icon so it stays upright against the CSS map rotation
        return `translate(${coordinates[0]}, ${coordinates[1]}) rotate(${currentRotation})`;
      });

    pathPoints2.raise();
  }, [
    isGettingInitialState,
    floorplan,
    digitisationZone,
    currentRotation,
    pathData,
    selectedStartPath,
    selectedEndPath,
    stair,
  ]);

  useEffect(() => {
    const D3SVG = select("#layer-pointer");

    // Remove the old static path-point approach since it causes jumps
    D3SVG.selectAll(".path-point").remove();

    // Find the coordinate for the CURRENT point
    if (currentPath && currentPath[index]) {
      const currentUnitId = currentPath[index];
      const currentUnitData = pathData.find((item) => item.id === currentUnitId);

      if (currentUnitData) {
        // Map is un-rotated internally (rotation is 0), React CSS handles the map's overall spin.
        const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          0,
          currentUnitData.coordinates[0],
          currentUnitData.coordinates[1]
        );

        const pointerLayer = select("#layer-pointer");

        // Render a single pointer and transition its position
        pointerLayer.selectAll(".current-user-pointer")
          .data([{ x: coordinates[0], y: coordinates[1] }])
          .join("image")
          .attr("class", "current-user-pointer relative z-30")
          .attr("xlink:href", starIcon)
          .attr("width", 40)
          .attr("height", 40)
          .attr("x", -20) // Center horizontally
          .attr("y", -20) // Center vertically
          .transition() // Add smooth animation for the pointer
          .duration(500)
          .ease(easeQuadInOut)
          .attr("transform", (d) => `translate(${d.x}, ${d.y}) rotate(${currentRotation})`);
      }
    }
  }, [isGettingInitialState, index, currentRotation, pathData, currentPath]);

  // React.useEffect(() => {
  //   const lineData = pathData
  //     .map((item) => {
  //       return item.neighbors
  //         ?.map((item1) => {
  //           if (item1.isParent) return null;
  //           return [
  //             item.coordinates[0],
  //             item.coordinates[1],
  //             item1.coordinates[0],
  //             item1.coordinates[1],
  //           ];
  //         })
  //         .filter((item1) => item1 !== null);
  //     })
  //     .flat();

  //   const sizeScale = scaleLinear()
  //     .domain([0, 100])
  //     .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
  //   const D3SVG = select(".floorplan-svg-group");

  //   D3SVG.selectAll(".path-point")
  //   .data(pathData)
  //   .join("g")
  //   .attr("class", "path-point relative z-20")
  //   .append("path")
  //   .attr(
  //     "d",
  //     "M25 1C16.1797 1 9 8.17969 9 17C9 31.1133 23.6289 47.9453 24.25 48.6563C24.4414 48.875 24.7109 49 25 49C25.3086 48.9805 25.5586 48.875 25.75 48.6563C26.3711 47.9336 41 30.8125 41 17C41 8.17969 33.8203 1 25 1L25 1ZM25 12C28.3125 12 31 14.6875 31 18C31 21.3125 28.3125 24 25 24C21.6875 24 19 21.3125 19 18C19 14.6875 21.6875 12 25 12L25 12Z"
  //   )
  //   .attr("fill", (value) => {
  //     if (selectedEndPath?.floor === selectedStartPath?.floor) {
  //       if (selectedStartPath?.id === value.id) {
  //         return "green";
  //       }
  //       if (selectedEndPath?.id === value.id) {
  //         return "red";
  //       }
  //     } else {
  //       if (selectedStartPath?.id === value.id) {
  //         return "green";
  //       }
  //       if (selectedEndPath?.id === value.id) {
  //         return "red";
  //       }
  //       if (stair?.id === value?.id) {
  //         return "blue";
  //       }
  //     }

  //     return "transparent";
  //   })
  //   .attr("transform", (value) => {
  //     const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
  //       digitisationZone,
  //       currentRotation,
  //       value.coordinates[0],
  //       value.coordinates[1]
  //     );
  //     const scaleX = 1.5; // Scale factor for the x-axis
  //     const scaleY = 1.5;
  //     const pathElement = D3SVG.select(".path-point path");
  //     const bbox = pathElement.node().getBBox();
  //     const centerX = bbox.x + bbox.width;
  //     const centerY = bbox.y + bbox.height;
  //     return `translate(${coordinates[0] - centerX}, ${
  //       coordinates[1] - centerY
  //     }) scale(${scaleX}, ${scaleY})`; // Correctly format the transform attribute
  //   })
  //   .raise();

  // }, [
  //   isGettingInitialState,
  //   floorplan,
  //   digitisationZone,
  //   currentRotation,
  //   pathData,
  //   selectedStartPath,
  //   currentPath,
  //   index,
  //   newselectedpath,
  //   selectedEndPath,
  //   stair,
  // ]);

  const nextBtn = async (direction) => {
    if (direction === "add") {
      setCurrentIndex(index);
      await updateLine(index);
    }
    if (
      currentPath.length - 1 === newselectedpath?.length &&
      floor !== finalFloor.floor &&
      finalFloor.floor !== null
    ) {
      console.log("floor reched end");
      passedFloors.push(floor);
      await onFloorChange(true);
      await setIsFloorReached(true);
    }
    console.log(currentPath.length, newselectedpath?.length);

    if (currentPath.length === newselectedpath?.length) {
      setCurrentIndex(0);
      setIndex(0);
      await setNewSelectedPath([]);
      console.log("ujghsdkfj");

      let areEqual = false;
      if (finalFloor.path !== null) {
        areEqual =
          currentPath.length === finalFloor.path.length &&
          currentPath.every(
            (element, index) => element === finalFloor.path[index],
          );
      }
      if (
        intermediateFloor.floor !== null &&
        floor === intermediateFloor.floor
      ) {
        console.log("hi");
        // We're at the intermediate floor
        dispatch(setFloor(finalFloor.floor));
        // onFloorChange(true);
        setIsFloorReached(true);
      } else if (
        finalFloor.floor !== null &&
        floor === finalFloor.floor &&
        areEqual
      ) {
        console.log("hi");

        // We're at the final floor
        setIsReached(true);
        console.log("Destination reached");
      } else if (intermediateFloor.floor !== null) {
        console.log("hi");

        // We're moving to the intermediate floor
        dispatch(setFloor(intermediateFloor.floor));
        // onFloorChange(true);
        setIsFloorReached(true);
        console.log("Moving to intermediate floor");
      } else if (
        intermediateFloor.floor === null &&
        finalFloor.floor !== null
      ) {
        console.log("hi");

        // We're moving to the final floor
        dispatch(setFloor(finalFloor.floor));
        // onFloorChange(true);
        setIsFloorReached(true);
        console.log("Moving to final floor");
      } else {
        console.log("hi");

        // No intermediate floor, we've reached the destination
        console.log("Destination reached");
        setIsReached(true);
      }
    }
  };

  // const prevButton = async() => {
  //     console.log(index);

  //     if (index === 0 && initialFloor.floor !== floor) {
  //       dispatch(setFloor(initialFloor.floor));
  //       console.log(initialFloor.path.length);
  //       setIndex(initialFloor.path.length)
  //       // index = initialFloorpath.length
  //       onFloorChange(false);
  //       setIsFloorReached(false)
  //       if (currentPath.length === newselectedpath?.length) {
  //         setIsReached(false);
  //       }
  //     }
  //     setCurrentIndex(index);
  //     updateLine(index);
  // };

  const prevButton = async () => {
    console.log(index);

    if (index === 1 && floor !== initialFloor.floor) {
      console.log("floor reched end");
      await onFloorChange(true);
      await setIsFloorReached(true);
    }
    if (index === 0) {
      if (floor === finalFloor.floor && intermediateFloor.floor !== null) {
        // We're at the final floor, move back to intermediate
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        dispatch(setFloor(intermediateFloor.floor));
        setIndex(intermediateFloor.path.length - 1);
        onFloorChange(false);
        setIsFloorReached(false);
        setIsReached(false);
        console.log("Moving back to intermediate floor");
      } else if (
        floor === intermediateFloor.floor ||
        (floor === finalFloor.floor && intermediateFloor.floor === null)
      ) {
        // We're at the intermediate floor or final floor with no intermediate, move back to initial
        dispatch(setFloor(initialFloor.floor));
        setIndex(initialFloor.path.length - 1);
        onFloorChange(false);
        setIsFloorReached(false);
        setIsReached(false);
        console.log("Moving back to initial floor");
      } else {
        // We're already at the initial floor, can't go back further
        console.log("Already at initial floor");
      }
    }

    setCurrentIndex(index);
    updateLine(index);
    if (currentPath.length === newselectedpath?.length) {
      setIsReached(false);
    }
  };

  useEffect(() => {
    if (trigger) {
      nextBtn("add");
    }
  }, [trigger, index]);

  useEffect(() => {
    if (prevTrigger) {
      // nextBtn("sub");
      prevButton();
    }
  }, [prevTrigger, index]);

  function closeModal() {
    // setIsReached(false)
    dispatch(resetInitialPath());
  }
  function openModal() {
    setIsReached(true);
  }
  React.useEffect(
    () => {
      if (!isGettingInitialState) {
        const defaultZoomLevel = 1; // Change this to your desired default zoom level
        const defaultTranslation = [-369.7, 1800.29, 5]; // Replace x and y with your desired translation values
        if (svgElementRef.current) {
          console.log("Applying default zoom level:", defaultZoomLevel);
          select(svgElementRef.current)
            .transition()
            .duration(350)
            .ease(easeQuadInOut) // Add transition here
            // .call(svgZoomRef.current.transform, defaultZoomTransform)
            .call(
              svgZoomRef.current.translateBy,
              defaultTranslation[0],
              defaultTranslation[1],
            );
          // .call(svgZoomRef.current.scaleTo, defaultZoomLevel);
          // .call(svgZoomRef.current.rotateBy, rotationAngle)
        } else {
          console.error("SVG element not found. Cannot apply default zoom.");
        }
      }
      
      if (!svgElementRef.current || isGettingInitialState || !floorplan.floorplanPath) return;

      const d3Svg = select(svgElementRef.current);
      const groupElement = d3Svg.select(".floorplan-svg-group");

      svgZoomRef.current = zoom()
        .interpolate(interpolate)
        .on("zoom", (ev) => {
          const transform = ev.transform;
          groupElement.attr(
            "transform",
            `translate(${transform.x}, ${transform.y}) scale(${transform.k})`
          );
          if (ev.sourceEvent !== null) {
            resetSelectedFocusView();
            resetSelectedUnits();
          }
          setTrans(transform);
        });

      d3Svg.call(svgZoomRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isGettingInitialState, floorplan]
  );

  useEffect(() => {
    if (trans && svgElementRef.current) {
      const d3Svg = select(svgElementRef.current);
      const groupElement = d3Svg.select(".floorplan-svg-group");
      groupElement.attr(
        "transform",
        `translate(${trans.x}, ${trans.y}) scale(${trans.k})`
      );
    }
  }, []);
  // useEffect(() => {
  //  zoomToUnit(initialFloor?.startPoint?.id)
  // }, [])

  // console.log(trans,4534);
  // React.useEffect(() => {
  //   if (!isGettingInitialState) {
  //     const D3SVG = select(".floorplan-svg-group");

  //     const digitisationZoneOriginCoordinate = [
  //       lerp(
  //         digitisationZone.origin[0],
  //         digitisationZone.origin[0] + digitisationZone.width,
  //         0
  //       ),
  //       lerp(
  //         digitisationZone.origin[1],
  //         digitisationZone.origin[1] + digitisationZone.height,
  //         0
  //       ),
  //     ];

  //     D3SVG.selectAll(".digitisation-zone-rect")
  //       .data([digitisationZone])
  //       .join("rect")
  //       .attr("class", "digitisation-zone-rect")
  //       .attr("x", (value) =>
  //         Math.min(value.origin[0], value.origin[0] + value.width)
  //       )
  //       .attr("y", (value) =>
  //         Math.min(value.origin[1], value.origin[1] + value.height)
  //       )
  //       .attr("width", (value) => Math.abs(value.width))
  //       .attr("height", (value) => Math.abs(value.height))
  //       .attr("fill", "black")
  //       .attr("opacity", "0")
  //       .attr("stroke-width", 2)
  //       .attr("stroke", "blue")
  //       .attr(
  //         "transform",
  //         ` translate(${digitisationZoneOriginCoordinate[0]}, ${digitisationZoneOriginCoordinate[1]})`
  //       );

  //     D3SVG.selectAll(".digitisation-zone-origin-point")
  //       .data([digitisationZone])
  //       .join("circle")
  //       .attr("class", "digitisation-zone-origin-point")
  //       .attr("r", "5")
  //       .attr("fill", "blue")
  //       .attr("cx", (value) => value.origin[0])
  //       .attr("cy", (value) => value.origin[1])
  //       .attr(
  //         "transform",
  //         `rotate(${currentRotation}, ${digitisationZoneOriginCoordinate[0]}, ${digitisationZoneOriginCoordinate[1]})`
  //       );
  //     D3SVG.selectAll(".digitisation-zone-right-bottom-point")
  //       .data([digitisationZone])
  //       .join("circle")
  //       .attr("class", "digitisation-zone-right-bottom-point")
  //       .attr("r", "5")
  //       .attr("fill", "green")
  //       .attr("cx", (value) => value.origin[0] + value.width)
  //       .attr("cy", (value) => value.origin[1] + value.height)
  //       .attr(
  //         "transform",
  //         `rotate(${currentRotation}, ${digitisationZoneOriginCoordinate[0]}, ${digitisationZoneOriginCoordinate[1]})`
  //       );
  //   }
  // }, [isGettingInitialState, digitisationZone, currentRotation]);

  // useEffect(() => {
  //   if(initialFloor.floor!==null){
  //    zoomToUnit(initialFloor.startPoint.id)
  //   }
  // }, [])

  React.useEffect(() => {
    if (!isGettingInitialState) {
      const sizeScale = scaleLinear()
        .domain([0, 100])
        .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);

      const D3SVG = select("#layer-icons");

      const rectShapedUnits = unitsData.filter((item) => item.shape === "rect");
      const circleShapedUnits = unitsData.filter(
        (item) => item.shape === "circle",
      );
      const diamondShapedUnits = unitsData.filter(
        (item) => item.shape === "diamond",
      );

      D3SVG.selectAll(".rect-units")
        .data(rectShapedUnits)
        .join("rect")
        .attr("class", "rect-units")
        .attr("id", (data) => `units-${data.id}`)
        .attr("width", sizeScale(40))
        .attr("height", sizeScale(40))
        .on("click", (ev, data) => {
          //changenow
          // zoomToUnitAndDetectNearby(data.id);
          zoomToUnit(data.id, currentRotation);
        })
        .attr(
          "transform",
          `translate(-${sizeScale(40) / 2},-${sizeScale(40) / 2})`,
        )
        .attr("fill", (value) => {
          if (selectedUnits.includes(value.id)) {
            return "blue";
          }
          if (value.status) {
            return "red";
          } else {
            return "green";
          }
        })
        .attr(
          "x",
          (value) =>
            getRealPointCoordinateRelativeToDigitisationZone(
              digitisationZone,
              0,
              value.coordinates[0],
              value.coordinates[1],
            )[0],
        )
        .attr(
          "y",
          (value) =>
            getRealPointCoordinateRelativeToDigitisationZone(
              digitisationZone,
              0,
              value.coordinates[0],
              value.coordinates[1],
            )[1],
        );
      const baseRadius = 20;
      const scaledRadius = trans?.k > 3 ? baseRadius / trans?.k : 10;
      D3SVG.selectAll(".circle-units")
        .data(circleShapedUnits)
        .join("circle")
        .attr("class", "circle-units")
        .attr("id", (data) => `units-${data.id}`)
        .attr("preserveAspectRatio", "")
        .attr("r", sizeScale(scaledRadius))
        .on("click", (ev, data) => {
          zoomToUnit(data.id, currentRotation);
          // zoomToUnitAndDetectNearby(data.id);chamnge now
        })
        .attr("fill", (value) => {
          if (selectedUnits.includes(value.id)) {
            return "blue";
          }
          if (value.status) {
            return "red";
          } else {
            return "green";
          }
        })
        .attr(
          "cx",
          (value) =>
            getRealPointCoordinateRelativeToDigitisationZone(
              digitisationZone,
              0,
              value.coordinates[0],
              value.coordinates[1],
            )[0],
        )
        .attr(
          "cy",
          (value) =>
            getRealPointCoordinateRelativeToDigitisationZone(
              digitisationZone,
              0,
              value.coordinates[0],
              value.coordinates[1],
            )[1],
        );
      D3SVG.selectAll(".diamond-units")
        .data(diamondShapedUnits)
        .join(
          (enter) => {
            const g = enter.append("g");

            g.append("rect")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", sizeScale(40))
              .attr("height", sizeScale(40))
              .attr("transform", () => {
                return `rotate(45 ${sizeScale(40) / 2} ${sizeScale(40) / 2})`;
              });
            return g;
          },
          (update) => {
            update
              .selectAll("*")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", sizeScale(40))
              .attr("height", sizeScale(40))
              .attr("transform", () => {
                return `rotate(45 ${sizeScale(40) / 2} ${sizeScale(40) / 2})`;
              });
            return update;
          },
        )
        .attr("class", "diamond-units")
        .attr("id", (data) => `units-${data.id}`)
        .attr("transform", (value) => {
          const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
            digitisationZone,
            0,
            value.coordinates[0],
            value.coordinates[1],
          );

          return `translate(${coordinates[0]},${coordinates[1]}) translate(-${
            sizeScale(40) / 2
          },-${sizeScale(40) / 2})`;
        })
        .attr("fill", (value) => {
          if (selectedUnits.includes(value.id)) {
            return "blue";
          }

          if (value.status) {
            return "red";
          } else {
            return "green";
          }
        })
        .on("click", (ev, data) => {
          zoomToUnit(data.id, currentRotation);
          // zoomToUnitAndDetectNearby(data.id);c change now
        });
      const baseSize = 20;
      const scaledSize = trans?.k > 3 ? baseSize / trans?.k : 10;
      D3SVG.selectAll(".text-units")
        .data(unitsData)
        .join("text")
        .attr("class", "text-units")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .attr("dominant-baseline", "central")
        .attr("font-size", (value) =>
          value.text === "N/A"
            ? sizeScale(15) / 2 / 1.5
            : sizeScale(scaledSize),
        )
        .on("click", (ev, data) => {
          // zoomToUnitAndDetectNearby(data.id); change now
          zoomToUnit(data.id, currentRotation);
        })
        .text((value) => value.text)
        .transition()
        .duration(500)
        .ease(easeQuadInOut)
        .attr("transform", (value) => {
          const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
            digitisationZone,
            0,
            value.coordinates[0],
            value.coordinates[1],
          );
          // Counter-rotate text so it stays readable against map rotation
          return `translate(${coordinates[0]},${coordinates[1]}) rotate(${currentRotation})`;
        });

      [
        { direction: "top", renderTimerFunc: renderTimerTop },
        { direction: "bottom", renderTimerFunc: renderTimerBottom },
        { direction: "left", renderTimerFunc: renderTimerLeft },
        { direction: "right", renderTimerFunc: renderTimerRight },
      ].forEach((item) => {
        D3SVG.selectAll(`.units-timer-${item.direction}`)
          .data(
            unitsData.filter((unit) => unit.timerPosition === item.direction),
          )
          .join(
            (enter) => {
              const g = enter.append("g");

              item.renderTimerFunc(
                g,
                (value) =>
                  getRealPointCoordinateRelativeToDigitisationZone(
                    digitisationZone,
                    0,
                    value.coordinates[0],
                    value.coordinates[1],
                  )[0],
                (value) =>
                  getRealPointCoordinateRelativeToDigitisationZone(
                    digitisationZone,
                    0,
                    value.coordinates[0],
                    value.coordinates[1],
                  )[1],
                () => sizeScale(40) / 2,
                () => "00:00:00",
                digitisationZone,
              );

              return g;
            },
            (update) => {
              update.selectAll("*").remove();

              item.renderTimerFunc(
                update,
                (value) =>
                  getRealPointCoordinateRelativeToDigitisationZone(
                    digitisationZone,
                    0,
                    value.coordinates[0],
                    value.coordinates[1],
                  )[0],
                (value) =>
                  getRealPointCoordinateRelativeToDigitisationZone(
                    digitisationZone,
                    0,
                    value.coordinates[0],
                    value.coordinates[1],
                  )[1],
                () => sizeScale(40) / 2,
                () => "00:00:00",
                digitisationZone,
              );
              return update;
            },
          )
          .attr("class", `units-timer-${item.direction}`);
      });

      //labels
      const baseSize2 = 5;
      const scaledSize2 = 5; // Always show high-level labels
      D3SVG.selectAll(".label-units")
        .data(labels)
        .join("text")
        .attr("class", "label-units")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("fill", "#04553F")
        .attr("dominant-baseline", "central")
        .attr("font-size", (value) =>
          value.name === "N/A"
            ? sizeScale(15) / 2 / 1.5
            : sizeScale(scaledSize2),
        )
        .on("click", (ev, data) => {
          // zoomToUnit(data.id);
          console.log("clicked2");
        })
        .text((value) => value.name)
        .transition()
        .duration(300)
        .ease(easeQuadInOut)
        .attr("transform", (value) => {
          const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
            digitisationZone,
            0,
            value.coordinates[0],
            value.coordinates[1],
          );
          // Counter-rotate label so it stays readable
          return `translate(${coordinates[0]},${coordinates[1]}) rotate(${currentRotation})`;
        });

      const scaledSize3 = trans?.k > 8 ? (trans?.k > 15 ? baseSize / trans?.k : 1.5) : 0;
      D3SVG.selectAll(".low-label-units")
        .data(lowLabels)
        .join("text")
        .attr("class", "low-label-units")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("fill", "#04553F")
        .attr("dominant-baseline", "central")
        .attr("font-size", (value) =>
          value.name === "N/A"
            ? sizeScale(15) / 2 / 1.5
            : sizeScale(scaledSize3),
        )
        .on("click", (ev, data) => {
          // zoomToUnit(data.id);
          console.log("clicked2");
        })
        .text((value) => value.name)
        .transition()
        .duration(500)
        .ease(easeQuadInOut)
        .attr("transform", (value) => {
          const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
            digitisationZone,
            0,
            value.coordinates[0],
            value.coordinates[1],
          );
          // Counter-rotate label so it stays readable
          return `translate(${coordinates[0]},${coordinates[1]}) rotate(${currentRotation})`;
        });
      ///room icons

      // const svgWidth = 9;
      // const svgHeight = 14;
      // const scaleFactor = 1;
      // D3SVG.selectAll('.icon-units')
      // .data(unitsData)
      // .join("g")
      // .attr("class","icon-units")
      // .on("click", (ev, data) => {
      //   console.log(data,'8765');
      //   zoomToUnit(data.id,data.coordinates);
      // })
      // .each(function(d,i){
      //   const group = select(this)
      //   const [x, y] = getRealPointCoordinateRelativeToDigitisationZone(
      //     digitisationZone,
      //     currentRotation,
      //     d.coordinates[0],
      //     d.coordinates[1]
      //   );
      //   group.attr("transform", `translate(${x - svgWidth / 2}, ${y - svgHeight / 2}) scale(${scaleFactor/trans?.k})`);
      //   group.append("path")
      //     .attr("d","M8.61793 2.61009L3.50818 2.61009L3.50818 2.31179C3.50818 1.77486 3.06585 1.34233 2.51674 1.34233L0.457589 1.34233L0.457589 0.223722C0.457589 0.096946 0.358445 0 0.228795 0C0.0991444 0 0 0.096946 0 0.223722L0 4.69815C0 4.82493 0.0991443 4.92188 0.228795 4.92188C0.358445 4.92188 0.457589 4.82493 0.457589 4.69815L0.457589 3.05753L8.61793 3.05753C8.91537 3.05753 9.15179 3.28871 9.15179 3.57955L9.15179 4.69815C9.15179 4.82493 9.25093 4.92188 9.38058 4.92188C9.51023 4.92188 9.60938 4.82493 9.60938 4.69815L9.60938 3.57955C9.60938 3.04261 9.16704 2.61009 8.61793 2.61009L8.61793 2.61009Z")
      //     .attr("fill", "white");
      // })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isGettingInitialState,
    floorplan,
    unitsData,
    selectedUnits,
    digitisationZone,
    currentRotation,
    trans?.k,
  ]);
  
  const createIconUnits = (
    D3SVG,
    iconData,
    iconType,
    icon,
    digitisationZone,
    currentRotation,
    zoomToUnit,
  ) => {
    const iconGroups = D3SVG.selectAll(`.icon-units-${iconType}`)
      .data(iconData)
      .join("g")
      .attr("class", `icon-units-${iconType}`)
      .on("click", (ev, data) => {
        console.log(data, "8765");
        // zoomToUnit(data.id);
      });

    iconGroups.selectAll("image")
      .data(d => [d])
      .join("image")
      .attr("xlink:href", icon)
      .attr("width", 40)
      .attr("height", 40)
      .attr("x", -20) // Center horizontally
      .attr("y", -20); // Center vertically

    iconGroups
      .transition()
      .duration(500)
      .ease(easeQuadInOut)
      .attr("transform", (d) => {
        const [x, y] = getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          0, // Using exact coordinates
          d.coordinates[0],
          d.coordinates[1],
        );
        return `translate(${x}, ${y}) rotate(${currentRotation})`;
      });
  };
  useEffect(() => {
    const D3SVG = select("#layer-icons");

    if (!D3SVG) return;
    console.log(icons);

    const iconTypes = icons;

    iconTypes.forEach((iconType) => {
      createIconUnits(
        D3SVG,
        iconType.data,
        iconType.type,
        iconType.icon,
        digitisationZone,
        currentRotation,
        zoomToUnit,
      );
    });

    // ... rest of your setup code
  }, [unitsData, digitisationZone, currentRotation, zoomToUnit]);
  // useEffect(() => {
  //   if (currentPath.length !== 0) {
  //     setCurrentPath(currentPath);
  //   }
  // }, [floor]);

  // useEffect(() => {
  //   setSelectPath([])
  //   console.log('floor switched');
  // },[floor,currentPath])

  useEffect(() => {
    if (selectedStartPath && index === 0) {
      console.log(selectedStartPath);

      zoomToUnit(selectedStartPath?.id, currentRotation);
    } else if (index <= currentPath?.length) {
      zoomToUnit(selectedEndPath?.id, currentRotation);
    }
  }, [selectedStartPath, floor, currentRotation]);

  // useEffect(() => {
  //   if(turningPoint){
  //     zoomToUnit
  //   }
  // }, [currentRotation])

  // useEffect(()=>{
  //   if(selectedEndPath){
  //     zoomToUnit(selectedEndPath?.id)
  //   }
  // },[floor])

  React.useEffect(() => {
    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
    const D3SVG = select("#layer-inactive-paths");
    if (currentPath?.length <= 0) return;
    console.log(currentRotation);

    const coordinatesData = currentPath?.map((item) => {
      const thisPathData = pathData.find((item1) => item1.id === item);
      const realCoordinates = getRealPointCoordinateRelativeToDigitisationZone(
        digitisationZone,
        0, // Base paths do not manually rotate anymore
        thisPathData?.coordinates[0],
        thisPathData?.coordinates[1],
      );
      selectPath?.push(realCoordinates);
      return realCoordinates;
    });
    console.log(currentPath);

    console.log(pathData);

    console.log(coordinatesData);

    const d3Line = line()
      .x((d) => d[0])
      .y((d) => d[1]);

    const fullPathString = d3Line(coordinatesData);

    D3SVG.selectAll(".path-line-selected3")
      .data([coordinatesData])
      .join("path")
      .attr("class", "path-line-selected3 relative z-10")
      .attr("stroke", (value, index) => {
        return "#4ccca7";
      })
      .attr("stroke-width", sizeScale(3))
      .attr("fill", "transparent")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("d", fullPathString);
    D3SVG.selectAll(".path-line-selected2")
      .data([coordinatesData])
      .join("path")
      .attr("class", "path-line-selected2 relative z-20")
      .attr("stroke", (value, index) => {
        return "#BFE4DA";
      })
      .attr("stroke-width", sizeScale(2))
      .attr("fill", "transparent")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("d", fullPathString);
  }, [
    isGettingInitialState,
    floorplan,
    index,
    digitisationZone,
    currentRotation,
    pathData,
    selectedStartPath,
    selectedEndPath,
    selectPath,
    floor,
    currentPath,
    newselectedpath,
  ]);

  // render focus view
  React.useEffect(() => {
    if (!isGettingInitialState) {
      const D3SVG = select("#layer-inactive-paths");

      D3SVG.selectAll(".floorplan-focus-view-polygon-units")
        .data(focusViews)
        .join("polygon")
        .attr("class", "floorplan-focus-view-polygon-units")
        .attr("fill", "black")
        .attr("opacity", "0.8")
        .attr("stroke", "red")
        .attr("stroke-width", "2")
        .attr("points", (value) =>
          value
            .map((item) =>
              getRealPointCoordinateRelativeToDigitisationZone(
                digitisationZone,
                0,
                item[0],
                item[1],
              ).join(","),
            )
            .join(" "),
        );
    }
  }, [
    isGettingInitialState,
    floorplan,
    focusViews,
    digitisationZone,
    currentRotation,
  ]);
  // render path data

  function updateLine(count) {
    console.log(count);
    // Slice the data to get a sub-array from 0 to currentIdx
    const coordinatesData = currentPath?.map((item) => {
      const thisPathData = pathData.find((item1) => item1.id === item);
      const realCoordinates = getRealPointCoordinateRelativeToDigitisationZone(
        digitisationZone,
        0, // Math rotation is off
        thisPathData?.coordinates[0],
        thisPathData?.coordinates[1],
      );
      selectPath?.push(realCoordinates);
      return realCoordinates;
    });

    const slicedData = coordinatesData?.slice(0, count + 1);

    console.log(slicedData.length);
    console.log(currentRotation);

    const slicedNewData = currentPath?.slice(0, count + 1);
    setCurrentPoint(slicedData[slicedData?.length - 1]);
    setSlice(slicedData);
    // newselectedpath.push(slicedNewData);
    completedPath.current.push(index);
    setNewSelectedPath(slicedNewData);
    onPathChange(slicedNewData);
    // Generate the path using polygonWithRoundedCorners for the sliced data
    console.log(slicedData);

    const pathString = polygonWithRoundedCorners(slicedData, 5);
    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
    const D3SVG = select("#layer-active-path");

    const d3Line = line()
      .x((d) => d[0])
      .y((d) => d[1]);

    // 1. Draw an invisible path to measure the length up to the current count
    const measurePathString = d3Line(slicedData);
    const measurePath = D3SVG.selectAll(".path-measure")
      .data([slicedData])
      .join("path")
      .attr("class", "path-measure")
      .attr("opacity", 0)
      .attr("d", measurePathString);
      
    // measure the subset length
    const targetLength = measurePath.node() ? measurePath.node().getTotalLength() : 0;

    // 2. Map the actual visible line to the FULL path string
    const fullPathString = d3Line(coordinatesData);
    const fullPathSelection = D3SVG.selectAll(".path-line-selected")
      .data([coordinatesData])
      .join("path")
      .attr("class", "path-line-selected relative z-10")
      .attr("stroke", "#29AB87")
      .attr("stroke-width", sizeScale(2))
      .attr("fill", "transparent")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("d", fullPathString);

    // 3. Animate its dash offset so only the length up to `count` is visible
    const totalLength = fullPathSelection.node() ? fullPathSelection.node().getTotalLength() : 0;
    
    // Fallback against extreme edge cases
    if (totalLength > 0) {
      // Set the dash array to be exactly the full length of the path
      fullPathSelection
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .transition() // Add smooth transition aligned with pointer
        .duration(500)
        .ease(easeQuadInOut)
        .attr("stroke-dashoffset", totalLength - targetLength);
    }
  }

  const handleSendFeedback = async () => {
    setRateLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/navigation/feedback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rateValue,
          session_id:sessionId
        }),
      });
      const responseData = await response.json();
      setRateSubmitted(true)
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }finally {
      setRateLoading(false)
    }
  }

  return (
    <div id="floorplan-container" className="relative w-full h-full overflow-hidden">
      <svg
        ref={svgElementRef}
        className="floorplan-svg w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${floorplan.width || 100} ${floorplan.height || 100}`}
      >
        <g
          id="map-rotation-layer"
          style={{
            transform: `rotate(${-currentRotation}deg)`,
            transformOrigin: `${(floorplan.width || 100) / 2}px ${(floorplan.height || 100) / 2}px`,
            transition: "transform 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955)",
          }}
        >
          <g className="floorplan-svg-group">
            {/* Layer 1: Base Floorplan */}
            <image
              className="floorplan-image"
              href={floorplan.floorplanPath}
              width={floorplan.width}
              height={floorplan.height}
            />

            {/* Layer 2: Inactive Static Paths */}
            <g id="layer-inactive-paths" />

            {/* Layer 3: Active Highlighted Path */}
            <g id="layer-active-path" className="relative z-10" />

            {/* Layer 4: Icons & Labels */}
            <g id="layer-icons" className="relative z-20" />

            {/* Layer 5: Pointer User Marker */}
            <g id="layer-pointer" className="relative z-30" />
          </g>
        </g>
      </svg>
      <Transition appear show={isReached} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsReached(false)}>
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
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="flex flex-col items-center gap-2 text-lg font-semibold leading-6 text-gray-900"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-500"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    Destination Reached!
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">
                      You have arrived at your destination.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1 mt-4">
                   <p className="text-xs">How was your journey ?</p> 
                  <Rate size='lg'
                  value={rateValue}
                  onChange={(value)=>{
                    if(!rateSubmitted){
                      setRateValue(value);
                    }
                  }} />
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    {
                      !rateSubmitted ? (
                        <button
                        disabled={rateValue===0}
                        type="button"
                        onClick={handleSendFeedback}
                        className="inline-flex justify-center rounded-md border border-transparent bg-[#bfdae4] px-4 py-2 text-sm font-medium text-[#296cab] hover:bg-[#aec2e7] disabled:bg-gray-300 disabled:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        {
                          rateLoading ? (
                            <FaSpinner className="text-[#296cab] animate-spin" />
                          ):(
                            <>Submit Rating</>
                          )
                        }
                       
                      </button>
                      ):(
                        <p className="mb-2 font-medium text-center text-green-600">Thanks for your feedback!</p>
                      )
                    }
                 
                    <Link to="/home" className="w-full">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#BFE4DA] px-4 py-2 text-sm font-medium text-[#1f9e7a] hover:bg-[#aee7d8] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setIsReached(false)}
                      >
                        Go back to home
                      </button>
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
