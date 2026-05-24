import React from "react";
import { ChevronDown, ChevronUp } from "../../components/Icons";
import { IoCloseOutline } from "react-icons/io5";
import { FaWalking } from "react-icons/fa";
import { Link } from "react-router-dom";

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 h-auto w-full flex flex-col gap-4 items-end">
      <div className="divide-y flex flex-col w-fit mr-4">
        <button className="rounded-t-[20px] bg-[#29AB87] py-4 px-3">
          <ChevronUp className=" h-6" />
        </button>
        <button className="rounded-b-[20px] bg-[#29AB87] py-4 px-3">
          <ChevronDown className=" h-6" />
        </button>
      </div>
      <div className=" w-full bg-white py-2 px-3 flex gap-3 items-center drop-shadow-md justify-between">
        <div>
          <h4 className="text-[#E97E00] font-semibold text-[20px]">Ward 5</h4>
          <p className="text-[#00000099] font-semibold">
            2 minutes <span className="font-medium">(30 mtr)</span>
          </p>
          <p className="flex items-center text-xs text-[#00000066]">
            In every turning press the
            <span className="divide-y flex flex-col w-fit rotate-90 mx-3">
              <div className="rounded-t-lg bg-[#29AB87] py-1 px-1">
                <ChevronUp className="w-2 h-2" />
              </div>
              <div className="rounded-b-lg bg-[#29AB87] py-1 px-1">
                <ChevronDown className="w-2 h-2" />
              </div>
            </span>
            button
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#EAF7F3] flex justify-center items-center rounded-full w-fit">
            <FaWalking className="text-[#29AB87] w-6 h-6" />
          </div>
          <Link to="/home">
            <div className="p-2 border border-[#0000001A] flex justify-center items-center rounded-full w-fit">
              <IoCloseOutline className="w-8 h-8" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
