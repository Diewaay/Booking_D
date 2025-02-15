/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import {
  XCircle,
  Calendar,
  Clock,
  DollarSign,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const AdminAppointments = () => {
  const {
    aToken,
    backendUrl,
    appointments,
    getAllAppointments,
    setAppointments,
    currencySymbol,
  } = useContext(AdminContext);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        await getAllAppointments();
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching appointments");
        setLoading(false);
      }
    };
    fetchAllAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${aToken}` } };
      const { data } = await axios.delete(
        `${backendUrl}/api/user/appointment/${appointmentId}`,
        config
      );
      if (data.success) {
        toast.success("Appointment cancelled successfully");
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
        );
      }
    } catch (error) {
      toast.error("Error cancelling appointment");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid time";
    }
  };

  const filteredAppointments = (appointments || []).filter((appointment) => {
    const doctorName = appointment?.docData?.name || "";
    const patientName = appointment?.userData?.name || "";

    const matchesSearch =
      !searchTerm ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && !appointment?.cancelled) ||
      (filterStatus === "cancelled" && appointment?.cancelled);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Appointments Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by doctor or patient name..."
              className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === status
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!Array.isArray(appointments) || filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            No appointments found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={appointment?.docData?.image || "/default-avatar.png"}
                  alt={appointment?.docData?.name || "Doctor"}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {appointment?.docData?.name || "Unknown Doctor"}
                  </h2>
                  <span className="inline-block px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                    {appointment?.docData?.speciality || "Unknown Speciality"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  {formatDate(appointment?.slotDate)}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  {formatTime(appointment?.slotTime)}
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-5 h-5 mr-2" />
                  {currencySymbol}
                  {appointment?.amount || 0}
                </div>

                {/* Field User yang Membooking */}
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Booked by:</span>
                  <span className="ml-2">
                    {appointment?.userData?.name || "Unknown User"}
                  </span>
                </div>

                {/* Field Data yang Dibooking */}
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

                <div className="pt-4">
                  {!appointment?.cancelled ? (
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      Cancel Appointment
                      <XCircle className="ml-2 h-5 w-5" />
                    </button>
                  ) : (
                    <div className="w-full py-2 px-4 bg-red-100 text-red-700 rounded-lg text-center">
                      Cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
