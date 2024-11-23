import { Router } from 'express';
import * as Controller from '../controller/nf';

export const router = Router()
  .post('/', Controller.create)
