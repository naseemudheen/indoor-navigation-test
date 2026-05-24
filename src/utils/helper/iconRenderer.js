import { select } from "d3";
import { getRealPointCoordinateRelativeToDigitisationZone } from "../../utils";

export const createIconUnits = (
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
        d.coordinates[0] - 0.002,
        d.coordinates[1] - 0.002,
        // d.coordinates[0] - 0.003,
        // d.coordinates[1] - 0.002
      );
      group
        .attr("transform", `translate(${x}, ${y})`)
        .append("image")
        .attr("xlink:href", icon)
        .attr("width", 40)
        .attr("height", 40);
    });
};
