import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Mengatur userId dari decoded token
    req.body.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Error in token verification:", error.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export default authUser;
