import { Router } from 'express';
import * as Controller from '../controller/buys';

export const router = Router()
  .post('/', Controller.create)
  .get('/:clienteId', Controller.getByUser)
