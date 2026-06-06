import React from "react";
import { NavigateIcon, StepsIcon } from "../../components/Icons";
import { Link } from "react-router-dom";

const StartSection = () => {
  return (
    <div className=" w-full bg-white py-4 px-7 fixed bottom-0 h-auto drop-shadow-[30px_45px_45px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-4">
        <Link to="/navigate">
          <button className="bg-[#29AB87] px-4 py-2 text-white flex items-center gap-2 rounded-full">
            <NavigateIcon />
            Start
          </button>
        </Link>

        <Link to="/directions">
          <button className="rounded-full px-4 py-2 flex items-center gap-2 border border-[#00000066]">
            <StepsIcon />
            Maps
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StartSection;
