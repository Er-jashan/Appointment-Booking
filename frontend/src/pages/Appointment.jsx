import React, { useContext, useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctor from "../components/RelatedDoctor";
import {toast} from 'react-toastify'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol,backendURL, token , getDoctorsData } = useContext(AppContext);
  const daysOfWeeks = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  
    const [userId, setUserId] = useState(null);
  
  
    useEffect(()=>{
     try {
      // 1. Retrieve the token from localStorage
      const token = localStorage.getItem('token');
  
      if (token) {
        // 2. Decode the token
        const decodedToken = jwtDecode(token);
  
        // 3. Extract the user ID. 
        //    Check your backend JWT creation logic for the exact key.
        //    Common keys are 'id', '_id', 'userId', or 'sub'.
        setUserId(decodedToken.id);
  
  
        // Optional: Check if the token is expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // console.log("Token has expired.");
          // You might want to log the user out here
          setUserId(null);  
        }
      }
    } catch (error) {
      // console.error("Error decoding token:", error);
      // This can happen if the token is malformed or invalid
    }
  
    //  console.log("User ID from token:", userId);
    },[]);

  // Fetch selected doctor's info
  const fetchDocInfo = () => {
    const foundDoc = doctors.find((doc) => doc._id === docId);
    setDocInfo(foundDoc || null);
  };

  // Generate available slots for next 7 days
  const getAvailableSlots = () => {
    const slotsByDay = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // End time = 9:00 PM
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        // Today: start from next available slot
        let now = new Date();
        let minutes = now.getMinutes();
        now.setMinutes(minutes < 30 ? 30 : 0);
        if (minutes >= 30) now.setHours(now.getHours() + 1);
        now.setSeconds(0, 0);
        currentDate = now;
      } else {
        // Future days start at 10 AM
        currentDate.setHours(10, 0, 0, 0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate()
        let month = currentDate.getMonth()+1;
        let year = currentDate.getFullYear()

        const slotDate =  day+"_" +month+"_"+year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if(isSlotAvailable){
          timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime,
        });
        }
       

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slotsByDay.push(timeSlots);
    }

    setDocSlots(slotsByDay);
  };

  const bookAppointment = async ()=>{
    if(!token){
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    try {
      const date = docSlots[slotIndex][0].dateTime
      let day = date.getDate()
      let month = date.getMonth()+1;
      let year = date.getFullYear()

      const slotDate = day + "_" +month+"_"+year
      
      const { data } = await axios.post(backendURL + '/api/user/book-appointment',{docId, slotDate, slotTime},{headers:{token}})

      if(data.success){
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')

      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      // console.log(error)
      toast.error(data.message)
      
    }

  }

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        {/* Doctor details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:max-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.specialization}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="Info" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
            </div>

            <p>
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
            {
              !docInfo.availability ? <p className="text-red-400 mt-3">Doctor Unavailable !</p> : <p></p>
            }
          </div>
        </div>

        {/* Day selector */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots.map((daySlots, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSlotIndex(index);
                    setSlotTime("");
                  }}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index ? "bg-primary text-white" : "border border-gray-200"
                  }`}
                >
                  <p>{daySlots[0] && daysOfWeeks[daySlots[0].dateTime.getDay()]}</p>
                  <p>{daySlots[0] && daySlots[0].dateTime.getDate()}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Time slot selector */}
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots[slotIndex]?.map((slot, index) => (
            <p
              key={index}
              onClick={() => setSlotTime(slot.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                slot.time === slotTime
                  ? "bg-primary text-white"
                  : "text-gray-400 border border-gray-300"
              }`}
            >
              {slot.time.toLowerCase()}
            </p>
          ))}
        </div>

        {/* Book button */}
        {docInfo.availability ? slotTime && (
          <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">
            Book an appointment
          </button>)
          :<button  className="bg-gray-700 text-white text-sm font-light px-14 py-3 rounded-full my-6">
            Unavailable
          </button>
        }

        {/* Related Doctor component */}
        <RelatedDoctor docId={docId} specialization={docInfo.specialization} />
      </div>
    )
  );
};

export default Appointment;
