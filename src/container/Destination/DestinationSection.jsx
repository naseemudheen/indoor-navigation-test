import React, { useEffect, useState } from "react";
import {
  Bidirectional,
  DottedLine,
  LeftArrow,
  Location,
  StretcherIcon,
} from "../../components/Icons";
import walk from "../../assets/imgs/walking.png";
import stretcher from "../../assets/imgs/stretcher.png";
import { Link } from "react-router-dom";
import { FaWalking } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";

const DestinationSection = ({
  onClose,
  onSearchChange,
  startPoint,
  endPoint,
  searchStartQuery,
  searchEndQuery,
  onEndSearchChange,
  setStartPoint,
  setEndPoint,
  setPointSwapped,
  onStartSearchEnter,
  onEndSearchEnter,
  activeField,
  onFocusOrigin,
  onFocusDestination,
  destinationRef,
}) => {
  const [childToggle, setChildToggle] = useState(false);
  const [walkmode, setWalkmode] = useState(true);
  const [startInputValue, setStartInputValue] = useState("");
  const [endInputValue, setEndInputValue] = useState("");
  const [rotate, setRotate] = useState(false);

  const handleClose = () => {
    setChildToggle(!childToggle);
    onClose(true);
  };
  const handleBlur = () => {
    setChildToggle(false);
    // onClose(false)
  };
  const handleChange = (e) => {
    const query = e.target.value;
    setStartInputValue(query);
    onSearchChange(query);
  };
  const handleEndChange = (e) => {
    const query = e.target.value;
    setEndInputValue(query);
    onEndSearchChange(query);
  };

  const handleClearStart = () => {
    setStartInputValue("");
    onSearchChange("");
    setStartPoint(null);
  };

  const handleClearEnd = () => {
    setEndInputValue("");
    onEndSearchChange("");
    setEndPoint(null);
  };

  const handleBidirectional = () => {
    setRotate(!rotate);
    setStartInputValue(endPoint?.name || "");
    setEndInputValue(startPoint?.name || "");
    // setStartPoint(endPoint);
    // setEndPoint(startPoint);
    // onSearchChange(endPoint?.name || "");
    // onEndSearchChange(startPoint?.name || "");
    setPointSwapped(true);
  };
  useEffect(() => {
    setStartInputValue(startPoint?.name || "");
    setEndInputValue(endPoint?.name || "");
  }, [startPoint, endPoint]);

  return (
    <div className="bg-white h-auto w-full pt-5 pb-2 px-4 absolute top-0  z-50">
      <div className="flex items-center gap-4 mb-5">
        <Link to="/home" onClick={onClose}>
          <LeftArrow className="self-start h-full" />
        </Link>

        <h2 className="font-semibold">Find Destination</h2>
      </div>
      <div className="flex items-center gap-4 justify-center">
        <div className="flex flex-col items-center ">
          <div className="h-[45.6px] flex justify-center items-center">
            <div className="bg-[#1BBC7933] w-[20px] h-[20px] flex justify-center items-center rounded-full">
              <div className="bg-[#29AB87] w-[12px] h-[12px] rounded-full"></div>
            </div>
          </div>
          <DottedLine />
          <Location className="h-[45.6px]" />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="relative w-full">
            <input
              type="text"
              onClick={handleClose}
              onFocus={onFocusOrigin}
              value={startInputValue}
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={onStartSearchEnter}
              placeholder="Choose Starting"
              className={`py-3 pl-5 pr-10 outline-none w-full border rounded-[10px] text-sm transition-all duration-200 ${
                activeField === "origin"
                  ? "border-[#2A9D8F] border-2 shadow-[0_0_0_1px_#2A9D8F]"
                  : "border-[#DAE1E3]"
              }`}
            />
            {startInputValue && (
              <IoCloseCircle
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 text-lg"
                onClick={handleClearStart}
              />
            )}
          </div>
          <div className="relative w-full">
            <input
              type="text"
              ref={destinationRef}
              onClick={handleClose}
              onFocus={onFocusDestination}
              value={endInputValue}
              onBlur={handleBlur}
              onChange={handleEndChange}
              onKeyDown={onEndSearchEnter}
              placeholder="Choose Destination"
              className={`py-3 pl-5 pr-10 outline-none w-full border rounded-[10px] text-sm transition-all duration-200 ${
                activeField === "destination"
                  ? "border-[#2A9D8F] border-2 shadow-[0_0_0_1px_#2A9D8F]"
                  : "border-[#DAE1E3]"
              }`}
            />
            {endInputValue && (
              <IoCloseCircle
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 text-lg"
                onClick={handleClearEnd}
              />
            )}
          </div>
        </div>
        {/* <Bidirectional onClick={handleBidirectional} className={`${rotate ? '-scale-x-100' : ''} cursor-pointer`} /> */}
      </div>
      {/* <div className='flex items-center gap-4 mt-3 pl-9'>
              <div className={` ${walkmode ? 'bg-[#DAE1E366]':''} px-[12px] py-[2px] gap-2 flex items-center rounded-full w-fit`} onClick={()=> setWalkmode(!walkmode)}>
                 <FaWalking className={`${walkmode ? 'text-[#000000c1]':'text-[#00000099]'}`}/>
                  <p className={` ${walkmode ? 'fill-[#000000c1]':'fill-[#00000099]'} font-medium`}>Walk</p>
              </div>
              <div className={`${!walkmode ? ' bg-[#DAE1E366]':''} px-[12px] py-[2px] gap-2 flex items-center rounded-full w-fit`} onClick={()=> setWalkmode(!walkmode)}>
                  <StretcherIcon className={`${!walkmode ? 'fill-[#000000c1]':'fill-[#00000099]'} w-5 h-5`}/>
                  <p className={`${!walkmode ? 'text-[#000000c1]':'text-[#00000099]'} font-medium`}>Stretcher</p>
              </div>
          </div> */}
    </div>
  );
};

export default DestinationSection;
