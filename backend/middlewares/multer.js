import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    console.log("Received file:", file); // Log the received file
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, callback) => {
    console.log("File being processed:", file); // Log file being processed
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      file.originalname.split(".").pop().toLowerCase()
    );

    if (mimetype && extname) {
      return callback(null, true);
    }
    callback("Error: File type not supported");
  },
});

export default upload;
