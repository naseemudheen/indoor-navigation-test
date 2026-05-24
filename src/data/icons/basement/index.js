import BDoors from "./doors.json";
import BStairs from "./stairs.json";
import BLift from "./lift.json";
import BNurse from "./nurse.json";
import BEnquiry from "./enquiry.json";
import BWards from "./wards.json";
import BLabs from "./lab.json";
import BPharmacy from "./pharmacy.json";
import BEntry from "./entry.json";

export { BDoors, BStairs, BLift, BNurse, BEnquiry, BWards, BLabs, BPharmacy, BEntry };

const apiConstant={
    getUser:'/user'
}

const getProduct =(id)=> {
    const config ={
        method: 'GET',
        url: apiConstant.getProduct+id
    }
    return axios(config)
}



export const getUser = ()=>{
    const config ={
        method: 'GET',
        url: apiConstant.getUser,
    }
    return axios(config)
}