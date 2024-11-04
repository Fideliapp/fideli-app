import { Router } from 'express';
import * as Controller from '../controller/auth';

export const router = Router()
  .post('/login', Controller.login)
  .post('/register', Controller.register)
