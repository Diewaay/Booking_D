import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res
        .status(401)
        .json({ success: false, msg: "No token, authorization denied" });
    }
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, msg: "Invalid token" });
    }

    // Set user in request for future use
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error in token verification:", error.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export default authAdmin;
