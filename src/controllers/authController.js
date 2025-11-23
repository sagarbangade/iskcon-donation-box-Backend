const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * REGISTER USER (Admin controls)
 *
 * Rules:
 * 1) If no admin exists → allow first admin creation WITHOUT token
 * 2) If admin exists → ONLY logged-in admin can create users
 * 3) Volunteers cannot create users
 */

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, areaId } = req.body;

    // Required field validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // ObjectId validation for areaId if provided
    if (areaId && !require("mongoose").Types.ObjectId.isValid(areaId)) {
      return res.status(400).json({ message: "Invalid areaId format" });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Check if any admin exists
    const adminExists = await User.findOne({ role: "admin" });

    // CASE 1 → No admin exists yet → allow only admin creation
    if (!adminExists) {
      if (role !== "admin") {
        return res.status(400).json({
          message: "First user must be an admin",
        });
      }
      // proceed (no token required)
    } else {
      // CASE 2 → Admin exists → only logged-in admin can create users
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
          message: "Only admin can create users",
        });
      }
    }

    // Verify area exists if areaId provided
    if (areaId) {
      const Area = require("../models/Area");
      const area = await Area.findById(areaId);
      if (!area) {
        return res.status(404).json({ message: "Area not found" });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      role,
      areaId,
      password: hashedPassword,
    });

    res.json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        areaId: user.areaId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * LOGIN USER
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Required field validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid password" });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        areaId: user.areaId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};