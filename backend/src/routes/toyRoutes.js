import express from "express"
import {getAllToys , getToyById}  from "../controllers/toyController.js";


const toyRouter = express.Router()

toyRouter.get("/",getAllToys)
toyRouter.get("/:id",getToyById)

export default toyRouter;