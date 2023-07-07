import { Prisma, Ticket, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

async function findAllTypes() {
  return prisma.ticketType.findMany();
}

async function findTickets(ticketId: number) {
  return prisma.ticket.findFirst({
    include: {
      TicketType: true,
    },
    where: {
      enrollmentId: ticketId,
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
  return prisma.ticket.updateMany({
    data: {
      status: TicketStatus.PAID,
    },
    where: {
      id,
    },
  });
}

async function findTicketById(id: number) {
  return prisma.ticket.findUnique({
    include: {
      TicketType: true,
    },
    where: {
      id,
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
