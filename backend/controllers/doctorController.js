import doctorModel from "../models/doctorModel.js";

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    res.status(200).json({ success: true, doctors }); // Use 200 status code for successful response
  } catch (error) {
    res.status(500).json({ success: false, message: error.message }); // Use 500 status code for server error
  }
};

export default doctorList;
