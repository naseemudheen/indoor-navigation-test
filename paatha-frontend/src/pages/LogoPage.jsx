import React, { useEffect } from "react";
import logo from "../assets/imgs/paatha-logo.svg";
import { redirect, useNavigate } from "react-router-dom";

const LogoPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/home");
    }, 3000);
  }, []);

  return (
    <div className="w-full h-[100dvh] flex justify-center gap-1  items-center px-24">
      <img src={logo} alt="" />
      <h2 className="justify-end mt-4 text-xs font-semibold text-primary-green">Beta</h2>
    </div>
  );
};

export default LogoPage;
