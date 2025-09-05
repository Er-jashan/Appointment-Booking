import React, {useContext, useState,useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import {jwtDecode} from 'jwt-decode'
const MyProfile = () => {
  const { userData, setUserData, token, backendURL, loadUserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

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

  const updateUserProfileData = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('userId', userId)
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

      image && formData.append('image', image)

      const { data } = await axios.post(backendURL + '/api/user/update-profile', formData, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      // console.log(error)
      toast.error(error.message)
    }

    // console.log('backendUrl:', backendURL);

  }

  return (
    userData && (
      <div className="max-w-lg flex flex-col gap-2 text-sm">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              {(image || userData.image) && (
                <img
                  className="w-36 rounded opacity-75"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Profile"
                />
              )}
              <img
                className="w-10 absolute bottom-12 right-12"
                src={image ? null : assets.upload_icon}
                alt=""
              />
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" />
          </label>
        ) : (
          userData.image && <img className="w-36 rounded" src={userData.image} alt="Profile" />
        )}

        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
            type="text"
            value={userData.name}
            onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
        )}

        <hr className="bg-zinc-400 h-[1px] border-none" />
        <div>
          <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Email id : </p>
            <p className="text-blue-500">{userData.email}</p>
            <p className="font-medium">Phone : </p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52"
                type="text"
                value={userData.phone}
                onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            ) : (
              <p className="text-blue-400">{userData.phone}</p>
            )}

            <p className="font-medium">Address : </p>
            {isEdit ? (
              <p>
                <input
                  className="bg-gray-50"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))
                  }
                  value={userData.address.line1}
                  type="text"
                />
                <input
                  className="bg-gray-50"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))
                  }
                  value={userData.address.line2}
                  type="text"
                />
              </p>
            ) : (
              <p className="text-gray-500">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>
        <div>
          <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Gender : </p>
            {isEdit ? (
              <select
                className="max-w-20 bg-gray-100"
                onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                value={userData.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-400">{userData.gender}</p>
            )}
            <p className="font-medium">Birthday :</p>
            {isEdit ? (
              <input
                className="max-w-24 bg-gray-100"
                type="text"
                onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                value={userData.dob === "Not Selected" ? "" : userData.dob || ""}
              />
            ) : (
              <p className="text-gray-400">{userData.dob}</p>
            )}
          </div>
        </div>

        <div className="mt-10">
          {isEdit ? (
            <button
              type="button"
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={updateUserProfileData}
            >
              Save Information
            </button>
          ) : (
            <button
              type="button"
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  )
}

export default MyProfile
