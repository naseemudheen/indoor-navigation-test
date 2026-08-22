import React from "react";
import { Outlet } from "react-router-dom";

const MobileLayout = () => {
  return (
    <div className="mx-auto w-full max-w-3xl h-screen">
      <Outlet />
    </div>
  );
};

export default MobileLayout;
