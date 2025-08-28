import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const MyAppointments = () => {
  const { backendURL, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


  const [userId, setUserId] = useState(null);


  useEffect(() => {
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
          console.log("Token has expired.");
          // You might want to log the user out here
          setUserId(null);
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      // This can happen if the token is malformed or invalid
    }

    console.log("User ID from token:", userId);
  }, []);

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_'); // FIX 1: Split by underscore
    // FIX 2: Subtract 1 from the month for correct array index
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
  };
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/user/appointments`,
        { // The config object is the second argument
          headers: { token }
        }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt='' />
            </div>

            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.specialization}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div>
            </div>

            <div className='flex flex-col gap-2 justify-end'>
              <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border-rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>
              <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border-rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}

export default MyAppointments
