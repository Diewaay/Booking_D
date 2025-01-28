import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext); // Move this line up to access doctors first
  const displayedDoctors = showMore ? doctors : doctors.slice(0, 6);

  const handleDoctorClick = (doctorId, doctorName) => {
    const urlName = doctorName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/doctors/${urlName}`, { state: { doctorId } });
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Top Doctors
          </h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Exceptional healthcare professionals dedicated to your well-being,
            combining expertise with compassionate care.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="group relative bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              onClick={() => handleDoctorClick(doctor._id, doctor.name)}
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {doctor.name}
                </h3>
                <p className="text-blue-600 font-medium mb-4">
                  {doctor.speciality}
                </p>

                {/* Additional Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-yellow-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>4.9 (150+ reviews)</span>
                  </div>
                  <span>Available Today</span>
                </div>
              </div>

              {/* Hover Overlay with CTA */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering parent onClick
                      navigate(`/appointment/${doctor._id}`);
                    }}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {!showMore && doctors.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowMore(true)}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
            >
              View More Doctors
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopDoctors;
