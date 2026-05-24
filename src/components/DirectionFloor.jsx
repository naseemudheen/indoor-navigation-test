import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState, useEffect, memo } from "react";
import { useDispatch } from "react-redux";
import { MdErrorOutline } from "react-icons/md";
import GDoors from "../data/icons/groundFloor/doors.json";
import {
  BDoors,
  BStairs,
  BLift,
  BNurse,
  BEnquiry,
  BWards,
} from "../data/icons/basement";
import GStairs from "../data/icons/groundFloor/stairs.json";
import GLifts from "../data/icons/groundFloor/lift.json";
import GIcu from "../data/icons/groundFloor/icu.json";
import GDoctor from "../data/icons/groundFloor/doctor.json";
import GNurse from "../data/icons/groundFloor/nurse.json";
import GToilet from "../data/icons/groundFloor/toilet.json";

import { select, scaleLinear, zoom } from "d3";
import {
  renderTimerTop,
  renderTimerBottom,
  renderTimerLeft,
  renderTimerRight,
} from "./timerRenderer";
import {
  lerp,
  getRealPointCoordinateRelativeToDigitisationZone,
} from "../utils";
import { Link } from "react-router-dom";
import { Location } from "./Icons";
import { useSelector } from "react-redux";
import { resetInitialPath, setFloor } from "../redux/mapSlice";
// import { calculateAngle } from "../utils/helper/angleFinder";

function getAngle(c, l) {
  let delta_x = l.x - c.x;
  let delta_y = l.y - c.y;
  let a = Math.atan2(delta_y, delta_x);
  return a; //in radians;
}

