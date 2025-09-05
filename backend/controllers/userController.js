import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay';


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
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;
        // console.log(req.body);

        if (!userId || !name || !phone || !gender || !dob) {
            return res.json({ success: false, message: 'All fields are required' });
        }
        await userModel.findByIdAndUpdate(userId, {
            name, phone, address: JSON.parse(address), dob, gender,
        }, { new: true });
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image", folder: "profile_images" });
            const imageUrl = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: 'Profile Updated Successfully!' });
    } catch (error) {
        res.json({ success: false, message: error.message });
        // console.log(error.message);
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body
        // console.log(req.body);
        const docData = await doctorModel.findById(docId).select('-password')

        // if(!docData.available){
        //     return res.json({success:false,message:'Doctor not available'})
        // }

        let slots_booked = docData.slots_booked

        // checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' })
            } else {
                slots_booked[slotDate].push(slotTime)

            }
        } else {
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
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: 'Appointment Booked' })
    } catch (error) {
        // console.log(error)
        res.json({ success: false, message: 'Failed to book appointment' });
    }

}

// api to get user appointments for frontend my-appointment page
const listAppointment = async (req, res) => {
    try {
        // FIX 1: Get the userId securely from the auth middleware, NOT req.body
        const userId = req.userId;

        // Find all appointments that match the authenticated user's ID
        const appointments = await appointmentModel.find({ userId });

        res.json({ success: true, appointments });

    } catch (error) {
        // It's good practice to send a proper server error status code
        res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
    }
};

//api to cancell appointemnt
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        //verifying appointment ownership
        if (appointmentData.userId.toString() !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        //releasing doctor's slot
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        let slots_booked = doctorData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: 'Appointment Cancelled !' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


//Uncomment this function below after adding the razor pay key in the env file
// const razorpayInstance = new rzorpay({
//     key_id:process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// })

//api to make payments to the doctors
 const paymentRazorpay = async (req, res) => {


    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment Cancelled or not found" })
        }

        //creating options for razorpay payments
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId
        }
        const order = await razorpayInstance.orders.create(options)
        res.json({ success: true, order })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}
//api to verify razorpay payment
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.order.fetch(razorpay_order_id);
        if (orderInfo.status === 'paid') {
            await appointmentModel.findById(orderInfo.receipt,{payment:true})
            res.json({success:true,message:"Payment Successfull"})
        }else{
            res.json({success:false,message:"Payment Failed !"})
        }

    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay };