/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { XCircle as XCircleIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const {
    token,
    backendUrl,
    appointments,
    getAppointmentsData,
    currencySymbol,
    userData,
  } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userData) return;
      try {
        await getAppointmentsData();
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching appointments");
      }
    };
    fetchAppointments();
  }, [userData, getAppointmentsData]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.delete(
        `${backendUrl}/api/user/appointment/${appointmentId}`,
        config
      );
      if (data.success) {
        toast.success("Appointment cancelled successfully");
        await getAppointmentsData(); // Refresh appointments list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error cancelling appointment");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="p-4">Loading appointments...</div>;
  }

  if (!appointments || appointments.length === 0) {
    return <div className="p-4">You have no appointments.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Appointments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map(
          (appointment) =>
            !appointment.cancelled && (
              <div
                key={appointment._id}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={appointment.docData.image}
                    alt={appointment.docData.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {appointment.docData.name}
                    </h2>
                    <p className="text-gray-600">
                      {appointment.docData.speciality}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">
                    <span className="font-semibold">Date:</span>{" "}
                    {formatDate(appointment.slotDate)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Time:</span>{" "}
                    {appointment.slotTime}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Consultation Fee:</span>{" "}
                    {currencySymbol}
                    {appointment.amount}
                  </p>
                </div>
                <button
                  onClick={() => handleCancelAppointment(appointment._id)}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all"
                >
                  Cancel Appointment
                  <XCircleIcon className="inline ml-2" />
                </button>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
