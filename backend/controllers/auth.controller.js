const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: "Missing fields" });
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });
    user = new User({ name, email, password, role });
    await user.save();
    const token = signToken(user);
    res
      .status(201)
      .json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Missing fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });
    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
