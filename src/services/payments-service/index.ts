import paymentRepository from '@/repositories/payments-repository';
import ticketRepository from '@/repositories/tickets-repository';
import { notFoundError, unauthorizedError } from '@/errors';
import { PaymentBody } from '@/protocols';

export async function getPayment(ticketId: number, userId: number) {
  const tickets = await ticketRepository.findTicketById(ticketId);
  if (!tickets) {
    throw notFoundError();
  }

  const enrollment = await ticketRepository.validateUserTicket(ticketId);
  if (enrollment.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }

  const payment = await paymentRepository.getPayment(ticketId);
  if (!payment) {
    throw notFoundError();
  }

  return payment;
}

export async function createPayment(body: PaymentBody, userId: number) {
  const tickets = await ticketRepository.findTicketById(body.ticketId);
  if (!tickets) {
    throw notFoundError();
  }

  const enrollment = await ticketRepository.validateUserTicket(body.ticketId);
  if (enrollment.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }

  await paymentRepository.createPayment(body.cardData, body.ticketId, tickets.TicketType.price);
  await ticketRepository.update(body.ticketId);

  const payment = await paymentRepository.getPayment(body.ticketId);
  return payment;
}

const paymentService = {
  getPayment,
  createPayment,
};

export default paymentService;
