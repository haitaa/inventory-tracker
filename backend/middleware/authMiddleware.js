import { verifyToken} from "../utils/jwt.js";

export function requireAuth(req, res, next)  {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Authorization header not found" });

    const token = authHeader.split(" ")[1];
    try {
        const payload = verifyToken(token);
        req.userId = payload.userId;
        next()
    } catch  {
        res.status(401).json({ error: "Invalid token" });
    }
}