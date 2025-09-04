import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  if (!dashData) return <div>Loading dashboard...</div>;

  return (
    <div className='m-5'>
      <div className='flex flex-wrap gap-5'>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 border-2 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="Doctors" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.doctors}</p>
            <p className='text-sm text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 border-2 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="Patients" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.patients}</p>
            <p className='text-sm text-gray-400'>Patients</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 border-2 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="Appointments" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.appointments}</p>
            <p className='text-sm text-gray-400'>Appointments</p>
          </div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-500'>
          <img src={assets.list_icon} alt="list" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0 border-gray-500'>{
          (Array.isArray(dashData.latestAppointments) ? dashData.latestAppointments : []).map((item, index) => (
            <div key={index} className='flex items-center px-6 py-3 gap-3 hover:bg-gray-200'>
              <img className='rounded-full w-10 bg-gray-200' src={item.docData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-700'>{item.docData.name}</p>
                <p className='text-gray-500 text-xs'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> : item.cancelled
                ? <p className='text-red-500 text-xs font-medium'>Cancelled !</p>
                : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer hover:contrast-75' src={assets.cancel_icon} alt="" />
              }
            </div>
          ))
        }
        </div>
      </div>
    </div>
  )
}

export default Dashboard
