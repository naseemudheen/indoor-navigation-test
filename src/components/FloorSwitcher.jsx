import React, { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { IoCaretUp, IoCaretDown } from "react-icons/io5";
import { Navigation } from "swiper/modules";

const FloorSwitcher = memo(
  ({ activeIndex, floorFunction, bottomSpace = "bottom-[15vh]" }) => {
    console.log(activeIndex);

    return (
      <div
        className={`w-fit bg-white rounded-[16px] flex flex-col items-center fixed ${bottomSpace} shadow-[0_2px_3px_1px_rgba(0,0,0,0.3)] left-[1rem] lg:left-[25rem] `}
      >
        <div
          className={`px-3 py-1 hover:bg-[#29ab8665] text-[#000000b6] rounded-t-[16px] w-full text-center h-full flex justify-center floor-prev`}
        >
          <IoCaretUp />
        </div>
        <Swiper
          slidesPerView={3}
          direction={"vertical"}
          slideToClickedSlide={true}
          initialSlide={activeIndex}
          className="mySwiper h-[100px]"
          modules={[Navigation]}
          navigation={{
            nextEl: ".floor-next",
            prevEl: ".floor-prev",
          }}
        >
          <SwiperSlide>
            <div
              className={`${
                activeIndex === -1 && "bg-[#29AB87]"
              } px-3 py-2  w-full text-center h-full flex justify-center items-center`}
            >
              <p
                className={` ${
                  activeIndex === -1 ? "text-[#ffffff]" : "text-[#00000033]"
                }`}
                onClick={() => floorFunction(-1)}
              >
                B
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className={`${
                activeIndex === 0 && "bg-[#29AB87]"
              } px-3 py-2 text-center h-full flex justify-center items-center`}
            >
              <p
                className={` ${
                  activeIndex === 0 ? "text-[#ffffff]" : "text-[#00000033]"
                }`}
                onClick={() => floorFunction(0)}
              >
                G
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className={`${
                activeIndex === 1 && "bg-[#29AB87]"
              } px-3 py-2 w-full text-center h-full flex justify-center items-center`}
            >
              <p
                className={` ${
                  activeIndex === 1 ? "text-[#ffffff]" : "text-[#00000033]"
                }`}
                onClick={() => floorFunction(1)}
              >
                1
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className={`${
                activeIndex === 2 && "bg-[#29AB87]"
              } px-3 py-2  w-full text-center h-full flex justify-center items-center`}
            >
              <p
                className={` ${
                  activeIndex === 2 ? "text-[#fff]" : "text-[#00000033]"
                }`}
                onClick={() => floorFunction(2)}
              >
                2
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className={`${
                activeIndex === 3 && "bg-[#29AB87]"
              } px-3 py-2  w-full text-center h-full flex justify-center items-center`}
            >
              <p
                className={` ${
                  activeIndex === 3 ? "text-[#fff]" : "text-[#00000033]"
                }`}
                onClick={() => floorFunction("C1")}
              >
                C1
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className={`${
                activeIndex === 4 && "bg-[#29AB87]"
              } px-3 py-2  w-full text-center h-full flex justify-center items-center`}
            >
              <p
                className={` ${
                  activeIndex === 4 ? "text-[#fff]" : "text-[#00000033]"
                }`}
                onClick={() => floorFunction("C2")}
              >
                C2
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className={`${
                activeIndex === 5 && "bg-[#29AB87]"
              } px-3 py-2  w-full text-center h-full flex justify-center items-center`}
            >
              <p
                className={` ${
                  activeIndex === 5 ? "text-[#fff]" : "text-[#00000033]"
                }`}
                onClick={() => floorFunction("C3")}
              >
                C3
              </p>
            </div>
          </SwiperSlide>
        </Swiper>

        {/* <hr className=" w-full bg-[#00000033]" /> */}

        {/* <hr className=" w-full bg-[#00000033]" /> */}

        {/* <hr className=" w-full bg-[#00000033]" /> */}
        <div
          className={`px-3 py-1 hover:bg-[#29ab8665] text-[#000000b6] rounded-b-[16px] w-full text-center h-full flex justify-center floor-next`}
        >
          <IoCaretDown />
        </div>
      </div>
    );
  },
);

export default FloorSwitcher;
