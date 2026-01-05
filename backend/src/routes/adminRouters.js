import express from "express";
import { auth, isAdmin } from "../middleware/authMiddlware.js";
import {
  getAdminProfile,
  addToy,
  updateToy,
  deleteToy,
  getAllToys,
  getAllReservations,
  updateReservationStatus
} from "../controllers/adminController.js";


const adminRouter = express.Router();

adminRouter.get("/profile", auth, isAdmin, getAdminProfile);

adminRouter.post("/toys", auth, isAdmin, addToy);

adminRouter.put("/toys/:id", auth, isAdmin, updateToy);

adminRouter.delete("/toys/:id", auth, isAdmin, deleteToy);

adminRouter.get("/reservations", auth, isAdmin, getAllReservations);
adminRouter.get("/toys", auth, isAdmin, getAllToys);
adminRouter.put("/reservations/:reservationId/status", auth, isAdmin, updateReservationStatus);

export default adminRouter;
