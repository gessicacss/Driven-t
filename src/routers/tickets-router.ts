import { Router } from 'express';
import { createTicket, getTicket, getTicketsTypes } from '@/controllers/tickets-controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketSchema } from '../schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsTypes)
  .get('', getTicket)
  .post('', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
