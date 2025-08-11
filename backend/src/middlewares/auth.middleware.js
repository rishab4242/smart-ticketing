const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer "))
      return res.status(401).json({ msg: "No token" });
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ msg: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Invalid token" });
  }
};
