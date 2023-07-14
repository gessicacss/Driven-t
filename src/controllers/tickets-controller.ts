import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketService from '@/services/ticket-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketsTypes(_req: Request, res: Response) {
  try {
    const tickets = await ticketService.getTicketsTypes();
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const tickets = await ticketService.getTickets(userId);
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;
  try {
    const tickets = await ticketService.createTicket(userId, ticketTypeId);
    return res.status(httpStatus.CREATED).send(tickets);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
