import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AllAppointments = () => {
  const { aToken, appointments = [], getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken, getAllAppointments]); // include all reactive deps per hooks guidance

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="my-3 text-lg font-medium">All appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date &amp; Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments?.map((item, index) => (
          <div
            key={item?._id ?? index}
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>

            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full object-cover bg-gray-200"
                src={item?.userData?.image || assets?.user_fallback}
                alt=""
              />
              <p>{item?.userData?.name || '—'}</p>
            </div>

            <p className="max-sm:hidden">
              {item?.userData?.dob ? calculateAge(item.userData.dob) : '—'}
            </p>

            <p>
              {item?.slotDate ? slotDateFormat(item.slotDate) : '—'}
              {item?.slotTime ? `, ${item.slotTime}` : ''}
            </p>

            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full object-cover bg-gray-200"
                src={item?.docData?.image || assets?.doctor_fallback}
                alt=""
              />
              <p>{item?.docData?.name || '—'}</p>
            </div>

            <p>
              {currency}
              {typeof item?.amount === 'number' ? item.amount : '—'}
            </p>

            {item?.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : (
              <img
                onClick={() => item?._id && cancelAppointment?.(item._id)}
                className="w-10 cursor-pointer hover:contrast-75"
                src={assets?.cancel_icon}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
