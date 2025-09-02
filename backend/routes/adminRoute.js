import express from 'express';
<<<<<<< HEAD
<<<<<<< HEAD
import { addDoctor, allDoctors, loginAdmin, appointemntsAdmin, appointemntCancel } from '../controllers/adminController.js';
=======
import { addDoctor, allDoctors, loginAdmin, appointmentsAdmin, appointmentCancel } from '../controllers/adminController.js';
>>>>>>> 696f1b2ad1e2a3375908c7fd0152f60e5327767f
=======
import { addDoctor, allDoctors, loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard } from '../controllers/adminController.js';
>>>>>>> 10c7c5b020781f0aa368a3af9933f45ef2b09d34
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import {changeAvailability} from '../controllers/doctorController.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-doctors',authAdmin, allDoctors);
adminRouter.post('/change-availability',authAdmin, changeAvailability);
<<<<<<< HEAD
adminRouter.get('/appointments',authAdmin,appointemntsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointemntCancel)
=======
adminRouter.get('/all-appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
<<<<<<< HEAD
>>>>>>> 696f1b2ad1e2a3375908c7fd0152f60e5327767f
=======
adminRouter.get('/dashboard',authAdmin,adminDashboard)
>>>>>>> 10c7c5b020781f0aa368a3af9933f45ef2b09d34


export default adminRouter;