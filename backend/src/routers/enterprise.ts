import { Router } from 'express';
import * as Controller from '../controller/enterprise';

export const router = Router()
  .post('/', Controller.create)
  .get('/', Controller.get)
  .get('/:id', Controller.getById)
