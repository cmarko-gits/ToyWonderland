import Toy from "../models/Toy.js";
import User from "../models/User.js";

// Dohvatanje admin profila
export const getAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("fullName is_admin");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "Admin access granted", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Dodavanje nove igračke
export const addToy = async (req, res) => {
  const {
    name,
    description,
    type,
    ageGroup,
    targetGroup,
    productionDate,
    price,
    image,
    inStock
  } = req.body;

  if (!name || !description || !type || !ageGroup || !targetGroup || !productionDate || !price) {
    return res.status(400).json({ msg: "All required fields must be provided" });
  }

  try {
    const newToy = await Toy.create({
      name,
      description,
      type,
      ageGroup,
      targetGroup,
      productionDate,
      price,
      image: image || "",
      inStock: inStock || 0,
    });

    res.status(201).json({ msg: "Toy added successfully", toy: newToy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Izmena postojeće igračke
export const updateToy = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const toy = await Toy.findByIdAndUpdate(id, updateData, { new: true });
    if (!toy) return res.status(404).json({ msg: "Toy not found" });

    res.json({ msg: "Toy updated successfully", toy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Brisanje igračke
export const deleteToy = async (req, res) => {
  const { id } = req.params;

  try {
    const toy = await Toy.findByIdAndDelete(id);
    if (!toy) return res.status(404).json({ msg: "Toy not found" });

    res.json({ msg: "Toy deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Dohvatanje svih igračaka (za admin panel)
export const getAllToys = async (req, res) => {
  try {
    const toys = await Toy.find();
    res.json({ toys });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
