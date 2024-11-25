import { Router } from 'express';
import * as Controller from '../controller/promotions';

export const router = Router()
  .post('/', Controller.create)
  .get('/enterprise/:empresaId', Controller.getByEmpresa)
  .post('/buy', Controller.buy);
