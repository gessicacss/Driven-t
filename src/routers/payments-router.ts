import { Router } from 'express';
import { getPayment, createPayment } from '../controllers/payments-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { createPaymentSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPayment)
  .post('/process', validateBody(createPaymentSchema), createPayment);

export { paymentsRouter };
