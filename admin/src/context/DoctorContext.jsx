import axios from "axios";
import { createContext, useState, useMemo } from "react";
import { toast } from "react-toastify";

// Named export with correct spelling
export const DoctorContext = createContext({ dToken: "", setDToken: () => {}, backendUrl: "" }); // safe default [9]

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Vite env usage [10]
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
 
  const [appointments, setAppointments] = useState([])

  const getAppointments = async ()=>{
    try {
        
        const {data} = await axios.get(backendUrl + '/api/doctor/appointments',{headers:{dToken}})
        if (data.success) {
            setAppointments(data.appointments.reverse())
            console.log(data.appointments.reverse())
            
        }else{
            toast.error(data.message)
        }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
  }
  const value = useMemo(
    () => ({
      dToken,
      setDToken,
      backendUrl,
      appointments,setAppointments,
      getAppointments
    }),
    [dToken, backendUrl]
  );

  return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};

export default DoctorContextProvider;
