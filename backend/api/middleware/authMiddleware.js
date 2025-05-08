import jwt from "jsonwebtoken";

/**
 * JWT doğrulama middleware
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Auth header'ı al
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Oturum açmanız gerekiyor",
      });
    }

    // Token'ı extract et
    const token = authHeader.split(" ")[1];

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcı bilgilerini request'e ekle
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("JWT doğrulama hatası:", error);
    return res.status(401).json({
      success: false,
      message: "Geçersiz oturum",
    });
  }
};
