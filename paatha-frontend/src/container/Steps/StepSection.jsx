import React from "react";
import {
  ArrowUp,
  LeftArrowSteps,
  Location,
  RightArrow,
  Stairs,
} from "../../components/Icons";

const StepSection = () => {
  return (
    <div className="flex flex-col pl-1 pr-5">
      <div className="w-full flex items-center ">
        <div className="p-5">
          <ArrowUp />
        </div>
        <div className="flex flex-col border-b-[0.5px] border-[#0000004D] w-full py-4 font-semibold">
          <h3 className="text-[#000000B2]">Go Straight</h3>
          <p className="text-[#00000080] text-xs">
            Pass By Blood Bank(On The Left)
          </p>
        </div>
      </div>
      <div className="w-full flex items-center ">
        <div className="p-5">
          <Stairs />
        </div>
        <div className="flex flex-col border-b-[0.5px] border-[#0000004D] w-full py-4 font-semibold">
          <h3 className="text-[#000000B2]">Take Stairs</h3>
          <p className="text-[#00000080] text-xs">Opposite Room No 104</p>
        </div>
      </div>
      <div className="w-full flex items-center ">
        <div className="p-5">
          <RightArrow />
        </div>
        <div className="flex flex-col border-b-[0.5px] border-[#0000004D] w-full py-4 font-semibold">
          <h3 className="text-[#000000B2]">Take Right</h3>
          <p className="text-[#00000080] text-xs">Opposite Of ICU</p>
        </div>
      </div>
      <div className="w-full flex items-center ">
        <div className="p-5">
          <ArrowUp />
        </div>
        <div className="flex flex-col border-b-[0.5px] border-[#0000004D] w-full py-4 font-semibold">
          <h3 className="text-[#000000B2]">Go Straight</h3>
          <p className="text-[#00000080] text-xs">
            Pass By Blood Bank(On The Left)
          </p>
        </div>
      </div>
      <div className="w-full flex items-center ">
        <div className="p-4">
          <Location />
        </div>
        <div className="flex flex-col border-b-[0.5px] border-[#0000004D] w-full py-5 font-semibold">
          <h3 className="text-[#000000B2]">Ward 5</h3>
        </div>
      </div>
    </div>
  );
};

export default StepSection;
