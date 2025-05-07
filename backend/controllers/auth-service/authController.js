import prisma from "../../utils/prisma.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { signToken } from "../../utils/jwt.js";

const normalizeUser = (user) => ({
  ...user,
  id: user.id.toString(),
});

export const signUp = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const existing = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashed,
      },
    });
    if (!user) {
      return res.status(500).json({ message: "Internal server error" });
    }
    const token = signToken({
      userId: user.id.toString(),
    });
    res.status(201).json(normalizeUser(user));
  } catch (error) {
    next(error);
  }
};

export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;
    // 1) Kullanıcıyı bul
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Email veya parola hatalı." });
    }
    // 2) Parolayı karşılaştır
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Email veya parola hatalı." });
    }
    // 3) JWT üret
    const token = signToken({ userId: user.id.toString() });
    res.json({
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function signOut(req, res) {
  // Clear the JWT token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  res.status(200).json({ message: "Çıkış yapıldı." });
}

// Kullanıcı bilgilerini token'dan getiren endpoint
export async function getMe(req, res, next) {
  try {
    // req.userId middleware tarafından token içinden çıkarılıp ekleniyor
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Giriş yapılmadı." });
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    res.json({
      user: {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    next(err);
  }
}
