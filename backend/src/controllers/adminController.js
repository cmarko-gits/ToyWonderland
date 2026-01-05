import Reservation from "../models/Reservation.js";
import Toy from "../models/Toy.js";
import User from "../models/User.js";

export const getAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("fullName is_admin");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "Admin access granted", user });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const addToy = async (req, res) => {
  const { name, description, type, ageGroup, targetGroup, productionDate, price, image, inStock } = req.body;

  console.log("Request Body:", req.body);

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
      productionDate: new Date(productionDate),
      price: Number(price),
      image: image || "",
      inStock: Number(inStock) || 0,
    });

    res.status(201).json({ msg: "Toy added successfully", toy: newToy });
  } catch (error) {
    console.error("❌ Database Error:", error);
    
    res.status(500).json({ 
      msg: "Server error", 
      error: error.message 
    });
  }
};
export const updateToy = async (req, res) => {
  try {
    const toy = await Toy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!toy) return res.status(404).json({ msg: "Toy not found" });
    res.json({ msg: "Toy updated successfully", toy });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteToy = async (req, res) => {
  try {
    const toy = await Toy.findByIdAndDelete(req.params.id);
    if (!toy) return res.status(404).json({ msg: "Toy not found" });
    res.json({ msg: "Toy deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAllToys = async (req, res) => {
  try {
    const toys = await Toy.find().sort({ createdAt: -1 }).lean();
    
    if (!toys) {
      return res.status(200).json({ toys: [] });
    }
    
    res.json({ toys });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "fullName email")
      .populate("items.toy", "name price image")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateReservationStatus = async (req, res) => {
  const { reservationId } = req.params;
  const { status } = req.body;
  if (!['reserved', 'arrived', 'canceled'].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }
  try {
    const reservation = await Reservation.findById(reservationId).populate("items.toy");
    if (!reservation) return res.status(404).json({ msg: "Reservation not found" });

    if (status === "arrived" && reservation.status !== "arrived") {
      for (const item of reservation.items) {
        if (!item.toy) continue;
        if (item.toy.inStock < item.quantity) {
          return res.status(400).json({ msg: `Not enough stock for ${item.toy.name}` });
        }
        item.toy.inStock -= item.quantity;
        await item.toy.save();
      }
    }
    reservation.status = status;
    await reservation.save();
    res.json({ msg: `Reservation ${status}`, reservation });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};