import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'


const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);
  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>{
        doctors.map((item, index) => (
          <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-indigo-50 group-hover:bg-[#5F6FFF] transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
              <p className='text-zinc-600 text-sm'>{item.specialization}</p>
              <div className='flex items-center gap-2 pt-2'>
                <p className=' text-gray-600 text-sm'>Availability: </p>
                <label className="flex items-center cursor-pointer">
                  <div className="flex relative">
                    <input
                      type="checkbox"
                      checked={item.availability}
                      onChange={() => changeAvailability(item._id, !item.availability)}
                      className="sr-only"
                    />
                    <div className={`block w-12 h-6 rounded-full ${item.availability ? 'bg-[#5f6fff]' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${item.availability ? 'translate-x-6' : ''}`}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))
      }</div>
    </div>
  )
}

export default DoctorsList
