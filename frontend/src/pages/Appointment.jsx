/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, token, userData, backendUrl } =
    useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();

  // Jadwal dokter (beda-beda tiap hari)
  const doctorSchedule = {
    Monday: ["09:00", "11:00", "13:00"],
    Tuesday: ["10:00", "14:00"],
    Wednesday: ["09:00", "15:00"],
    Thursday: ["11:00", "16:00"],
    Friday: ["09:00", "12:00"],
    Saturday: [],
    Sunday: [],
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Login to book appointment");
      return navigate("/login");
    }

    if (selectedDate !== null && selectedTime) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const appointmentData = {
          userId: userData._id,
          docId,
          slotDate: new Date(Date.now() + selectedDate * 86400000),
          slotTime: selectedTime,
          userData,
          docData: docInfo,
          amount: docInfo.fees,
          date: new Date(),
        };
        const { data } = await axios.post(
          `${backendUrl}/api/user/book-appointment`,
          appointmentData,
          config
        );
        if (data.success) {
          toast.success("Appointment booked successfully!");
          navigate("/my-appointments");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.error("Please select a date and time.");
    }
  };

  // Filter related doctors (same specialty, exclude current doctor)
  const relatedDoctors = doctors
    ?.filter(
      (doc) => doc.speciality === docInfo?.speciality && doc._id !== docId
    )
    .slice(0, 3); // Limit to 3 doctors

  useEffect(() => {
    const fetchDocInfo = async () => {
      const info = doctors?.find((doc) => doc._id === docId);
      setDocInfo(info);
    };
    fetchDocInfo();
  }, [doctors, docId]);

  // Ambil hari dari tanggal yang dipilih
  const getDayFromDate = (date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  };

  // Ambil jam yang tersedia berdasarkan hari yang dipilih
  const selectedDay =
    selectedDate !== null
      ? getDayFromDate(new Date(Date.now() + selectedDate * 86400000))
      : null;
  const availableSlots = selectedDay ? doctorSchedule[selectedDay] : [];

  if (!docInfo) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Doctor Profile Section */}
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 items-center">
          <div className="bg-gradient-to-r from-blue-200 to-blue-600 w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={docInfo.image}
              alt={docInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{docInfo.name}</h1>
            <p className="text-gray-600 text-lg">
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <p className="text-gray-600 text-sm">{docInfo.experience}</p>
          </div>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="font-semibold text-xl text-gray-800 mb-3">
              About Doctor
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {docInfo.about}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-xl text-gray-800 mb-3">
              Consultation Fee
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {currencySymbol}
              {docInfo.fees}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Book Appointment
        </h2>
        <div className="space-y-8">
          {/* Calendar */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-8 h-8 text-gray-600 flex items-center justify-center">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                return (
                  <button
                    key={i}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                      selectedDate === i
                        ? "bg-blue-600 text-white shadow-lg transform scale-105"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                    onClick={() => setSelectedDate(i)}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {availableSlots.length === 0 ? (
              <p className="text-gray-600">No available slots for this day.</p>
            ) : (
              availableSlots.map((time) => (
                <button
                  key={time}
                  className={`py-4 px-6 rounded-lg text-center transition-all ${
                    selectedTime === time
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))
            )}
          </div>

          {/* Book Button */}
          <button
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg transform hover:scale-105 active:scale-95"
            onClick={bookAppointment}
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* Related Doctors */}
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Related {docInfo.speciality} Specialists
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedDoctors?.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(`/appointment/${doctor._id}`)}
            >
              <div className="bg-gradient-to-r from-blue-200 to-blue-600 w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-center text-gray-800 text-xl">
                {doctor.name}
              </h3>
              <p className="text-sm text-gray-600 text-center">
                {doctor.speciality}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
