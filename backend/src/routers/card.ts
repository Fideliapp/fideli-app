import { Router } from 'express';
import * as Controller from '../controller/card';

export const router = Router()
  .post('/', Controller.create)
  .get('/user/:userId', Controller.getByUser)
  .get('/:id', Controller.getById)
