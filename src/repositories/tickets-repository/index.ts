import { Prisma, Ticket } from '@prisma/client';
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

export type CreateTicketParams = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

const ticketRepository = {
  findAllTypes,
  findTickets,
  create,
};

export default ticketRepository;
