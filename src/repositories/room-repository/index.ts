import { prisma } from '@/config';

async function getRoomInfo(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });
}

const roomRepository = {
  getRoomInfo,
};

export default roomRepository;
