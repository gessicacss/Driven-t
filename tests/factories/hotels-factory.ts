import faker from '@faker-js/faker';
import { prisma } from '@/config';

export function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '18',
      capacity: 2,
      hotelId: hotelId,
    },
  });
}

export async function createRoomWthoutCapacity(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '18',
      capacity: 0,
      hotelId: hotelId,
    },
  });
}
