import React from "react";
import PropTypes from "prop-types";
import { ArrowUp } from "../../components/Icons";

const TopNavigationSection = ({ message, currentFloor }) => {
  return (
    <div className="fixed max-w-3xl top-0 w-full h-auto bg-white flex gap-3 items-center px-5 py-3 rounded-b-[20px] drop-shadow-md">
      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex items-center gap-3">
          <div className="p-4 bg-[#DFF2ED] rounded-full w-fit">
            <ArrowUp
              className={`
              ${message === "Turn slightly right" ? "rotate-45" : message === "Turn slightly left" ? "-rotate-45" : message === "Turn right" ? "rotate-90" : message === "Turn left" ? "-rotate-90" : ""}
              `}
            />
          </div>
          <div>
            <h2 className="text-[#000000B2] font-bold">{message}</h2>
            {/* <p className='text-[#00000080] text-sm font-semibold'>Pass By Blood Bank(On The Left)</p> */}
          </div>
        </div>
        {/* <div className='bg-[#DFF2ED] text-[#29AB87] font-semibold text-xl p-3 px-4 rounded-full'>
          {currentFloor}
        </div> */}
      </div>
    </div>
  );
};
TopNavigationSection.propTypes = {
  message: PropTypes.string.isRequired,
  currentFloor: PropTypes.string,
};

export default TopNavigationSection;
