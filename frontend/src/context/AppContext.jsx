import { createContext, useState,useEffect } from "react";
import { doctors } from "../assets/assets";
import axios from "axios";
import App from "../App";
import { toast } from "react-toastify";
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const currencySymbol = "₹";
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backend_url + "/api/doctor/doctors");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching doctors data:", error);
      toast.error("Error fetching doctors data: " + error.message);
    }
  };
  useEffect(() => {
    getDoctorsData();
  }, []);
  const value = { doctors, currencySymbol, getDoctorsData };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export default AppContextProvider;
