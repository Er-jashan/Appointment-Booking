import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/AppointmentModel.jsx'


//api to register user
const registerUser = async (req, res) => {
    try {

        // console.log('Parsed body:', req.body);
        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Enter a valid Email' });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'Enter a strong password' });
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            return res.json({ success: false, message: 'Invalid Credentials' })
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await userModel.findById(userId).select(['-password']);
        res.json({ success: true, userData })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//api to update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address,dob,gender } = req.body;
        const imageFile = req.file;

        if(!name || !phone || !gender || !dob) {
            return res.json({ success: false, message: 'All fields are required' });
        }
        await userModel.findByIdAndUpdate(userId, {
            name, phone, address:JSON.parse(address),dob,gender,
        });
        if(imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image",folder:"profile_images"});
            const imageUrl = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: 'Profile Updated Successfully!' });
    } catch (error) {
        
    }
}

// API to book appointment 
const bookAppointment = async (req,res)=>{
    try {
        const {userId , docId , slotDate, slotTime} = req.body
        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData.available){
            return res.json({success:false,message:'Doctor not available'})
        }

        let slots_booked = docData.slots_booked

        // checking for slot availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false, message:'Slot not available'})
            }else{
                slots_booked[slotDate].push(slotTime)

            }
        }else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount : docData.fees,
            slotTime,
            slotDate,
            date : Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId , {slots_booked})
        res.json({success:true, message:'Appointment Booked'})
    } catch (error) {
        console.log(error)
        res.json({ success: true, message: 'Profile Updated Successfully!' });

    }

}

// api to get user appointments for frontend my-appointment page
const listAppointment = async (res,req)=>{
    try {
        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})

        res.json({success:true,appointments})

    } catch (error) {
        console.log(error)
        res.json({ success: true, message: 'Profile Updated Successfully!' });
    }

}

export { registerUser, loginUser, getProfile, updateProfile ,bookAppointment ,listAppointment};