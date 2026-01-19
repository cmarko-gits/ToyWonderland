import mongoose from "mongoose";

const reservationItemSchema = new mongoose.Schema({
  toy: { type: mongoose.Schema.Types.ObjectId, ref: "Toys", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  reviewed: { type: Boolean, default: false } 
});

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [reservationItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["reserved", "arrived", "canceled"],
    default: "reserved"
  }
}, { timestamps: true });

export default mongoose.model("Reservation", reservationSchema);
