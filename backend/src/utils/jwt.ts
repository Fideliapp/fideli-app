import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../middleware/auth";

export const sign = (clientId: number, cpf: string): string => {
  return jwt.sign({ id: clientId, cpf }, JWT_SECRET, { expiresIn: '24h' });
}