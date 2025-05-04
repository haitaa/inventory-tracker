import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma.js";
import { JWT_SECRET } from "../../config/env.js";

const normalizeUser = (user) => ({
  ...user,
  id: user.id.toString(),
});

export const verifyToken = (req, res, next) => {
  const bearer = req.headers["authorization"];
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or invalid" });
  }
  const token = bearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(403).json({ message: "Token invalid" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: BigInt(req.userId),
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(normalizeUser(user));
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};
