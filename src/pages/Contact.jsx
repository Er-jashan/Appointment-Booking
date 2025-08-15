import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt10 text-gray-500'>
        <p>CONTACT <span className='text-gray-800'>US</span></p>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[350px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center gap-6 items-start'>
          <p className='font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className='text-gray-500'>#177A Bleecker Street, Greenwich Village, New York City, New York</p>
          <p className='text-gray-500'>Tel: (324) 443-5453 <br />Email: jshn610@gmail.com, harmanbajwa012005@gmail.com</p>
          <h5 className='font-semibold text-lg text-gray-600'>Careers at Medicura</h5>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-black rounded-md px-8 py-4 text-sm hover:bg-primary hover:border-primary hover:text-white transition-all duration-200'>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact
