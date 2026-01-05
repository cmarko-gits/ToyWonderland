import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  is_admin: { type: Number, default: 0 },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Toys" }], // OMILJENE IGRAČKE
 reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Toys" }], // opcionalno
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
