import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async(req,res) => {
  const { fullName, email, phone, address, password, is_admin } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      phone,
      address,
      password: hashedPassword,
      is_admin: is_admin || 0 
    });

    res.status(201).json({ msg: "User successfully created", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  const { fullName, email, phone, address, oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ msg: "Email is already in use" });
      }
      user.email = email;
    }

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ msg: "Please provide your current password to set a new one" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Current password is incorrect" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json({ 
      msg: "Profile updated successfully", 
      user: updatedUser 
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ msg: "Server error during profile update" });
  }
};

export const login = async(req,res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User doesn't exist" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ msg: "Login Successful", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User fetched", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};