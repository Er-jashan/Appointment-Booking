import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import {useNavigate} from 'react-router-dom'

const MyAppointments = () => {
  const { backendURL, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  
  const [userId, setUserId] = useState(null);
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const navigate = useNavigate()
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_'); // FIX 1: Split by underscore
    // FIX 2: Subtract 1 from the month for correct array index
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
  };

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
          // console.log("Token has expired.");
          // You might want to log the user out here
          setUserId(null);
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      // This can happen if the token is malformed or invalid
    }

    // console.log("User ID from token:", userId);
  }, []);


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
        // console.log(data.appointments);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      // console.log(appointmentId)
      const { data } = await axios.post(
        backendURL + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      );
      // console.log(data.success)
      if (data && data.success) {
        toast.success(data.message);
        // console.log("succ");
        getUserAppointments();
        getDoctorsData();
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const initPay = (order)=>{
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name:'Appointment Payment',
      description:'Appointment Payment',
      order_id:order.id,
      receipt:order.receipt,
      handler: async (response) => {
        try {
          const {data} = await axios.post(backendURL+'/api/user/verifyRazorpay',response,{headers:{token}})
          if (data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  //payment section
  const appointmentRazorpay = async (appointmentId)=>{
    try {
      const {data} = await axios.post(backendURL+'/api/user/payment-razorpay',{appointmentId},{headers:{token}})

      if (data.success) {
        initPay(data.order)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])


  // Sort appointments: active first, then cancelled/completed
  const sortedAppointments = [...appointments].sort((a, b) => {
    const aInactive = a.cancelled || a.isCompleted;
    const bInactive = b.cancelled || b.isCompleted;
    if (aInactive === bInactive) return 0;
    return aInactive ? 1 : -1;
  });

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {sortedAppointments.map((item, index) => (
          <div className={`grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 rounded-xl p-2 mb-3 border-b border-l shadow-xl ${item.cancelled && !item.payment?'bg-red-100':''} ${item.isCompleted ?'bg-green-100':''}`} key={index}>
            <div>
              <img className={`w-32  rounded-md ${item.cancelled || item.isCompleted ?'filter grayscale':''}`} src={item.docData.image} alt='' />
            </div>
            <div className='flex-1 text-sm text-zinc-600 '>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.specialization}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-center items-center'>
              {!item.cancelAppointment && item.payment && !item.isCompleted && <button className='text-green-600 py-2 sm:min-w-48'>Fee Paid</button>}
              {item.cancelled && !item.isCompleted &&<p className='filter-none text-red-400 pr-16'> Cancelled !</p>}
              {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-primary text-center sm:min-w-48 py-2 border border-primary rounded-md hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
              {!item.cancelled && !item.isCompleted &&<button onClick={()=>cancelAppointment(item._id)} className='text-sm text-red-500 text-center sm:min-w-48 py-2 border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300'>Cancel Appointment</button>}
              {item.isCompleted && <p className='text-green-500 pr-16'>Completed</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
