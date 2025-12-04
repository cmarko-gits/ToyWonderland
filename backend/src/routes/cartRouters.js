import express from 'express'
import { auth } from '../middleware/authMiddlware.js'
import { addToCart,removeItem,getCart,changeQuantity } from '../controllers/cartController.js'

const cartRouter = express.Router()

cartRouter.post("/add",auth,addToCart)
cartRouter.get("/",auth,getCart)
cartRouter.delete("/:toyId",auth,removeItem)
cartRouter.put("/quantity/:toyId", auth, changeQuantity);


export default cartRouter;