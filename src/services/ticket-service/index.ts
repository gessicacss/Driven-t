import { TicketStatus } from '@prisma/client';
import { notFoundError } from '../../errors';
import enrollmentRepository from '../../repositories/enrollment-repository';
import ticketRepository from '../../repositories/tickets-repository';

export async function getTicketsTypes() {
  return await ticketRepository.findAllTypes();
}

export async function getTickets(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTickets(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }
  return ticket;
}

export async function createTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticketInfo = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
    updatedAt: new Date(Date.now()),
  };

  await ticketRepository.create(ticketInfo);

  const ticket = await ticketRepository.findTickets(enrollment.id);
  return ticket;
}

const ticketService = {
  getTicketsTypes,
  getTickets,
  createTicket,
};

export default ticketService;
