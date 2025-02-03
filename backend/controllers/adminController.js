const addDoctor = async (req, res) => {
  console.log("Incoming request:", req.body);
  console.log("Uploaded file:", req.file);

  try {
    const {
      name,
      email,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    console.log(
      {
        name,
        email,
        speciality,
        degree,
        experience,
        about,
        fees,
        address,
      },
      imageFile
    );
  } catch (error) {
    return res.status(400).json({ message: "Invalid request" });
  }
};

export { addDoctor };
