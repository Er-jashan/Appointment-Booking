import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';

const Sidebar = () => {
    const {aToken} = useContext(AdminContext);
    const {dToken} = useContext(DoctorContext);

  return (
    <div className='min-h-screen bg-white border-r border-gray-300'>
      {
        aToken && <ul className='text-[#515151]'>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6fff]':''}`} to={'/admin-dashboard'}>
                <img src={assets.home_icon} alt="dashboard" />
                <p className='hidden md:block'>Dashboard</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6fff]':''}`} to={'/all-appointments'}>
                <img src={assets.appointment_icon} alt="dashboard" />
                <p className='hidden md:block'>Appointments</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6fff]':''}`} to={'/add-doctors'}>
                <img src={assets.add_icon} alt="dashboard" />
                <p className='hidden md:block'>Add Doctors</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6fff]':''}`} to={'/doctor-list'}>
                <img src={assets.people_icon} alt="dashboard" />
                <p className='hidden md:block'>Doctor List</p>
            </NavLink>
        </ul>
      }

       {
        dToken && <ul className='text-[#515151]'>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6fff]':''}`} to={'/doctor-dashboard'}>
                <img src={assets.home_icon} alt="dashboard" />
                <p>Dashboard</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6fff]':''}`} to={'/doctor-appointments'}>
                <img src={assets.appointment_icon} alt="dashboard" />
                <p>Appointments</p>
            </NavLink>
           
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6fff]':''}`} to={'/doctor-profile '}>
                <img src={assets.people_icon} alt="dashboard" />
                <p>Profile</p>
            </NavLink>
        </ul>
      }
    </div>
  )
}

export default Sidebar
