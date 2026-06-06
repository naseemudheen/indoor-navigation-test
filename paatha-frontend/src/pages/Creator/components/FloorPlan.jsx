import React,{useEffect, useState} from "react";
import {
  select,
  scaleLinear,
  zoom,
  zoomIdentity
} from "d3";

import {
  lerp,
  getRealPointCoordinateRelativeToDigitisationZone
} from "../utils";
import {
  renderTimerTop,
  renderTimerBottom,
  renderTimerLeft,
  renderTimerRight
} from "./TimeRenderer";
import { IconMap } from "../../../constants/iconMap";
import QRCreateModal from "../../../components/QRCreateModal";

function getAngle(c, l) {
  let delta_x = l.x - c.x;
  let delta_y = l.y - c.y;
  let a = Math.atan2(delta_y, delta_x);
  return a; //in radians;
}

function polygonWithRoundedCorners(points, r) {
  //move to the first point
  let d = `M${points[0][0]},${points[0][1]}`;

  for (let i = 1; i < points.length - 1; i++) {
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
  selectedPath,
  markerData
}) {
  const [trans,setTrans]=useState(null)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectPath, setSelectPath] = useState([]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [defaultZoomApplied, setDefaultZoomApplied] = useState(false);
  const [slice,setSlice] = useState([]);
  const [selectedNodeDetail, setSelectedNodeDetail] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [qrLocations, setQrLocations] = useState([]);
  const [loadingQr, setLoadingQr] = useState(false);
  const [showCreateQrModal, setShowCreateQrModal] = useState(false);
  const [showPreviewQr, setShowPreviewQr] = useState(null);

  const fetchQrLocations = React.useCallback(async () => {
    setLoadingQr(true);
    try {
      const res = await fetch("http://localhost:8000/api/qr?size=500");
      if (res.ok) {
        const data = await res.json();
        setQrLocations(data.items || []);
      } else {
        setQrLocations([]);
      }
    } catch (err) {
      console.error("Error fetching QR locations:", err);
      setQrLocations([]);
    } finally {
      setLoadingQr(false);
    }
  }, []);

  React.useEffect(() => {
    fetchQrLocations();
  }, [fetchQrLocations]);

  const getQrForNode = React.useCallback(
    (nodeId) => qrLocations.find((item) => item.node_id === nodeId),
    [qrLocations]
  );

  const handleDetachQr = async (qrId) => {
    if (!window.confirm("Are you sure you want to delete this QR mapping?")) return;
    try {
      const token = localStorage.getItem("paatha_token");
      const res = await fetch(`http://localhost:8000/api/qr/${qrId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setShowPreviewQr(null);
        fetchQrLocations();
      } else {
        alert("Failed to delete QR mapping.");
      }
    } catch (err) {
      console.error("Error detaching QR:", err);
      alert("An error occurred while deleting QR mapping.");
    }
  };

  React.useEffect(() => {
    if (!isGettingInitialState) {
    const defaultZoomLevel = 3; // Change this to your desired default zoom level
    const defaultZoomTransform = zoomIdentity.scale(defaultZoomLevel);
    console.log(svgElementRef.current);
    if (svgElementRef.current) {
      console.log('Applying default zoom level:', defaultZoomLevel);
      svgElementRef.current.call(svgZoomRef.current.transform, defaultZoomTransform);
    } else {
      console.error('SVG element not found. Cannot apply default zoom.');
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
          console.log(ev.sourceEvent.ctrlKey);
          if (ev.sourceEvent.ctrlKey) {
            const transform = ev.transform;
            const rotation = currentRotation + ev.sourceEvent.deltaY / 10;
            groupElement.attr(
          "transform",
          `translate(${transform.x}, ${transform.y}) scale(${transform.k})`
            );
          }
        }
          })
        );

        // const transform = ev.transform;

        // groupElement.attr(
        //   "transform",
        //   `translate(${transform.x}, ${transform.y}) scale(${transform.k}) rotate(${currentRotation})`
        // );
        //   })
        // );

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
        if (ev.sourceEvent !== null) {
          resetSelectedFocusView();
          resetSelectedUnits();
          const transform = ev.transform;
          setTrans(transform)
        }
        if (ev.sourceEvent?.touches && ev.sourceEvent?.touches.length === 2) {
          // Calculate the angle between the two touch points
          const touch1 = ev.sourceEvent?.touches[0];
          const touch2 = ev.sourceEvent?.touches[1];
          const dx = touch2.clientX - touch1.clientX;
          const dy = touch2.clientY - touch1.clientY;
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          console.log(angle);
          // Update the rotation angle
          setRotationAngle(angle);
        }
        const transform = ev.transform;
        groupElement.attr(
          "transform",
          `translate(${transform?.x}, ${transform?.y}) scale(${transform?.k}) rotate(${currentRotation})`
        );
        setTrans(transform)
      });

      svgElementRef.current.call(svgZoomRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGettingInitialState, floorplan,defaultZoomApplied]);
  // useEffect(()=>{
  //   if(trans){
  //     const groupElement = svgElementRef.current
  //       .selectAll(".floorplan-svg-group")
  //       .data([floorplan])
  //       .join("g")
  //       .attr("class", "floorplan-svg-group");
  //       groupElement.attr('transform',`translate(${trans?.x}, ${trans?.y}) scale(${trans?.k}) rotate(180)`)
          

  //   }
  // },[trans])
console.log(trans,4534);
  React.useEffect(() => {
    if (!isGettingInitialState) {
      const D3SVG = select(".floorplan-svg-group");

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
        )
      ];

      D3SVG.selectAll(".digitisation-zone-rect")
        .data([digitisationZone])
        .join("rect")
        .attr("class", "digitisation-zone-rect")
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
          `rotate(${currentRotation}, ${digitisationZoneOriginCoordinate[0]}, ${digitisationZoneOriginCoordinate[1]})`
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
          `rotate(${currentRotation}, ${digitisationZoneOriginCoordinate[0]}, ${digitisationZoneOriginCoordinate[1]})`
        );
    }
  }, [isGettingInitialState, digitisationZone, currentRotation]);

  React.useEffect(() => {
    if (!isGettingInitialState) {
      const sizeScale = scaleLinear()
        .domain([0, 100])
        .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);

      const D3SVG = select(".floorplan-svg-group");

      const rectShapedUnits = unitsData.filter((item) => item.shape === "rect");
      const circleShapedUnits = unitsData.filter(
        (item) => item.shape === "circle"
      );
      const diamondShapedUnits = unitsData.filter(
        (item) => item.shape === "diamond"
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
          `translate(-${sizeScale(40) / 2},-${sizeScale(40) / 2})`
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
              value.coordinates[1]
            )[0]
        )
        .attr(
          "y",
          (value) =>
            getRealPointCoordinateRelativeToDigitisationZone(
              digitisationZone,
              currentRotation,
              value.coordinates[0],
              value.coordinates[1]
            )[1]
        );
      D3SVG.selectAll(".circle-units")
        .data(circleShapedUnits)
        .join("circle")
        .attr("class", "circle-units")
        .attr("id", (data) => `units-${data.id}`)
        .attr("preserveAspectRatio","")
        .attr("r", sizeScale(20) / 2)
        .on("click", (ev, data) => {
          zoomToUnit(data.id);
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
          }
        )
        .attr("class", "diamond-units")
        .attr("id", (data) => `units-${data.id}`)
        .attr("transform", (value) => {
          const coordinates = getRealPointCoordinateRelativeToDigitisationZone(
            digitisationZone,
            currentRotation,
            value.coordinates[0],
            value.coordinates[1]
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

      D3SVG.selectAll(".text-units")
        .data(unitsData)
        .join("text")
        .attr("class", "text-units")
        .attr(
          "x",
          (value) =>
            getRealPointCoordinateRelativeToDigitisationZone(
              digitisationZone,
              currentRotation,
              value.coordinates[0],
              value.coordinates[1]
            )[0]
        )
        .attr(
          "y",
          (value) =>
            getRealPointCoordinateRelativeToDigitisationZone(
              digitisationZone,
              currentRotation,
              value.coordinates[0],
              value.coordinates[1]
            )[1]
        )
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .attr("dominant-baseline", "hanging")
        .attr("font-size", (value) =>
          value.text === "N/A" ? sizeScale(15) / 2 / 1.5 : sizeScale(15) / 2
        )
        .on("click", (ev, data) => {
          zoomToUnit(data.id);
        })
        .text((value) => value.text);

      [
        { direction: "top", renderTimerFunc: renderTimerTop },
        { direction: "bottom", renderTimerFunc: renderTimerBottom },
        { direction: "left", renderTimerFunc: renderTimerLeft },
        { direction: "right", renderTimerFunc: renderTimerRight }
      ].forEach((item) => {
        D3SVG.selectAll(`.units-timer-${item.direction}`)
          .data(
            unitsData.filter((unit) => unit.timerPosition === item.direction)
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
                    value.coordinates[1]
                  )[0],
                (value) =>
                  getRealPointCoordinateRelativeToDigitisationZone(
                    digitisationZone,
                    currentRotation,
                    value.coordinates[0],
                    value.coordinates[1]
                  )[1],
                () => sizeScale(40) / 2,
                () => "00:00:00",
                digitisationZone
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
                    value.coordinates[1]
                  )[0],
                (value) =>
                  getRealPointCoordinateRelativeToDigitisationZone(
                    digitisationZone,
                    currentRotation,
                    value.coordinates[0],
                    value.coordinates[1]
                  )[1],
                () => sizeScale(40) / 2,
                () => "00:00:00",
                digitisationZone
              );

              return update;
            }
          )
          .attr("class", `units-timer-${item.direction}`);
      });
      const svgWidth = 9; // Replace with the width of your SVG path
      const svgHeight = 14;
      const scaleFactor = 1;
      D3SVG.selectAll('.icon-units')
      .data(circleShapedUnits)
      .join("g")
      .attr("class","icon-units")
      .each(function(d,i){
        const group = select(this)
        const [x, y] = getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          d.coordinates[0],
          d.coordinates[1]
        );
        group.attr("transform", `translate(${x - svgWidth / 2}, ${y - svgHeight / 2})`);
        group.append("path")
          .attr("d","M8.61793 2.61009L3.50818 2.61009L3.50818 2.31179C3.50818 1.77486 3.06585 1.34233 2.51674 1.34233L0.457589 1.34233L0.457589 0.223722C0.457589 0.096946 0.358445 0 0.228795 0C0.0991444 0 0 0.096946 0 0.223722L0 4.69815C0 4.82493 0.0991443 4.92188 0.228795 4.92188C0.358445 4.92188 0.457589 4.82493 0.457589 4.69815L0.457589 3.05753L8.61793 3.05753C8.91537 3.05753 9.15179 3.28871 9.15179 3.57955L9.15179 4.69815C9.15179 4.82493 9.25093 4.92188 9.38058 4.92188C9.51023 4.92188 9.60938 4.82493 9.60938 4.69815L9.60938 3.57955C9.60938 3.04261 9.16704 2.61009 8.61793 2.61009L8.61793 2.61009Z")
          .attr("fill", "white");
      })
      
    }
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isGettingInitialState,
    floorplan,
    unitsData,
    selectedUnits,
    digitisationZone,
    currentRotation
  ]);

  // render focus view
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
                item[1]
              ).join(",")
            )
            .join(" ")
        );
    }
  }, [
    isGettingInitialState,
    floorplan,
    focusViews,
    digitisationZone,
    currentRotation
  ]);

  // render path data
  React.useEffect(() => {
    const lineData = pathData
      .map((item) => {
        return item.neighbors
          .map((item1) => {
            if (item1.isParent) return null;
            return [
              item.coordinates[0],
              item.coordinates[1],
              item1.coordinates[0],
              item1.coordinates[1]
            ];
          })
          .filter((item1) => item1 !== null);
      })
      .flat();

    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
    const D3SVG = select(".floorplan-svg-group");

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
      .attr("stroke", "green")
      .attr("stroke-width", () => sizeScale(2));

    D3SVG.selectAll(".path-point")
      .data(pathData)
      .join("circle")
      .attr("class", "path-point")
      .attr("r", (value) => {
        if (selectedStartPath === value.id || selectedEndPath === value.id) {
          return sizeScale(3.5);
        }
        return value.isSearchable ? sizeScale(3.8) : sizeScale(2.0);
      })
      .attr("fill", (value) => {
        if (selectedStartPath === value.id) {
          return "#2563eb";
        }

        if (selectedEndPath === value.id) {
          return "#16a34a";
        }

        return value.isSearchable ? "#ef4444" : "#94a3b8";
      })
      .attr("opacity", (value) => {
        if (selectedStartPath === value.id || selectedEndPath === value.id) {
          return 1.0;
        }
        return value.isSearchable ? 0.9 : 0.6;
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", (value) => {
        if (selectedStartPath === value.id || selectedEndPath === value.id) {
          return sizeScale(0.6);
        }
        return value.isSearchable ? sizeScale(0.8) : sizeScale(0.4);
      })
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
      .style("cursor", "pointer")
      .style("pointer-events", "all")
      .on("click", function (event, data) {
        event.stopPropagation();
        setSelectedNodeDetail(data);
      })
      .on("mouseover", function (event, data) {
        setHoveredNode(data);
      })
      .on("mouseout", function (event, data) {
        setHoveredNode(null);
      });

    D3SVG.selectAll(".qr-node-ring")
      .data(pathData.filter((item) => getQrForNode(item.id)), (value) => value.id)
      .join("circle")
      .attr("class", "qr-node-ring")
      .attr("r", (value) => {
        if (selectedStartPath === value.id || selectedEndPath === value.id) {
          return sizeScale(5.0);
        }
        return value.isSearchable ? sizeScale(5.2) : sizeScale(3.6);
      })
      .attr("fill", "none")
      .attr("stroke", "#f59e0b")
      .attr("stroke-width", sizeScale(0.8))
      .attr("stroke-dasharray", `${sizeScale(1.4)} ${sizeScale(0.9)}`)
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
      .style("pointer-events", "none");

    D3SVG.selectAll(".qr-node-label")
      .data(pathData.filter((item) => getQrForNode(item.id)), (value) => value.id)
      .join("text")
      .attr("class", "qr-node-label")
      .attr("x", (value) =>
        getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          value.coordinates[0],
          value.coordinates[1]
        )[0] + sizeScale(4.2)
      )
      .attr("y", (value) =>
        getRealPointCoordinateRelativeToDigitisationZone(
          digitisationZone,
          currentRotation,
          value.coordinates[0],
          value.coordinates[1]
        )[1] - sizeScale(4.2)
      )
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", `${sizeScale(3.2)}px`)
      .attr("font-weight", "800")
      .attr("fill", "#92400e")
      .attr("stroke", "#fff")
      .attr("stroke-width", sizeScale(0.25))
      .style("pointer-events", "none")
      .text("QR");
  }, [
    isGettingInitialState,
    floorplan,
    digitisationZone,
    currentRotation,
    pathData,
    selectedStartPath,
    selectedEndPath,
    getQrForNode,
  ]);

  // render markers
  React.useEffect(() => {
    if (!isGettingInitialState && markerData && markerData.length > 0) {
      const sizeScale = scaleLinear()
        .domain([0, 100])
        .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
      const D3SVG = select(".floorplan-svg-group");

      const currentZoom = trans?.k || 1;
      const scaledIconSize = currentZoom > 3 ? 12.0 / currentZoom * 3 : 12.0;
      const scaledTextSize = currentZoom > 3 ? 6.5 / currentZoom * 3 : 6.5;
      const scaledIconOffset = scaledIconSize / 2;
      const scaledTextOffset = currentZoom > 3 ? 1.5 / currentZoom * 3 : 1.5;

      D3SVG.selectAll(".map-marker-icon")
        .data(markerData.filter(m => m.type === 'icon'))
        .join("image")
        .attr("class", "map-marker-icon")
        .attr("href", (value) => {
           const iconKey = value.iconType ? value.iconType.toLowerCase() : "toilet";
           return IconMap[iconKey] || IconMap["toilet"];
        })
        .attr("width", sizeScale(scaledIconSize))
        .attr("height", sizeScale(scaledIconSize))
        .attr("x", (value) => getRealPointCoordinateRelativeToDigitisationZone(digitisationZone, currentRotation, value.coordinates[0], value.coordinates[1])[0] - sizeScale(scaledIconOffset))
        .attr("y", (value) => getRealPointCoordinateRelativeToDigitisationZone(digitisationZone, currentRotation, value.coordinates[0], value.coordinates[1])[1] - sizeScale(scaledIconOffset))
        .style("pointer-events", "none");
        
      D3SVG.selectAll(".map-marker-text")
        .data(markerData.filter(m => m.type === 'label' || !m.type))
        .join("text")
        .attr("class", "map-marker-text")
        .attr("x", (value) => getRealPointCoordinateRelativeToDigitisationZone(digitisationZone, currentRotation, value.coordinates[0], value.coordinates[1])[0])
        .attr("y", (value) => getRealPointCoordinateRelativeToDigitisationZone(digitisationZone, currentRotation, value.coordinates[0], value.coordinates[1])[1] + sizeScale(scaledTextOffset))
        .attr("text-anchor", "middle")
        .attr("font-size", `${sizeScale(scaledTextSize)}px`)
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
    markerData,
    trans?.k
  ]);

  React.useEffect(() => {
    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
    const D3SVG = select(".floorplan-svg-group");

    if (!selectedPath || selectedPath.length <= 0) {
      D3SVG.selectAll(".path-line-selected2").remove();
      D3SVG.selectAll(".path-line-selected").remove();
      setSelectPath([]);
      return;
    }

    const coordinatesData = selectedPath.map((item) => {
      const thisPathData = pathData.find((item1) => item1.id === item);
      return getRealPointCoordinateRelativeToDigitisationZone(
        digitisationZone,
        currentRotation,
        thisPathData.coordinates[0],
        thisPathData.coordinates[1]
      );
    });

    setSelectPath(coordinatesData);
    setSlice([]); // reset slice state

    D3SVG.selectAll(".path-line-selected2")
      .data([coordinatesData])
      .join("path")
      .attr("class", "path-line-selected2")
      .attr("stroke", "yellow")
      .attr("stroke-width", sizeScale(2))
      .attr("fill", "transparent")
      .attr("d", (value) => polygonWithRoundedCorners(value, 5));
  }, [
    isGettingInitialState,
    floorplan,
    digitisationZone,
    currentRotation,
    pathData,
    selectedStartPath,
    selectedEndPath,
    selectedPath,
  ]);

  // Effect to handle navigation stepping logic
  React.useEffect(() => {
    if (selectPath.length === 0) return;
    
    const slicedData = selectPath.slice(0, currentIndex + 1);
    const pathString = polygonWithRoundedCorners(slicedData, 5);
    const sizeScale = scaleLinear()
      .domain([0, 100])
      .range([0, (Math.abs(digitisationZone.width) * 10) / 100]);
    const D3SVG = select(".floorplan-svg-group");

    D3SVG.selectAll(".path-line-selected")
      .data([slicedData])
      .join("path")
      .attr("class", "path-line-selected")
      .attr("stroke", "blue")
      .attr("stroke-width", sizeScale(2))
      .attr("fill", "transparent")
      .attr("d", pathString);
  }, [currentIndex, selectPath, digitisationZone, currentRotation]);

  const activeNodeToShow = hoveredNode || selectedNodeDetail;
  const activeNodeQr = activeNodeToShow ? getQrForNode(activeNodeToShow.id) : null;
  
  return(
         <div id="floorplan-container">
       <button 
         style={{
           position: "absolute",
           top: "16px",
           left: "16px",
           zIndex: 10,
           padding: "8px 12px",
           backgroundColor: "#ffffff",
           border: "1px solid #cbd5e1",
           borderRadius: "6px",
           color: "#334155",
           fontSize: "0.85rem",
           fontWeight: "500",
           cursor: "pointer",
           boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
         }}
         onClick={()=>{
            setCurrentIndex((prev)=> prev+1)
            setTrans( prev => {
             return {
             ...prev,
             x: prev?.x - 100,
             y: prev?.y,
             k: prev?.k
             }
            })
            updateLine();
         }}
       >
         next
       </button>
        {activeNodeToShow && (
          <div className="node">
            <div className="node-header">
              <span className="node-header-title">
                {activeNodeToShow.id === selectedNodeDetail?.id ? "Node Details" : "Node Details (Hovered)"}
              </span>
              <button
                type="button"
                className="node-edit-btn"
                onClick={() => setSelectedNodeDetail(null)}
              >
                Close
              </button>
            </div>
            <div className="node-row">
              <strong>ID:</strong>
              <span>{activeNodeToShow.id}</span>
            </div>
            <div className="node-row">
              <strong>Coordinates:</strong>
              <span>{activeNodeToShow.coordinates?.map(c => typeof c === 'number' ? c.toFixed(4) : c).join(", ")}</span>
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
            <div className="node-neighbors">
              <strong>Neighbors:</strong>
              <div className="node-neighbors-list">
                {activeNodeToShow.neighbors?.map((item, index) => (
                  <span key={index} className="node-neighbor-item">{item?.id}</span>
                ))}
              </div>
            </div>
            <div className="node-neighbors" style={{ borderTop: "1px solid #f1f5f9", marginTop: "12px", paddingTop: "12px" }}>
              <strong>QR Code Mapping:</strong>
              {loadingQr ? (
                <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "6px" }}>Checking QR mapping...</div>
              ) : activeNodeQr ? (
                <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "monospace", fontWeight: "bold", color: "#059669", fontSize: "0.8rem" }}>{activeNodeQr.qr_code}</span>
                    <span style={{ fontSize: "0.65rem", backgroundColor: "#fef3c7", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold", color: "#92400e" }}>
                      QR MAPPED
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#475569" }}>
                    <strong>Name: </strong>{activeNodeQr.name}
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                    <button
                      type="button"
                      onClick={() => setShowPreviewQr(activeNodeQr)}
                      style={{ flex: 1, padding: "5px 10px", fontSize: "0.75rem", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", color: "#2563eb", fontWeight: "600", cursor: "pointer" }}
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDetachQr(activeNodeQr.id)}
                      style={{ flex: 1, padding: "5px 10px", fontSize: "0.75rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", color: "#dc2626", fontWeight: "600", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: "8px" }}>
                  <span style={{ color: "#64748b", fontSize: "0.75rem", display: "block", marginBottom: "8px" }}>No QR Code mapped.</span>
                  <button
                    type="button"
                    onClick={() => setShowCreateQrModal(true)}
                    style={{ padding: "8px 12px", fontSize: "0.75rem", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "6px", color: "#059669", fontWeight: "600", width: "100%", cursor: "pointer" }}
                  >
                    Generate QR Code
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {showCreateQrModal && activeNodeToShow && (
          <QRCreateModal
            nodes={pathData}
            prefilledNodeId={activeNodeToShow.id}
            onClose={() => setShowCreateQrModal(false)}
            onSuccess={() => {
              setShowCreateQrModal(false);
              fetchQrLocations();
            }}
          />
        )}

        {showPreviewQr && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1000 }}>
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "16px", maxWidth: "340px", width: "100%", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px", marginBottom: "12px" }}>
                <h4 style={{ margin: 0, fontWeight: "bold", fontSize: "0.9rem", color: "#0f172a" }}>QR Code Preview</h4>
                <button
                  onClick={() => setShowPreviewQr(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#94a3b8", padding: 0, lineHeight: 1 }}
                >
                  &times;
                </button>
              </div>

              <div style={{ border: "1px solid #e2e8f0", padding: "16px", borderRadius: "12px", backgroundColor: "#fff", width: "160px", margin: "0 auto 12px" }}>
                <img
                  src={`http://localhost:8000${showPreviewQr.image_path}`}
                  alt={showPreviewQr.qr_code}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>

              <div>
                <h5 style={{ margin: "4px 0", fontWeight: "bold", color: "#0f172a", fontSize: "0.85rem" }}>{showPreviewQr.name}</h5>
                <p style={{ margin: "4px 0", fontWeight: "bold", color: "#059669", fontSize: "0.75rem", fontFamily: "monospace" }}>{showPreviewQr.qr_code}</p>
                <p style={{ margin: "4px 0", fontSize: "0.7rem", color: "#64748b" }}>
                  Node: {showPreviewQr.node_id} | Type: {showPreviewQr.qr_type}
                </p>
              </div>
            </div>
          </div>
        )}
     </div>
    )
    
}
