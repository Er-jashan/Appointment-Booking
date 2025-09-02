import React, { createContext, useMemo } from "react";

export const AppContext = createContext({}); // default to an object for safer access [1]

const AppContextProvider = (props) => {
  // Config
  const currency = "₹"; // choose one currency once; avoid duplicate const [8][10]

  // Utils
  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--; // correct for month/day so ages aren’t off by one [9]
    }
    return age;
  };

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // slotDate expected like "12_09_2025" -> "12 Sep 2025"
  const slotDateFormat = (slotDate) => {
    if (!slotDate || typeof slotDate !== "string") return "";
    const parts = slotDate.split("_");
    if (parts.length !== 3) return slotDate; // fallback to original if unexpected format
    const [day, mm, yyyy] = parts;
    const monthIdx = Number(mm) - 1;
    const mon = months[monthIdx] ?? mm; // guard invalid month
    return `${day} ${mon} ${yyyy}`;
  };

  // Memoize to prevent value object changing each render [5]
  const value = useMemo(
    () => ({
      calculateAge,
      slotDateFormat,
      currency,
    }),
    [currency]
  );

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
