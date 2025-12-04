import express from "express";
import { auth, isAdmin } from "../middleware/authMiddlware.js";
import {
  getAdminProfile,
  addToy,
  updateToy,
  deleteToy,
  getAllToys
} from "../controllers/adminController.js";


const adminRouter = express.Router();

// Dohvatanje admin profila
adminRouter.get("/profile", auth, isAdmin, getAdminProfile);

// Dodavanje nove igračke
adminRouter.post("/toys", auth, isAdmin, addToy);

// Izmena postojeće igračke
adminRouter.put("/toys/:id", auth, isAdmin, updateToy);

// Brisanje igračke
adminRouter.delete("/toys/:id", auth, isAdmin, deleteToy);

// Dohvatanje svih igračaka
adminRouter.get("/toys", auth, isAdmin, getAllToys);

export default adminRouter;
