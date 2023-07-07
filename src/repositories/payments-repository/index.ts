import { prisma } from '@/config';
import { CardData } from '@/protocols';

async function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(card: CardData, ticketId: number, value: number) {
  const cardNumber = card.number.toString();
  const lastDigits = cardNumber.slice(-4);
  return prisma.payment.create({
    data: {
      ticketId,
      value,
      cardIssuer: card.issuer,
      cardLastDigits: lastDigits,
    },
  });
}

const paymentRepository = {
  getPayment,
  createPayment,
};

export default paymentRepository;
