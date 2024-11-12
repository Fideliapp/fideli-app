import { Router } from 'express';
import * as Controller from '../controller/buys';

export const router = Router()
  .post('/', Controller.create)
  .get('/:clienteId', Controller.getByUser)
  .get('/points-by-enterprise/:clienteId', Controller.getPointsEnterpriseChart)
  .get('/total-spend/:clienteId', Controller.getUserPointsHistory)
  .get('/resume/:clienteId', Controller.getResume)
