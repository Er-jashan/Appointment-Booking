import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from "../../context/AppContext";
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { dToken, backendUrl, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        availability: profileData.availability
      }
      const {data} = await axios.post(`${backendUrl}/api/doctor/update-profile`,updateData,{headers:{dToken}})
      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  return (profileData && (
    <div className=''>
      <div className='flex flex-col gap-4 m-5'>

        <div>
          <img className='bg-[#5f6fff]/80 w-full sm:max-w-64 rounded-lg ml-7' src={profileData.image} alt="" />
        </div>

        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-4 bg-white'>
          {/* {DOcinfo} */}
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'><p>{profileData.degree} - {profileData.specialization}</p>
          <button className='py-0.5 px-2 border border-gray-500 text-xs rounded-full'>{profileData.experience}</button></div>
        </div>
        {/* {about} */}
        <div className='ml-7'>
          <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
          <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profileData.about}</p>
        </div>

        <div className='ml-7 flex gap-2 py-2'>
          <p className='text-gray-600 font-medium'>Address:</p>
          <p className='text-sm text-gray-700'>
            {isEdit ? <input type="text" onChange={(e)=>setProfileData(prev => ({...prev,address:{...prev.address,line1:e.target.value}}))} value={profileData.address.line1} /> : profileData.address.line1}
            <br />
            {isEdit ? <input type="text" onChange={(e)=>setProfileData(prev => ({...prev,address:{...prev.address,line2:e.target.value}}))} value={profileData.address.line2} /> : profileData.address.line2}
          </p>
        </div>

        <p className='ml-7 text-gray-600 font-medium mt-4'>Appointment fee : <span className='text-gray-800'>{currency}{isEdit ? <input type="number" onChange={(e)=>setProfileData(prev=>({...prev,fees:Number(e.target.value)}))} value={profileData.fees}/> :profileData.fees * 10}</span></p>
        {/* Toggle Switch for Availability */}
        <div className='ml-7 flex items-center gap-2 pt-2'>
          <p className=' text-gray-600 font-medium'>Availability: </p>
          <label className="flex items-center cursor-pointer">
            <div className="flex relative">
              <input
                type="checkbox"
                checked={profileData.availability}
                onChange={()=> isEdit && setProfileData(prev=>({...prev, availability: !prev.availability}))}
                className="sr-only"
              />
              <div className={`block w-12 h-6 rounded-full ${profileData.availability ? 'bg-[#5f6fff]' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${profileData.availability ? 'translate-x-6' : ''}`}></div>
            <span className={`ml-3 text-gray-800 ${profileData.availability ? 'text-green-600' : 'text-red-400'} `}>{profileData.availability ? 'Available' : 'Unavailable'}</span>
            </div>
          </label>
        </div>

      </div>{isEdit ?
      <button onClick={updateProfile} className='ml-10 mb-10 px-4 py-1 cursor-pointer text-[#36b345] border-2 border-[#36b345]  rounded-full hover:bg-[#36b345] hover:text-white transition-all'>Save</button>
      :<button onClick={()=>setIsEdit(true)} className='ml-10 mb-10 px-4 py-1 cursor-pointer text-[#5f6fff] border-2 border-[#5f6fff]  rounded-full hover:bg-[#5f6fff] hover:text-white transition-all'>Edit</button>
}
    </div >
  ))
}

export default DoctorProfile
