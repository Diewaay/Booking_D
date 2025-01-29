import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dedicated to Your Health & Well-being
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Were committed to connecting you with the best healthcare
            professionals, making quality healthcare accessible to everyone.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {[
            { number: "1000+", label: "Doctors" },
            { number: "50K+", label: "Patients" },
            { number: "20+", label: "Specialties" },
            { number: "4.9", label: "Rating" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To revolutionize healthcare accessibility by providing a seamless
              platform that connects patients with qualified healthcare
              providers. We believe in making quality healthcare available to
              everyone, anywhere, anytime.
            </p>
            <div className="space-y-4">
              {[
                "24/7 Online Booking System",
                "Verified Professional Doctors",
                "Secure Patient Information",
                "Easy Follow-up Appointments",
              ].map((point, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <div className="text-6xl text-blue-500 font-bold opacity-30">
                HEALTH+
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Excellence",
              description:
                "We partner with only the best healthcare providers to ensure quality care.",
            },
            {
              title: "Innovation",
              description:
                "Continuously improving our platform to enhance the healthcare experience.",
            },
            {
              title: "Trust",
              description:
                "Building lasting relationships through transparency and reliability.",
            },
          ].map((value, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who have found their perfect
            healthcare match through our platform.
          </p>
          <button
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300"
            onClick={() => navigate(`/doctors`)}
          >
            Book an Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
