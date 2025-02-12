import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";
import { useParams, useNavigate } from "react-router-dom";

const EditDoctor = () => {
  const { id } = useParams();
  const { aToken, backendUrl, getAllDoctors } = useContext(AdminContext);
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    speciality: "",
    degree: "",
    experience: "",
    about: "",
    fees: "",
    address: "",
    image: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/admin/doctor/${id}`,
          {
            headers: { Authorization: `Bearer ${aToken}` },
          }
        );
        if (data.success) {
          setDoctor(data.doctor);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchDoctor();
  }, [id, aToken, backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setDoctor((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(doctor).forEach((key) => {
      formData.append(key, doctor[key]);
    });

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/edit-doctor/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${aToken}` },
        }
      );
      if (data.success) {
        toast.success("Doctor updated successfully");
        getAllDoctors();
        navigate("/doctor-list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Doctor</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={doctor.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={doctor.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="speciality"
            value={doctor.speciality}
            onChange={handleChange}
            placeholder="Speciality"
            required
          />
          <input
            type="text"
            name="degree"
            value={doctor.degree}
            onChange={handleChange}
            placeholder="Degree"
            required
          />
          <input
            type="text"
            name="experience"
            value={doctor.experience}
            onChange={handleChange}
            placeholder="Experience"
            required
          />
          <textarea
            name="about"
            value={doctor.about}
            onChange={handleChange}
            placeholder="About"
            required
          />
          <input
            type="text"
            name="fees"
            value={doctor.fees}
            onChange={handleChange}
            placeholder="Fees"
            required
          />
          <input
            type="text"
            name="address"
            value={doctor.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
          <input type="file" onChange={handleImageChange} />
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white rounded-lg px-4 py-2"
          >
            Update Doctor
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDoctor;
