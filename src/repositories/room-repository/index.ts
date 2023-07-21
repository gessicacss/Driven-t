import { prisma } from '@/config';

async function getRoomInfo(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

const roomRepository = {
  getRoomInfo,
};

export default roomRepository;
