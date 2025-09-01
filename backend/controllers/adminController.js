import validator from 'validator';
import bycrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import Doctor from '../models/doctorModel.js';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js'
// import cloudinary from '../config/cloudinary.js';

//api for addding doctor
const addDoctor = async (req,res)=> {
    try {
        const { name, email, password, image, specialization, degree, experience, about, availability, fees, address } = req.body;
        const imageFile = req.file;

        //checking for all data to add doctor
        if (!name || !email || !password || !specialization || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({success:false, message: 'Please fill all the fields' });
        }
        //validation email format
        if(!validator.isEmail(email)) {
            return res.status(400).json({success:false, message: 'Please enter a valid email' });
        }
        //validating password length
        if(password.length < 8) {
            return res.status(400).json({success:false, message: 'Password must be at least 8 characters long' });
        }
        //hashing doctor's password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        //uploading image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image'
        });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            specialization,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now(),
            image: imageUrl
        }

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({success:true, message: 'Doctor added successfully'});


    } catch (error) {
        console.error('Error adding doctor:', error);
        res.json({success:false,message:error.message});
    }
}

//api for adming login
const loginAdmin = async (req, res) => {
    try{
        const { email, password } = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true, token, message: 'Admin logged in successfully'});
        }else{
            res.json({success:false, message: 'Invalid email or password'});
        }


    }catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({success:false, message: 'Internal server error'});
    }
}

const allDoctors = async (req , res)=>{
    try {
        
        const doctors = await doctorModel.find({}).select('-password ')

            res.json({success : true , doctors})
    } catch (error) {
         console.error('Error logging in admin:', error);
        res.status(500).json({success:false, message: 'Internal server error'});
        
    }
}

// API TO  GET ALL APPOINTMENTS LIST
const appointemntsAdmin = async (res,req) =>{
    try {
        const appointemnts = await appointmentModel.find({})
        res.json({success:true,appointemnts})
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({success:false, message: 'Internal server error'});
        
    }
}

// api to cancel appointments
const appointemntCancel = async (req, res) => {
    try {
        
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
       
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

export { addDoctor ,loginAdmin,allDoctors ,appointemntsAdmin, appointemntCancel};

//this is a placeholder function for adding a doctor
//you can implement the actual logic later