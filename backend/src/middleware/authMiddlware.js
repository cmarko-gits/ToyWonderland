import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.is_admin !== 1) {
    return res.status(403).json({ msg: "Admin access required" });
  }
  next();
};
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // izuzmi password
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};