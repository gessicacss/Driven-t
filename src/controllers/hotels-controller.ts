import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsServices from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelsServices.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(err.message);
    }
    if (err.name === 'PaymentRequired') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(err.message);
    }
    return res.status(httpStatus.BAD_REQUEST).send(err.message);
  }
}

export async function getHotelsById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;

  try {
    const hotel = await hotelsServices.getHotelsByIdWithRooms(userId, parseInt(hotelId));
    return res.status(httpStatus.OK).send(hotel);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(err.message);
    }
    if (err.name === 'PaymentRequired') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(err.message);
    }
    return res.status(httpStatus.BAD_REQUEST).send(err.message);
  }
}
