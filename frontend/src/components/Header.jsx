import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets"; // Importing assets

const Header = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate("/doctors");
  };

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  Your Health, Our Priority
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Find and book appointments with trusted healthcare
                  professionals in your area. Easy, fast, and secure.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBookAppointment}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => navigate("/services")}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
                >
                  Our Services
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                <div>
                  <p className="text-3xl font-bold text-blue-600">500+</p>
                  <p className="text-sm text-gray-600">Doctors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">24/7</p>
                  <p className="text-sm text-gray-600">Support</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">98%</p>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:pl-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={assets.header_img}
                  alt="Doctor consultation"
                  className="w-full h-full object-cover"
                />

                {/* Floating Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Quick Booking
                      </p>
                      <p className="text-sm text-gray-600">
                        Book appointment in minutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
