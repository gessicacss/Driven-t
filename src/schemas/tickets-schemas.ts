import { Ticket } from '@prisma/client';
import Joi from 'joi';

type CreateTicketParams = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

export const createTicketSchema = Joi.object<CreateTicketParams>({
  ticketTypeId: Joi.number().required(),
});
