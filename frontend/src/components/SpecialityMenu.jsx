import { specialityData } from "../assets/assets_frontend/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Find by Speciality</h1>
      <p className="text-lg text-gray-600 mb-6">
        Explore our range of specialties and find the right healthcare
        professional for your needs.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialityData.map((item) => (
          <Link
            onScroll={() => scrollTo(0, 0)}
            to={`/doctors/${item.speciality}`}
            key={item.id}
          >
            <div
              key={item.speciality}
              className="flex flex-col items-center bg-white shadow-md rounded-lg p-4"
            >
              <img
                src={item.image}
                alt={item.speciality}
                className="w-24 h-24 object-cover mb-2"
              />

              <h3 className="text-lg font-semibold">{item.speciality}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
