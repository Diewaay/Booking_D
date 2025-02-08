import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("No auth header");
      return res
        .status(401)
        .json({ success: false, msg: "No token, authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    console.log("Token received:", token); // Tambahkan log ini
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Tambahkan log ini

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      console.log("Invalid token email:", decoded.email);
      return res.status(401).json({ success: false, msg: "Invalid token" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error in token verification:", error.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export default authAdmin;
