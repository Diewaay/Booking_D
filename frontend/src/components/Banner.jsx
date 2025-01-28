import appointmentImg from "../assets/assets_frontend/appointment_img.png";

const Banner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 px-6 py-8 flex flex-row items-center justify-between">
          {/* Left Content */}
          <div className="text-left max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Schedule Your Appointment Today!
            </h2>
            <p className="text-blue-100 text-sm md:text-base">
              Quick, easy, and secure scheduling with our healthcare
              professionals.
            </p>
          </div>

          {/* Right Image */}
          <div className="relative w-1/3 md:w-1/4">
            <div className="relative">
              {/* Decorative circle */}
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-blue-400 rounded-full opacity-20" />

              {/* Main image */}
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img
                  src={appointmentImg}
                  alt="Schedule your medical appointment"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle decorative blob */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 transform">
          <div className="w-48 h-48 bg-blue-400 rounded-full opacity-10 blur-2xl" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
