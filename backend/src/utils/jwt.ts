import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../middleware/auth";

export const sign = (clientId: number, isAdmin: boolean): string => {
  return jwt.sign({ id: clientId, isAdmin }, JWT_SECRET, { expiresIn: '24h' });
}