import doctorModel from "../models/doctorModel.js";


const changeAvailability = async (req,res) => {
    try {
        const {docId} = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId,{availability: !docData.availability})
        res.json({success:true, message: 'Availability changed'})

    } catch (error) {
        res.json({success:false,message:error.message});
    }
}
export default changeAvailability