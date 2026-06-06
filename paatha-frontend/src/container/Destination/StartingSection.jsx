import React, { useState } from "react";
import { DirectIcon, NavigateIcon, StepsIcon } from "../../components/Icons";
import { Link } from "react-router-dom";
import dijkstrajs from "dijkstrajs";
import { CollegePath } from "../../data";
import { setFloor } from "../../redux/mapSlice";
import { useDispatch } from "react-redux";

const StartingSection = ({
  startPoint,
  endPoint,
  finalpath,
  stair,
  otherStart,
  distance,
}) => {
  const [selectedpath, setSelectedPath] = useState([]);
  const dispatch = useDispatch();
  console.log(endPoint);
  
  function findPath() {
    dispatch(setFloor(startPoint?.floor));
    const simplifiedPathData = {};
    CollegePath.forEach((item) => {
      simplifiedPathData[item.id] = {};
      item.neighbors.forEach((item1) => {
        simplifiedPathData[item.id][item1.id] = item1.distance;
      });
    });

    // console.log(JSON.stringify(simplifiedPathData), JSON.stringify(pathData));

    const result = dijkstrajs.find_path(
      simplifiedPathData,
      startPoint,
      endPoint,
    );
    setSelectedPath(result);
  }
  return (
    <div className="fixed bottom-0 flex flex-col items-end justify-end w-full h-auto gap-4 ">
      {/* <div className='bg-[#29AB87] p-4 flex justify-center items-center w-fit rounded-[20px]  drop-shadow-lg mr-4'>
            <DirectIcon/>
        </div> */}
      <div className="w-full py-2 bg-white px-7">
        <h4 className="text-[#E97E00] font-semibold text-[20px]">
          {endPoint?.name} ({(endPoint.floor === 0 && "Ground Floor") ||
                      (endPoint.floor === -1 && "UnderGround Floor") ||
                      (endPoint.floor === 1 && "1st Floor") ||
                      (endPoint.floor === 2 && "2nd Floor") ||
                      (endPoint.floor == "C1" && "Cancer First Floor ") ||
                      (endPoint.floor == "C2" && "Cancer Second Floor") ||
                      (endPoint.floor == "C3" && "Cancer Third Floor")})
        </h4>
        <p className="text-[#00000099] font-semibold">
          {Math.floor(Math.floor(distance) / 82)} minutes{" "}
          <span className="font-medium">({Math.floor(distance) || 0} mtr)</span>
        </p>
        <div className="flex items-center gap-4 mt-4">
          <Link
            to="/navigate"
            state={{
              path: finalpath,
              startPoint,
              endPoint,
              stair,
              otherStart,
              distance,
            }}
          >
            <button
              onClick={findPath}
              className="bg-[#29AB87] px-4 py-2 text-white flex items-center gap-2 rounded-full"
            >
              <NavigateIcon />
              Start
            </button>
          </Link>
          {/* <Link to='/steps'>
               <button className='rounded-full px-4 py-2 flex items-center gap-2 border border-[#00000066]'>
                <StepsIcon/>
                Steps</button>
               </Link> */}
        </div>
      </div>
    </div>
  );
};

export default StartingSection;
