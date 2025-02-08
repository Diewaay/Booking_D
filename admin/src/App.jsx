import { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import AddDoctor from "../src/pages/admin/AddDoctor";
import AllApointment from "../src/pages/admin/AllApointment";
import Dashboard from "../src/pages/admin/Dashboard";
import DoctorList from "../src/pages/admin/DoctorList";
const App = () => {
  const { aToken } = useContext(AdminContext);
  return aToken ? (
    <div>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/add-doctor" element={<AddDoctor />} />
        <Route path="/all-apointment" element={<AllApointment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctor-list" element={<DoctorList />} />
      </Routes>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
