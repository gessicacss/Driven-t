import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(err.message);
    }
    return res.status(httpStatus.BAD_REQUEST).send(err.message);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId: number = parseInt(req.body.roomId);

  try {
    const booking = await bookingService.createABooking(roomId, userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(err.message);
    }
    if (err.name === 'ForbiddenError') {
      return res.status(httpStatus.FORBIDDEN).send(err.message);
    }
    return res.status(httpStatus.BAD_REQUEST).send(err.message);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId: number = parseInt(req.body.roomId);
  const bookingId: number = parseInt(req.params.bookingId);

  try {
    const booking = await bookingService.updateBooking(bookingId, roomId, userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(err.message);
    }
    if (err.name === 'ForbiddenError') {
      return res.status(httpStatus.FORBIDDEN).send(err.message);
    }
    return res.status(httpStatus.BAD_REQUEST).send(err.message);
  }
}
