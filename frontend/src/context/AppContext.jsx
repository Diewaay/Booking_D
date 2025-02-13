/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      if (!token) {
        throw new Error("No token available");
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get(
        `${backendUrl}/api/user/get-profile`,
        config
      );
      if (data.success) {
        setUserData(data.data);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error("Error loading user profile data:", error);
      toast.error(error.message);
    }
  };

  const value = {
    doctors,
    backendUrl,
    currencySymbol,
    token,
    setToken,
    userData,
    loadUserProfileData,
  };

  useEffect(() => {
    getDoctorsData();
    loadUserProfileData();
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
