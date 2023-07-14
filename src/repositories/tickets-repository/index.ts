import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findAllTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findTickets(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function create(data: CreateTicketParams) {
  return prisma.ticket.create({
    data,
  });
}

async function validateUserTicket(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: true,
    },
  });
}

async function update(id: number) {
  return prisma.ticket.update({
    where: {
      id,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
}

async function findTicketById(id: number) {
  return prisma.ticket.findUnique({
    where: {
      id,
    },
    include: {
      TicketType: true,
    },
  });
}

export type CreateTicketParams = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

const ticketRepository = {
  findAllTypes,
  findTickets,
  create,
  update,
  validateUserTicket,
  findTicketById,
};

export default ticketRepository;
