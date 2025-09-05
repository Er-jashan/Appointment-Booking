import axios from "axios";
import { createContext, useState, useMemo } from "react";
import { toast } from "react-toastify";

// Named export with correct spelling
export const DoctorContext = createContext({ dToken: "", setDToken: () => { }, backendUrl: "" }); // safe default [9]

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Vite env usage [10]
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState({})
  const [profileData, setProfileData] = useState(false)

  const getAppointments = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })
      if (data.success) {
        setAppointments(data.appointments.reverse())

      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, { appointmentId }, { headers: { dToken } })
      if (data.success) {
        toast.success(data.message);
        getAppointments()
      } else {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error(error.message);

    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, { appointmentId }, { headers: { dToken } });
      if (data.success) {
        toast.success(data.message);
        getAppointments()
      } else {
        toast.error(error.message)
      }

    } catch (error) {
      toast.error(error.message);
    }
  }
  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, { headers: { dToken } });
      if (data.success) {
        setDashData(data.dashData)
        toast.success(data.message);
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, { headers: { dToken } });
      if (data.success) {
        setProfileData(data.profileData)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const value = useMemo(
    () => ({
      dToken,
      setDToken,
      backendUrl,
      appointments,
      setAppointments,
      getAppointments,
      completeAppointment,
      cancelAppointment,
      dashData, getDashData,
      profileData,setProfileData,
      getProfileData
    }),
    [dToken, backendUrl, appointments, dashData, profileData]
  );

  return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};

export default DoctorContextProvider;
