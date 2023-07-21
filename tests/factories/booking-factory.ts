import { prisma } from '@/config';

export async function createABooking(roomId: number, userId: number) {
  return prisma.booking.create({
    data: { roomId, userId },
  });
}
