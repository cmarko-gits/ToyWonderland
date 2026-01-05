import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { seedDatabase } from "./seed.js";
import authRouter from "./routes/authRouter.js";
import toyRouter from "./routes/toyRoutes.js";
import adminRouter from "./routes/adminRouters.js";
import cartRouter from "./routes/cartRouters.js";
import Reservationrouter from "./routes/reservationRuters.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4200", 
  "http://192.168.1.11:5000",
  "http://10.0.2.2:5000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

connectDB().then(() => {
  seedDatabase(); 
});

app.use("/api/auth", authRouter);
app.use("/api/toys", toyRouter);
app.use("/api/admin", adminRouter);
app.use("/api/cart", cartRouter);
app.use("/api/reservations", Reservationrouter);

app.get("/", (req, res) => res.send("Backend radi!"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server radi na portu: ${PORT}`);
  console.log(`🏠 Lokalno: http://localhost:${PORT}`);
  console.log(`📱 Mreža: http://192.168.1.11:${PORT}`);
});