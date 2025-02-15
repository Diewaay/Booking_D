import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { doctors } = useContext(AppContext);
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const navigate = useNavigate();

  const specialties = [...new Set(doctors.map((doctor) => doctor.speciality))];

  const filterDoctors = (speciality) => {
    const filtered =
      speciality === "All"
        ? doctors
        : doctors.filter((doctor) => doctor.speciality === speciality);
    setFilteredDoctors(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Our Specialists
        </h1>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => filterDoctors("All")}
            className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 font-medium"
          >
            All
          </button>
          {specialties.map((speciality) => (
            <button
              key={speciality}
              onClick={() => filterDoctors(speciality)}
              className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 font-medium"
            >
              {speciality}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
            onClick={() => navigate(`/appointment/${doctor._id}`)}
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                {/* Doctor Avatar */}
                <div className="bg-gradient-to-r from-blue-200 to-blue-600 w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Doctor Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {doctor.name}
                  </h3>
                  <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                    {doctor.speciality}
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-4 space-y-2 text-gray-600">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-100 mr-2"></div>
                  <span>{doctor.experience} years of experience</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-100 mr-2"></div>
                  <span>Board Certified</span>
                </div>
              </div>

              {/* Action Button */}
              <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
