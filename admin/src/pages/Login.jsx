import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setAToken, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token);
          // You can call setAToken(data.token) here if you want to save the token
        } else {
          toast.error(data.message)
        }
      } else {
        // Handle doctor login logic here
      }
    } catch (error) {
      // Optionally display error message to user
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center ">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 rounded-xl border bg-white border-gray-200 text-[#5E5E5E] text-sm shadow-2xl">
        <p className="text-2xl font-semibold m-auto">
          <span className=" text-[#5F6FFF]">{state}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button className="text-white bg-[#5F6FFF] w-full py-2 rounded-md border border-[#5F6FFF] text-base cursor-pointer hover:bg-white hover:text-[#5F6FFF]">
          Login
        </button>
        {
          state === 'Admin'
            ? (
              <p>
                Doctor Login?{" "}
                <span
                  onClick={() => setState('Doctor')}
                  className="text-blue-500 cursor-pointer"
                >
                  Click Here
                </span>
              </p>
            )
            : (
              <p>
                Admin Login?{" "}
                <span
                  onClick={() => setState('Admin')}
                  className="text-blue-500 cursor-pointer"
                >
                  Click Here
                </span>
              </p>
            )
        }
      </div>
    </form>
  );
};

export default Login;
