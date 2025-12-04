import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRouter from "./routes/authRouter.js";
import toyRouter from "./routes/toyRoutes.js";
import adminRouter from "./routes/adminRouters.js";
import cartRouter from "./routes/cartRouters.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/toys", toyRouter);
app.use("/api/admin", adminRouter);

app.use("/api/cart",cartRouter)
app.get("/", (req, res) => res.send("Backend radi!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
