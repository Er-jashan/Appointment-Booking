import { createContext } from "react";

export const AppContext = createContext();

<<<<<<< HEAD
const AppContextProvider = (props) =>{
    const currency = '$'

    const calculateAge = (dob)=>{
        const today = new Date();
        const birthDate = new Date(dob);

        let age = today.getFullYear() - birthDate.getFullYear();
        return age;


    }
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_'); // FIX 1: Split by underscore
    // FIX 2: Subtract 1 from the month for correct array index
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
  };

    const value = {
        calculateAge,
        slotDateFormat,
        currency
=======
const AppContextProvider = (props) => {
>>>>>>> 696f1b2ad1e2a3375908c7fd0152f60e5327767f

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    }
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_'); 
        return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
    };

    const currency = '₹'
    const value = {
        calculateAge,
        slotDateFormat,currency
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;