import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../middleware/auth";

export const sign = (clientId: number, name: string, isAdmin: boolean): string => {
  return jwt.sign({ id: clientId, isAdmin, name }, JWT_SECRET, { expiresIn: '24h' });
}