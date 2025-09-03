import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

const DoctorDashboard = () => {
  const {dToken, dashData, setDashData, getDashData} = useContext(DoctorContext)
  useEffect(()=>{
    if (dToken) {
      getDashData()
    }
  },[dToken])

  if (!dashData) return <div>Error Loading dashboard !!</div>;

  return  (
    <div>
      
    </div>
  )
}

export default DoctorDashboard
