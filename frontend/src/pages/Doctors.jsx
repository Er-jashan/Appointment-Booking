import React, {useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const navigate = useNavigate();
  
  const {specialization} = useParams();
  const [filterDoc , setFilterDoc] = useState([]);
  const [showFilter,setShowFilter] = useState(false)

  const {doctors} = useContext(AppContext);

  const applyFilter = ()=>{
    if(specialization){
      setFilterDoc(doctors.filter(doc => doc.specialization === specialization))
    }else{
      setFilterDoc(doctors)
    }
  }

  useEffect(()=>{
       applyFilter();
  },[doctors,specialization])

  // console.log(specialization)
  return (
    <div>
      <p className='text-gray-600 '>Browse throught the specialist doctors</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={()=>setShowFilter(prev => !prev)}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={()=> specialization === 'General Physician' ? navigate('/doctors') : navigate('/doctors/General Physician')}  className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${specialization === "General Physician" ? "bg-indigo-100 text-black" : ""}`}>General Physician</p>
          <p onClick={()=> specialization === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${specialization === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>Gynecologist</p>
          <p onClick={()=> specialization === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${specialization === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>Dermatologist</p>
          <p onClick={()=> specialization === 'Pediatrician' ? navigate('/doctors') : navigate('/doctors/Pediatrician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${specialization === "Pediatrician" ? "bg-indigo-100 text-black" : ""}`}>Pediatrician</p>
          <p onClick={()=> specialization === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${specialization === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}>Neurologist</p>
          <p onClick={()=> specialization === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${specialization === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologist</p>
        </div>

        <div className='w-full grid grid-cols-auto gap-4 gap-y-6 '>
          {
            filterDoc.map((item , index)=>(
           <div onClick={()=> navigate(`/appointment/${item._id}`)} className='border cursor-pointer border-blue-200 rounded-xl overflow-hidden hover:translate-y-[-10px] hover:bg-gray-300 transition-all duration-300 hover:shadow-lg' key={index}>
            <img className='bg-blue-50 ' src={item.image} alt=''/>
            <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.availability?'text-green-500':'text-gray-500' }`}>
                    <p className={`w-2 h-2 ${item.availability?'bg-green-500':'bg-gray-500' }  rounded-full`}></p>
                    <p>{item.availability ? 'Available' : 'Not Available'}</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.specialization}</p>
                </div>
            </div>
        ))

          }
        </div>
      </div>
    </div>
  )
}

export default Doctors
