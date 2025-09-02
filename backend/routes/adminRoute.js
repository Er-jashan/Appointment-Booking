import express from 'express';
<<<<<<< HEAD
import { addDoctor, allDoctors, loginAdmin, appointemntsAdmin, appointemntCancel } from '../controllers/adminController.js';
=======
import { addDoctor, allDoctors, loginAdmin, appointmentsAdmin, appointmentCancel } from '../controllers/adminController.js';
>>>>>>> 696f1b2ad1e2a3375908c7fd0152f60e5327767f
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
>>>>>>> 696f1b2ad1e2a3375908c7fd0152f60e5327767f


export default adminRouter;