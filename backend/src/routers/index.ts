import { Router } from 'express';

import * as Auth from './auth'
import * as Card from './card'
import * as Buys from './buys'
import * as Enterprise from './enterprise'
import * as Nf from './nf'
import * as Promotions from './promotions'

import { authenticateToken } from '../middleware/auth';

const router = Router()
  .use('/auth', Auth.router)
  .use(authenticateToken)
  .use('/card', Card.router)
  .use('/enterprise', Enterprise.router)
  .use('/buys', Buys.router)
  .use('/nf', Nf.router)
  .use('/promotions', Promotions.router);

export default router;