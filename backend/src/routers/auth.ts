import { Router } from 'express';
import * as Controller from '../controller/auth';
import { authenticateToken } from '../middleware/auth';

export const router = Router()
  .post('/login', Controller.login)
  .post('/register', Controller.register)
  .use(authenticateToken)
  .put('/set-admin/:userId', Controller.toggleAdmin)
  .get('/users', Controller.getUsers)
