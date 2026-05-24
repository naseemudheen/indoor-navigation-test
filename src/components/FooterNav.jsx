import React from "react";
import { HelpIcon, HomeIcon } from "./Icons";
import { useLocation, Link } from "react-router-dom";
import { MdLocationPin } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";

const FooterNav = () => {
  const location = useLocation();
  return (
    <nav className="max-w-3xl w-full h-auto bg-[#ffffff] shadow-[0_5px_5px_5px_rgba(0,0,0,0.3)] lg:shadow-none flex justify-around items-center fixed bottom-0 px-6 py-3">
      {/* <Link to="/help" className={`text-2xl flex flex-col items-center w-[90px] ${location.pathname==='/help'&&'border-t-[3px] border-[#29ab87]'} h-full justify-center`}>
                  <HelpIcon className={`${location.pathname==='/help'&&'fill-[#29AB87]'}`}/>
                  <h3 className={`font-semibold text-sm ${location.pathname==='/help'?'text-[#29AB87] font-bold':'text-[#00000080]'}`}>Help</h3>
              </Link> */}
      <Link
        to="/home"
        className={`flex flex-col justify-center items-center h-full text-2xl w-[90px]`}
      >
        <div
          className={`${
            location.pathname === "/home" && "bg-gray-300 rounded-full px-4"
          }`}
        >
          <MdLocationPin
            className={`${
              location.pathname === "/home"
                ? "fill-[#29AB87]"
                : "fill-[#10182080]"
            }`}
          />
        </div>
        <h3
          className={`font-semibold text-sm ${
            location.pathname === "/home"
              ? "text-[#29AB87] font-bold"
              : "text-[#00000080]"
          }`}
        >
          Map
        </h3>
      </Link>
      <Link
        to="/help"
        className={`flex flex-col justify-center items-center h-full text-2xl w-[90px]`}
      >
        <div
          className={`${
            location.pathname === "/help" &&
            "bg-gray-300 rounded-full px-4 py-[2px]"
          }`}
        >
          <BsQuestionCircle
            className={`${
              location.pathname === "/help"
                ? "fill-[#29AB87]"
                : "fill-[#10182080]"
            }`}
          />
        </div>

        <h3
          className={`font-semibold text-sm ${
            location.pathname === "/help"
              ? "text-[#29AB87] font-bold"
              : "text-[#00000080]"
          }`}
        >
          Help
        </h3>
      </Link>
    </nav>
  );
};

export default FooterNav;
