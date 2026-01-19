import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { seedDatabase } from "./seed.js";

import authRouter from "./routes/authRouter.js";
import toyRouter from "./routes/toyRoutes.js";
import adminRouter from "./routes/adminRouters.js";
import cartRouter from "./routes/cartRouters.js";
import reservationRouter from "./routes/reservationRuters.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(" CORS attempt blocked from origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/toys", toyRouter);
app.use("/api/admin", adminRouter);
app.use("/api/cart", cartRouter);
app.use("/api/reservations", reservationRouter);

app.get("/", (req, res) => res.send("Backend radi!"));


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB konekcija OK");

    await seedDatabase();
    console.log("Seed baze završen / provera podataka OK");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server radi na portu: ${PORT}`);
      console.log(`🏠 Lokalno: http://localhost:${PORT}`);
      console.log(`📱 Mreža: http://192.168.1.11:${PORT}`);
      console.log(`ℹ️ Proveri rutu: http://localhost:${PORT}/api/toys`);
    });

  } catch (err) {
    console.error(" Greška pri pokretanju servera:", err);
    process.exit(1);
  }
};

startServer();
