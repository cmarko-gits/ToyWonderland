import express from 'express'
import { register,login , getCurrentUser , updateProfile} from '../controllers/authController.js'
import { auth , isAdmin } from '../middleware/authMiddlware.js';
import User from '../models/User.js';

const authRouter = express.Router(); // ili authRoutes, ali onda koristi authRoutes
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", auth, (req, res) => {
    res.json({ msg: "Authorized", user: req.user });
});
authRouter.get("/me", auth, getCurrentUser);
authRouter.put("/update-profile", auth, updateProfile);

authRouter.get("/admin", auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("fullName is_admin email");
        res.json({ msg: "Admin access granted", user });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});


export default authRouter;