function polygonWithRoundedCorners(points, r) {
  //move to the first point
  console.log(points);
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

const DirectionFloor = ({
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
  distance,
  selectedStartPath,
  selectedEndPath,
  zoomToUnit,
  onFloorChange,
  currentPath,
  stair,
  errMessage,
  setErrMsg,
  labels,
  lowLabels,
  trigger,
  prevTrigger,
  totalPath,
  index,
  icons,
  onPathChange,
}) => {
  const dispatch = useDispatch();
  const [trans, setTrans] = useState(null);
  const initialFloor = useSelector((state) => state.map.initialPath);
  const finalFloor = useSelector((state) => state.map.finalPath);
  const floor = useSelector((state) => state.map.floor);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [selectPath, setSelectPath] = useState([]);
  const [selectedPath, setSelectedPath] = useState(currentPath);
  const [newselectedpath, setNewSelectedPath] = useState([]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const [labelPositions, setLabelPositions] = useState({});
  const [defaultZoomApplied, setDefaultZoomApplied] = useState(false);
  const [isreached, setIsReached] = useState(false);
  const [isFloorReached, setIsFloorReached] = useState(false);
  const [slice, setSlice] = useState([]);
  React.useEffect(
    () => {
      if (!isGettingInitialState) {
        console.log(import.meta.env.VITE_TRANSLATION);

        const defaultZoomLevel = 8.9; // Change this to your desired default zoom level
        // const defaultTranslation = [0, 0,5]; // Replace x and y with your desired translation values
        const defaultTranslation = [-45691, -47246, 8.9]; // Replace x and y with your desired translation values
        const svgElement = select("#floorplan-container");
        if (svgElementRef.current) {
          console.log("Applying default zoom level:", defaultZoomLevel);
          svgElementRef.current.transition(); // Add transition here
          svgElementRef.current
            .transition() // Add transition here
            // .call(svgZoomRef.current.transform, defaultZoomTransform)
            .call(
              svgZoomRef.current.translateBy,
              defaultTranslation[0],
              defaultTranslation[1],
            )
            .call(svgZoomRef.current.scaleTo, defaultZoomLevel);
          // .call(svgZoomRef.current.rotateBy, rotationAngle)
        } else {
          console.error("SVG element not found. Cannot apply default zoom.");
        }
      }
      svgElementRef.current = select("#floorplan-container")
        .selectAll(".floorplan-svg")
        .data([floorplan])
        .join("svg")
        .attr("class", "floorplan-svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", (value) => `0 0 ${value.width} ${value.height}`)
        .call(
          zoom().on("zoom", (ev) => {
            if (ev.sourceEvent !== null) {
              resetSelectedFocusView();
              resetSelectedUnits();
              const transform = ev.transform;
              console.log(transform);
              const clampedScale = Math.max(1, Math.min(transform.k, 10));
              groupElement.attr(
                "transform",
                `translate(${transform.x}, ${transform.y}) scale(${transform.k})`,
              );
            }
          }),
        );

      const groupElement = svgElementRef.current
        .selectAll(".floorplan-svg-group")
        .data([floorplan])
        .join("g")
        .attr("class", "floorplan-svg-group");
      groupElement
        .selectAll(".floorplan-image")
        .data([floorplan])
        .join("image")
        .attr("class", "floorplan-image")
        .attr("xlink:href", (value) => value.floorplanPath)
        .attr("width", (value) => value.width)
        .attr("height", (value) => value.height);

      svgZoomRef.current = zoom().on("zoom", (ev) => {
        const transform = ev.transform;
        console.log(transform);

        const clampedScale = Math.max(1, Math.min(transform.k, 10));
        console.log(clampedScale);

        // --------------------
        // ?ADD ROTATION HERE
        // --------------------
        groupElement.attr(
          "transform",
          `translate(${transform?.x}, ${transform?.y}) scale(${transform.k})`,
        );
        setTrans(transform);
      });

      svgElementRef.current.call(svgZoomRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isGettingInitialState, floorplan],
  );
  useEffect(() => {
    if (trans) {
      const groupElement = svgElementRef.current
        .selectAll(".floorplan-svg-group")
        .data([floorplan])
        .join("g")
        .attr("class", "floorplan-svg-group");
      groupElement.attr(
        "transform",
        `translate(${trans?.x}, ${trans?.y}) scale(${trans?.k})`,
      );
    }
  }, []);
  // useEffect(() => {
  //  zoomToUnit(initialFloor?.startPoint?.id)`
  // }, [])

  // console.log(trans,4534);
  React.useEffect(() => {
    if (!isGettingInitialState) {
      const D3SVG = select(".floorplan-svg-group");

      const digitisationZoneOriginCoordinate = [
        lerp(
          digitisationZone.origin[0],
          digitisationZone.origin[0] + digitisationZone.width,
          0,
        ),
        lerp(
          digitisationZone.origin[1],
          digitisationZone.origin[1] + digitisationZone.height,
          0,
        ),
      ];

      D3SVG.selectAll(".digitisation-zone-rect")
        .data([digitisationZone])
        .join("rect")
        .attr("class", "digitisation-zone-rect")
        .attr("x", (value) =>
          Math.min(value.origin[0], value.origin[0] + value.width),
        )
        .attr("y", (value) =>
          Math.min(value.origin[1], value.origin[1] + value.height),
        )
        .attr("width", (value) => Math.abs(value.width))
        .attr("height", (value) => Math.abs(value.height))
        .attr("fill", "black")
        .attr("opacity", "0")
        .attr("stroke-width", 2)
        .attr("stroke", "blue")
        .attr(
          "transform",
          ` ${digitisationZoneOriginCoordinate[0]}, ${digitisationZoneOriginCoordinate[1]})`,
        );

      D3SVG.selectAll(".digitisation-zone-origin-point")
        .data([digitisationZone])
        .join("circle")
        .attr("class", "digitisation-zone-origin-point")
        .attr("r", "5")
        .attr("fill", "blue")
        .attr("cx", (value) => value.origin[0])
        .attr("cy", (value) => value.origin[1])
        .attr(
          "transform",
          ` ${digitisationZoneOriginCoordinate[0]}, ${digitisationZoneOriginCoordinate[1]})`,
        );
      D3SVG.selectAll(".digitisation-zone-right-bottom-point")
        .data([digitisationZone])
        .join("circle")
        .attr("class", "digitisation-zone-right-bottom-point")
        .attr("r", "5")
        .attr("fill", "green")
        .attr("cx", (value) => value.origin[0] + value.width)
        .attr("cy", (value) => value.origin[1] + value.height)
        .attr(
          "transform",
          ` ${digitisationZoneOriginCoordinate[0]}, ${digitisationZoneOriginCoordinate[1]})`,
        );
    }
  }, [isGettingInitialState, digitisationZone, currentRotation]);

  // useEffect(() => {
  //   if(initialFloor.floor!==null){
  //    zoomToUnit(initialFloor.startPoint.id)
  //   }
  // }, [])
  const createIconUnits = (
    D3SVG,
    iconData,
    iconType,
    icon,
    digitisationZone,
    currentRotation,
    zoomToUnit,
  ) => {
    D3SVG.selectAll(`.icon-units-${iconType}`)
      .data(iconData)
      .join("g")
      .attr("class", `icon-units-${iconType}`)
      .on("click", (ev, data) => {
        console.log(data, "8765");
        // zoomToUnit(data.id);
      })
      .each(function (d, i) {
        const group = select(this);
        const [x, y] = getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          d.coordinates[0],
          d.coordinates[1],
        );
        const coordinatesArray = [];
        const logEntry = `${d.coordinates[0]}==${x}, ${d.coordinates[1]}==${y}`;
        coordinatesArray.push(logEntry);
        // console.log(coordinatesArray,'kollam');
        window.allCoordinatesArray = window.allCoordinatesArray || [];
        window.allCoordinatesArray.push(logEntry);
        // console.log(window.allCoordinatesArray, 'allCoordinatesArray');

        group
          .attr("transform", `translate(${x}, ${y}) rotate(${currentRotation})`)
          .append("image")
          .attr("xlink:href", icon)
          .attr("width", (d) => {
             return iconType === "entry" ? 60 : 40;
          })
          .attr("height", (d) => {
            return iconType === "entry" ? 60 : 40;
          })
          .attr("x", (d) => (iconType === "entry" ? -30 : -20)) // Center horizontally
          .attr("y", (d) => (iconType === "entry" ? -30 : -20)); // Center vertically
      });
  };
  React.useEffect(() => {
    if (!isGettingInitialState) {
      const sizeScale = scaleLinear()
        .domain([0, 100])
        .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);

      const D3SVG = select(".floorplan-svg-group");

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
          zoomToUnit(data.id);
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
              currentRotation,
              value.coordinates[0],
              value.coordinates[1],
            )[0],
        )
        .attr(
          "y",
          (value) =>
            getRealPointCoordinateRelativeToDigitisationZone(
              digitisationZone,
              currentRotation,
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
          // zoomToUnit(data.id);
          console.log("clicked");
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
              currentRotation,
              value.coordinates[0],
              value.coordinates[1],
            )[0],
        )
        .attr(
          "cy",
          (value) =>
            getRealPointCoordinateRelativeToDigitisationZone(
              digitisationZone,
              currentRotation,
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
            currentRotation,
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
          zoomToUnit(data.id);
        });
      // console.log(trans?.k);
      const baseSize = 30;
      const scaledSize = trans?.k > 3 ? baseSize / trans?.k : 10;
      D3SVG.selectAll(".text-units")
        .data(unitsData)
        .join("text")
        .attr("class", "text-units")
        .attr("transform", (value) => {
          const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
            digitisationZone,
            currentRotation,
            value.coordinates[0],
            value.coordinates[1],
          );
          return `translate(${coordinates[0]},${coordinates[1]}) rotate(${currentRotation})`;
        })
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
          // zoomToUnit(data.id);
          console.log("clicked2");
        })
        //   zoomToUnit(data.id);
        // })
        .text((value) => value.text);

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
                    currentRotation,
                    value.coordinates[0],
                    value.coordinates[1],
                  )[0],
                (value) =>
                  getRealPointCoordinateRelativeToDigitisationZone(
                    digitisationZone,
                    currentRotation,
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
                    currentRotation,
                    value.coordinates[0],
                    value.coordinates[1],
                  )[0],
                (value) =>
                  getRealPointCoordinateRelativeToDigitisationZone(
                    digitisationZone,
                    currentRotation,
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
      const scaledSize2 = 5;
      D3SVG.selectAll(".label-units")
        .data(labels)
        .join("text")
        .attr("class", "label-units")
        .attr("transform", (value) => {
          const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
            digitisationZone,
            currentRotation,
            value.coordinates[0],
            value.coordinates[1],
          );
          return `translate(${coordinates[0]},${coordinates[1]}) rotate(${currentRotation})`;
        })
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
        //   zoomToUnit(data.id);
        // })
        .text((value) => value.name);

      const scaledSize3 = trans?.k > 15 ? baseSize / trans?.k : 2;
      D3SVG.selectAll(".low-label-units")
        .data(lowLabels)
        .join("text")
        .attr("class", "low-label-units")
        .attr("transform", (value) => {
          const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
            digitisationZone,
            currentRotation,
            value.coordinates[0],
            value.coordinates[1],
          );
          return `translate(${coordinates[0]},${coordinates[1]}) rotate(${currentRotation})`;
        })
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
        //   zoomToUnit(data.id);
        // })
        .text((value) => value.name);

      ///room icons

      const svgWidth = 9;
      const svgHeight = 14;
      const scaleFactor = 6;
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
  useEffect(() => {
    const D3SVG = select(".floorplan-svg-group");

    if (!D3SVG) return;
    console.log(icons);

    const iconTypes = icons;

    iconTypes?.forEach((iconType) => {
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
  }, [
    unitsData,
    GDoors,
    GStairs,
    GLifts,
    GIcu,
    GDoctor,
    GNurse,
    GToilet,
    digitisationZone,
    currentRotation,
    zoomToUnit,
  ]);
  // useEffect(()=>{
  //   if(selectedStartPath){
  //     zoomToUnit(selectedStartPath?.id)
  //   }
  // },[selectedStartPath,floor])

  React.useEffect(() => {
    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
    const D3SVG = select(".floorplan-svg-group");
    D3SVG.selectAll(".path-point")
      .data(pathData)
      // .join("circle")
      .join("g")
      .attr("class", "path-point")
      .attr("width", sizeScale(50) / 2) // Set the width of the SVG
      .attr("height", sizeScale(50) / 2)
      .append("path")
      .attr(
        "d",
        "M24 1C15.2 1 6.01501 7.988 6.00001 18C5.98201 29.981 24 48 24 48C24 48 42.019 30.006 42 18C41.984 8.003 32.8 1 24 1L24 1ZM24 26C19.582 26 16 22.418 16 18C16 13.582 19.582 10 24 10C28.418 10 32 13.582 32 18C32 22.418 28.418 26 24 26L24 26Z",
      )
      // .attr("r", sizeScale(10) / 2)
      .on("click", (ev) => {
        console.log(ev);
        console.log("cliked5");
      })
      .attr("fill", (value) => {
        if (
          selectedStartPath?.id === value.id &&
          selectedStartPath?.floor === floor
        ) {
          return "green";
        }

        if (
          selectedEndPath?.id === value.id &&
          selectedEndPath?.floor === floor
        ) {
          return "red";
        }

        return "transparent";
      })
      .attr(
        "cx",
        (value) =>
          getRealPointCoordinateRelativeToDigitisationZone(
            digitisationZone,
            currentRotation,
            value?.coordinates[0],
            value?.coordinates[1],
          )[0],
      )
      .attr(
        "cy",
        (value) =>
          getRealPointCoordinateRelativeToDigitisationZone(
            digitisationZone,
            currentRotation,
            value.coordinates[0],
            value.coordinates[1],
          )[1],
      )
      .raise();
    if (currentPath?.length <= 0) return;
    const coordinatesData = currentPath?.map((item) => {
      const thisPathData = pathData.find((item1) => item1.id === item);
      const realCoordinates = getRealPointCoordinateRelativeToDigitisationZone(
        digitisationZone,
        currentRotation,
        thisPathData?.coordinates[0],
        thisPathData?.coordinates[1],
      );
      selectPath?.push(realCoordinates);
      return realCoordinates;
    });
    if (selectedStartPath && selectedEndPath) {
      D3SVG.selectAll(".path-line-selected3")
        .data([coordinatesData])
        .join("path")
        .attr("class", "path-line-selected3 relative z-10")
        .attr("stroke", (value, index) => {
          return "#4ccca7";
        })
        .attr("stroke-width", sizeScale(3))
        .attr("fill", "transparent")
        // .attr("d", updateLine)
        .attr("d", (value) => polygonWithRoundedCorners(coordinatesData, 5));
      // console.log(newselectedpath.length,coordinatesData.length);
      D3SVG.selectAll(".path-line-selected2")
        .data([coordinatesData])
        .join("path")
        .attr("class", "path-line-selected2 relative z-20")
        .attr("stroke", (value, index) => {
          return "#BFE4DA";
        })
        .attr("stroke-width", sizeScale(2))
        .attr("fill", "transparent")
        // .attr("d", updateLine)
        .attr("d", (value) => polygonWithRoundedCorners(coordinatesData, 5));
    }
  }, [
    isGettingInitialState,
    floorplan,
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

  React.useEffect(() => {
    if (!isGettingInitialState) {
      const D3SVG = select(".floorplan-svg-group");

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
                currentRotation,
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
    const D3SVG = select(".floorplan-svg-group");

    D3SVG.selectAll(".path-point").remove();
    // D3SVG.selectAll(".line-path")
    //   .data(lineData)
    //   .join("line")
    //   .attr("class", "line-path")
    //   .attr("x1", (value) => {
    //     const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
    //       digitisationZone,
    //       currentRotation,
    //       value[0],
    //       value[1]
    //     );

    //     return coordinates[0];
    //   })
    //   .attr("y1", (value) => {
    //     const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
    //       digitisationZone,
    //       currentRotation,
    //       value[0],
    //       value[1]
    //     );

    //     return coordinates[1];
    //   })
    //   .attr("x2", (value) => {
    //     const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
    //       digitisationZone,
    //       currentRotation,
    //       value[2],
    //       value[3]
    //     );

    //     return coordinates[0];
    //   })
    //   .attr("y2", (value) => {
    //     const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
    //       digitisationZone,
    //       currentRotation,
    //       value[2],
    //       value[3]
    //     );

    //     return coordinates[1];
    //   })
    //   .attr("stroke", "green")
    //   .attr("stroke-width", () => sizeScale(2));

    D3SVG.selectAll(".path-point")
      .data(pathData)
      .join("g")
      // .join("circle")
      .attr("class", "path-point relative ")
      .append("path")
      .attr(
        "d",
        "M25 1C16.1797 1 9 8.17969 9 17C9 31.1133 23.6289 47.9453 24.25 48.6563C24.4414 48.875 24.7109 49 25 49C25.3086 48.9805 25.5586 48.875 25.75 48.6563C26.3711 47.9336 41 30.8125 41 17C41 8.17969 33.8203 1 25 1L25 1ZM25 12C28.3125 12 31 14.6875 31 18C31 21.3125 28.3125 24 25 24C21.6875 24 19 21.3125 19 18C19 14.6875 21.6875 12 25 12L25 12Z",
      )
      .attr("fill", (value) => {
        if (
          floor === selectedStartPath?.floor &&
          selectedStartPath?.id === value.id
        ) {
          return "green";
        }
        if (
          floor === selectedEndPath?.floor &&
          selectedEndPath?.id === value.id
        ) {
          return "red";
        }
        if (stair?.id === value?.id) {
          return "blue";
        }

        return "transparent";
      })
      // .attr(
      //   "cx",
      //   (value) =>
      //     getRealPointCoordinateRelativeToDigitisationZone(
      //       digitisationZone,
      //       currentRotation,
      //       value.coordinates[0],
      //       value.coordinates[1]
      //     )[0]
      // )
      // .attr(
      //   "cy",
      //   (value) =>
      //     getRealPointCoordinateRelativeToDigitisationZone(
      //       digitisationZone,
      //       currentRotation,
      //       value.coordinates[0],
      //       value.coordinates[1]
      //     )[1]
      // );
      .attr("transform", (value) => {
        const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          value.coordinates[0],
          value.coordinates[1],
        );
        const scaleX = 1.5; // Scale factor for the x-axis
        const scaleY = 1.5;
        const pathElement = D3SVG.select(".path-point path");
        const bbox = pathElement.node()?.getBBox();
        const centerX = bbox?.x + bbox?.width;
        const centerY = bbox?.y + bbox?.height;
        return `translate(${coordinates[0] - centerX}, ${
          coordinates[1] - centerY
        }) scale(${scaleX}, ${scaleY})`; // Correctly format the transform attribute
      })
      .raise();
  }, [
    isGettingInitialState,
    floorplan,
    digitisationZone,
    currentRotation,
    pathData,
    selectedStartPath,
    selectedEndPath,
    stair,
    currentPath,
  ]);

  function simplifyPathObjects(paths) {
    return paths.map((path) => ({
      coordinates: path.coordinates,
    }));
  }
  const closeModal = () => {
    console.log("closed err");
    window.location.reload();
  };

  return (
    <div id="floorplan-container">
      <Transition appear show={errMessage || false} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                    className="flex items-center gap-2 text-lg font-medium leading-6 text-red-500"
                  >
                    <MdErrorOutline className="" /> Path not found!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      We couldn't find a path between the selected points.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#BFE4DA] px-4 py-2 text-sm font-medium text-[#29AB87] hover:bg-[#aee7d8] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Choose Different Points
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default DirectionFloor;
