import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { Search, Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (aToken) {
        await getAllDoctors();
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [aToken]);

  const filteredDoctors = doctors?.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Doctors</h2>
          <Link to="/add-doctor">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-5 h-5 mr-2" />
              Add New Doctor
            </button>
          </Link>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search doctors..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Profile
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Speciality
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Experience
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Fees
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDoctors?.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {doctor.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {doctor.speciality}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {doctor.experience} years
                    </td>
                    <td className="px-4 py-3 text-gray-600">{doctor.email}</td>
                    <td className="px-4 py-3 text-gray-600">{doctor.fees}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
