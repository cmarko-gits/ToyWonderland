import express from "express";
import { auth } from "../middleware/authMiddlware.js";
import {
  createReservation,
  getUserReservation,
  getAllReservation,
  updateReservation
} from "../controllers/reservationController.js";

const Reservationrouter = express.Router();

Reservationrouter.post("/add-reservation", auth, createReservation);
Reservationrouter.get("/my-reservations", auth, getUserReservation);
Reservationrouter.get("/all-reservations", auth, getAllReservation);
Reservationrouter.put("/update/:id", auth, updateReservation);

export default Reservationrouter;
