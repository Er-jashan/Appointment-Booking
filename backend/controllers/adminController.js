

//api for addding doctor
const addDoctor = async (req,res)=> {
    try {
        const { name, email, password, image, specialization, degree, experience, about, availability, fees, address } = req.body;
        const imageFile = req.file;
        console.log({ name, email, password, image, specialization, degree, experience, about, availability, fees, address },imageFile);
    } catch (error) {
        console.error('Error adding doctor:', error);
    }
}

export { addDoctor };