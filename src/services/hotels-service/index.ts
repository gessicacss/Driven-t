import hotelsRepository from '@/repositories/hotels-repository';
import ticketRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { badRequestError, notFoundError, paymentRequiredError } from '@/errors';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTickets(enrollment.id);
  if (!ticket) throw notFoundError();
  if (
    ticket.status === 'RESERVED' ||
    ticket.TicketType.includesHotel === false ||
    ticket.TicketType.isRemote === true
  ) {
    throw paymentRequiredError();
  }

  const hotels = await hotelsRepository.getAllHotels();
  if (!hotels) throw notFoundError();

  return hotels;
}

async function getHotelsByIdWithRooms(userId: number, hotelId: number) {
  if (!hotelId) {
    throw badRequestError();
  }
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTickets(enrollment.id);
  if (!ticket) throw notFoundError();
  if (
    ticket.status === 'RESERVED' ||
    ticket.TicketType.includesHotel === false ||
    ticket.TicketType.isRemote === true
  ) {
    throw paymentRequiredError();
  }
  const hotel = await hotelsRepository.getHotelById(hotelId);
  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelsServices = {
  getHotels,
  getHotelsByIdWithRooms,
};

export default hotelsServices;
