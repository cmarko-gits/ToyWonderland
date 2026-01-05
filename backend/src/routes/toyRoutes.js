import express from "express";
import { toggleFavorite, getAllToys, getFavorites, getToyById, rateToy } from "../controllers/toyController.js";
import { auth } from "../middleware/authMiddlware.js";

const toyRouter = express.Router();

toyRouter.get("/favorites/list", auth, getFavorites);

toyRouter.get("/", getAllToys);

toyRouter.get("/:id", getToyById);

toyRouter.post("/:id/favorite", auth, toggleFavorite);
toyRouter.post("/:id/review",auth , rateToy)
export default toyRouter;
