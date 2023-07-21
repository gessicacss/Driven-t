import bookingRepository from '@/repositories/booking-repository';
import { badRequestError, forbiddenError, notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/tickets-repository';
import roomRepository from '@/repositories/room-repository';

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTickets(enrollment.id);
  if (!ticket) throw notFoundError();

  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function createABooking(roomId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketRepository.findTickets(enrollment.id);

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== 'PAID') {
    throw forbiddenError();
  }

  const roomInfo = await roomRepository.getRoomInfo(roomId);
  if (!roomInfo) {
    throw notFoundError();
  }

  const room = await bookingRepository.getBookingsByRoomId(roomId);
  if (room.length >= roomInfo.capacity) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.createBooking(roomId, userId);
  return { bookingId: booking.id };
}

async function updateBooking(bookingId: number, roomId: number, userId: number) {
  const userHaveBooking = await bookingRepository.getBooking(userId);
  if (!userHaveBooking) throw forbiddenError();

  const roomInfo = await roomRepository.getRoomInfo(roomId);
  if (!roomInfo) {
    throw notFoundError();
  }

  const room = await bookingRepository.getBookingsByRoomId(roomId);
  if (room.length >= roomInfo.capacity) {
    throw forbiddenError();
  }

  const updatedBooking = await bookingRepository.changeBooking(roomId, bookingId);
  return updatedBooking;
}

const bookingService = {
  getBooking,
  createABooking,
  updateBooking,
};

export default bookingService;
