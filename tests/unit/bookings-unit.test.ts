import faker from '@faker-js/faker';
import roomRepository from '@/repositories/room-repository';
import ticketRepository from '@/repositories/tickets-repository';
import bookingRepository from '@/repositories/booking-repository';
import bookingService from '@/services/booking-service';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { mockUser } from '../factories';

jest.mock('@/repositories/tickets-repository');

describe('Booking service unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBookings', () => {
    it('should return not found error when user dont have an enrollment', async () => {
      const mockUser = faker.datatype.number();
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(undefined);
      const promise = bookingService.getBooking(mockUser);
      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should return not found error when user dont have a ticket', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockUser);
      jest.spyOn(ticketRepository, 'findTickets').mockResolvedValueOnce(undefined);
      const promise = bookingService.getBooking(mockUser.id);
      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should return not found error when user dont have a booking', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockUser);
      const mockTicket = { status: 'RESERVED', TicketType: { isRemote: false, includesHotel: true } };
      (ticketRepository.findTickets as jest.Mock).mockResolvedValue(mockTicket);

      jest.spyOn(bookingRepository, 'getBooking').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = bookingService.getBooking(mockUser.id);
      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
  });

  describe('createABooking', () => {
    it('should return forbidden error when ticket is remote', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockUser);
      const mockTicket = { status: 'PAID', TicketType: { isRemote: true, includesHotel: false } };
      (ticketRepository.findTickets as jest.Mock).mockResolvedValue(mockTicket);
      const roomId = faker.datatype.number();

      const promise = bookingService.createABooking(roomId, mockUser.id);
      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'You dont have permission to access this.',
      });
    });

    it('should return forbidden error when ticket dont include hotel', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockUser);
      const mockTicket = { status: 'PAID', TicketType: { isRemote: false, includesHotel: false } };
      (ticketRepository.findTickets as jest.Mock).mockResolvedValue(mockTicket);
      const roomId = faker.datatype.number();

      const promise = bookingService.createABooking(roomId, mockUser.id);
      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'You dont have permission to access this.',
      });
    });

    it('should return forbidden error when ticket is not paid', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockUser);
      const mockTicket = { status: 'RESERVED', TicketType: { isRemote: false, includesHotel: true } };
      (ticketRepository.findTickets as jest.Mock).mockResolvedValue(mockTicket);
      const roomId = faker.datatype.number();

      const promise = bookingService.createABooking(roomId, mockUser.id);
      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'You dont have permission to access this.',
      });
    });

    it('should return not found error when room dont exist', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockUser);
      const mockTicket = { status: 'PAID', TicketType: { isRemote: false, includesHotel: true } };
      (ticketRepository.findTickets as jest.Mock).mockResolvedValue(mockTicket);
      const roomId = faker.datatype.number();
      jest.spyOn(roomRepository, 'getRoomInfo').mockResolvedValueOnce(undefined);

      const promise = bookingService.createABooking(roomId, mockUser.id);
      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should return forbidden error when room is full', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockUser);
      const mockTicket = { status: 'PAID', TicketType: { isRemote: false, includesHotel: true } };
      (ticketRepository.findTickets as jest.Mock).mockResolvedValue(mockTicket);
      const roomId = faker.datatype.number();
      jest.spyOn(roomRepository, 'getRoomInfo').mockResolvedValueOnce({
        id: 1,
        name: 'Quarto 1',
        hotelId: 1001,
        createdAt: new Date(),
        updatedAt: new Date(),
        capacity: 0,
        Booking: [],
      });

      const promise = bookingService.createABooking(roomId, mockUser.id);
      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'You dont have permission to access this.',
      });
    });
  });

  describe('updateABooking', () => {
    it('should return forbidden error when user dont have a booking', async () => {
      const roomId = faker.datatype.number();
      const bookingId = faker.datatype.number();
      jest.spyOn(bookingRepository, 'getBooking').mockResolvedValueOnce(undefined);

      const promise = bookingService.updateBooking(bookingId, roomId, mockUser.id);
      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'You dont have permission to access this.',
      });
    });

    it('should return not found error when room dont exist', async () => {
      jest.spyOn(bookingRepository, 'getBooking').mockImplementationOnce((): any => {
        return true;
      });
      const roomId = faker.datatype.number();
      const bookingId = faker.datatype.number();
      jest.spyOn(roomRepository, 'getRoomInfo').mockResolvedValueOnce(undefined);

      const promise = bookingService.updateBooking(bookingId, roomId, mockUser.id);
      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should return forbidden error when room is full', async () => {
      jest.spyOn(bookingRepository, 'getBooking').mockImplementationOnce((): any => {
        return true;
      });
      const roomId = faker.datatype.number();
      const bookingId = faker.datatype.number();
      jest.spyOn(roomRepository, 'getRoomInfo').mockResolvedValueOnce({
        id: 1,
        name: 'Quarto 1',
        hotelId: 1001,
        createdAt: new Date(),
        updatedAt: new Date(),
        capacity: 0,
        Booking: [],
      });

      const promise = bookingService.updateBooking(bookingId, roomId, mockUser.id);
      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'You dont have permission to access this.',
      });
    });
  });
});
