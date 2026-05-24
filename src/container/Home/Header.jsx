import React, { useState, useEffect } from "react";
import { ClockIcon, MicIcon, SearchIcon } from "../../components/Icons";
import xray from "../../assets/imgs/radiation.png";
import medicine from "../../assets/imgs/medicine.png";
import water from "../../assets/imgs/water.png";
import blood from "../../assets/imgs/blood.png";
import mainEntry from "../../components/home-entrance.svg";
import canteenIcon from "../../components/home-canteen.svg";
import bloodIconSvg from "../../components/home-blood.svg";
import counterIcon from "../../components/home-counter.svg";
import { Link, useNavigate } from "react-router-dom";
import { featuredRooms } from "../../constants/FeaturedRooms";
import { MdLocationPin, MdNorthWest } from "react-icons/md";
import { mergedData } from "../../constants/floors";

const Header = () => {
  const navigate = useNavigate();
  const [endSearch, setEndSearch] = useState("");
  const CollegePath = mergedData;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const handleSearchChange = (e) => {
    setEndSearch(e.target.value);
    const filtered = CollegePath.filter((item) =>
      item.name?.toLowerCase().includes(e.target.value?.toLowerCase()),
    );
    console.log(filtered);
    setFilteredData(filtered);
    if (filtered.length > 0) {
      setIsDialogOpen(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredData.length > 0) {
      setIsDialogOpen(false);
      navigate("/directions", { state: { endPoint: filteredData[0] } });
    }
  };
  const mainEntrance = {
    id: "path-100",
    coordinates: [0.5670515808175712, 0.6084043500031802],
    neighbors: [
      {
        id: "path-101",
        coordinates: [0.5670515808175712, 0.5731992050356922],
        distance: 0.035205144967487945,
      },
    ],
    name: "MAIN ENTRY/EXIT",
    floor: 0,
  };
  const insuranceCounter = {
    id: "path-153",
    coordinates: [0.7499122450583777, 0.5108118978773776],
    neighbors: [
      {
        id: "path-149",
        coordinates: [0.7389611324748908, 0.5109441375221211],
        distance: 0.01095191098118713,
        isParent: true,
      },
    ],
    name: "INSURANCE COUNTER",
    floor: 0,
  };

  const getRoomIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("entrance") || lowerName.includes("entry")) return mainEntry;
    if (lowerName.includes("canteen")) return canteenIcon;
    if (lowerName.includes("blood")) return bloodIconSvg;
    if (lowerName.includes("counter")) return counterIcon;
    return xray;
  };

  return (
    <div className="fixed top-0 z-50 w-full max-w-3xl pt-4">
      <div className="relative flex items-center mx-4">
        <input
          type="text"
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setEndSearch("");
            // setFilteredData([])
          }}
          placeholder="Where to go ?"
          className="w-full h-[45px] px-5 py-4 outline-none rounded-full text-sm placeholder:font-medium shadow-[0_2px_3px_1px_rgba(0,0,0,0.3)]"
        />
        <SearchIcon className="absolute z-20 right-3" />
      </div>

      {isDialogOpen && (
        <div className="w-full h-screen" onClick={() => setIsDialogOpen(false)}>
          {filteredData.length > 0 ? (
            <div
              className="mx-4 rounded-[10px] z-50 relative overflow-y-scroll h-auto shadow-[0_2px_3px_1px_rgba(0,0,0,0.3)] mt-1 px-2 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredData?.map((item, index) => (
                <Link
                  to="/directions"
                  state={{ endPoint: item }}
                  className="z-50"
                >
                  <div
                    className="flex items-center w-full gap-6 px-2 bg-white"
                    key={index}
                  >
                    <div className="p-2 rounded-full bg-[#D9D9D9B2] flex justify-center items-center">
                      <MdLocationPin />
                    </div>
                    <div className="flex flex-col border-b-[0.5px] border-[#0000004D] w-full py-2 font-semibold relative">
                      <h3 className="text-[#000000B2]">{item.name}</h3>
                      <p className="text-[#00000080] text-xs">
                        {(item.floor === 0 && "Ground") ||
                          (item.floor === -1 && "UnderGround") ||
                          (item.floor === 1 && "1st") ||
                          (item.floor === 2 && "2nd")}{" "}
                        Floor
                      </p>
                      <MdNorthWest className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mx-4 rounded-[10px] z-50 relative overflow-auto h-[20vh] shadow-[0_2px_3px_1px_rgba(0,0,0,0.3)] mt-1 px-2 bg-white">
              <div className="flex items-center justify-center w-full h-full gap-6 px-2 bg-white">
                <div className="flex flex-col items-center justify-center w-full h-full py-2 font-semibold">
                  <h3 className="text-[#000000B2]">No results found</h3>
                  <p className="text-[#00000080] text-xs">
                    Please try searching with different keywords
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex gap-3 py-1 pl-4 mt-3 overflow-x-auto scrollbar-hide">
        {featuredRooms?.map((item, index) => (
          <Link to={"/directions"} state={{ endPoint: item }} key={index}>
            <div className="bg-white rounded-full py-1 px-4 flex gap-2 items-center shadow-[0_1px_2px_1px_rgba(0,0,0,0.3)] min-w-max w-max">
              <img src={getRoomIcon(item.name)} alt="" className="w-5 h-5 object-contain" />
              <p className="text-[14px]">{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Header;
