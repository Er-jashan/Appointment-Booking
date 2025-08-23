import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";
import axios from 'axios'

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Image not selected");
      }

      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));

      // console.log
      formData.forEach((value,key)=>{
        console.log(`${key} : ${value}`)
      })

      const {data} = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers : {aToken}})

      if(data.success){
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
      }else{
        toast.error(data.message);
      }
    } catch(error) { 
      toast.error(error.message);
      console.log(error)
     }
  };

  return (
    <form onSubmit={onSubmitHandler} action="" className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow">
        {/* Image Upload Section */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label
            htmlFor="doc-img"
            className="flex items-center gap-4 cursor-pointer"
          >
            <img
              className="w-16 h-16 bg-gray-100 rounded-full object-cover"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
            <input
              onClick={(e) => setDocImg(e.target.files[0])}
              type="file"
              id="doc-img"
              hidden
            />
            <p>
              Upload doctor <br />
              Picture
            </p>
          </label>
        </div>

        {/* Single Container for All Inputs */}
        <div className="flex flex-col lg:flex-row gap-10 w-full">
          {/* Left Column */}
          <div className="flex flex-col flex-1 gap-4">
            <div>
              <p>Doctor Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full border border-gray-300 rounded p-2 mt-1"
                type="text"
                placeholder="Name"
                required
              />
            </div>
            <div>
              <p>Doctor's Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full border border-gray-300 rounded p-2 mt-1"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div>
              <p>Set Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full border border-gray-300 rounded p-2 mt-1"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div>
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="w-full border border-gray-300 rounded p-2 mt-1"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10+ Years">10+ Years</option>
              </select>
            </div>
            <div>
              <p>Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="w-full border border-gray-300 rounded p-2 mt-1"
                type="number"
                placeholder="Fees"
                required
              />
            </div>
          </div>
          {/* Right Column */}
          <div className="flex flex-col flex-1 gap-4">
            <div>
              <p>Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="w-full border border-gray-300 rounded p-2 mt-1"
              >
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div>
              <p>Education</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="w-full border border-gray-300 rounded p-2 mt-1"
                type="text"
                placeholder="Education"
                required
              />
            </div>
            <div>
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="w-full border border-gray-300 rounded p-2 mt-1"
                type="text"
                placeholder="Line 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="w-full border border-gray-300 rounded p-2 mt-1"
                type="text"
                placeholder="Line 2"
                required
              />
            </div>
          </div>
        </div>
        {/* About and Button */}
        <div className="mt-6">
          <p>About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full border border-gray-300 rounded p-2 mt-1"
            placeholder="Write Doctor Description..."
            rows={6}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-8 w-full lg:w-1/2 mx-auto bg-blue-500 text-white py-2 rounded font-semibold cursor-pointer hover:bg-blue-600"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
