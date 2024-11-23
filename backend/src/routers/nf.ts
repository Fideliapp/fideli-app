import { Router } from 'express';
import * as Controller from '../controller/nf';

export const router = Router()
  .post('/', Controller.create)
  .get('/enterprise/:empresaId', Controller.getByEnterprise);
