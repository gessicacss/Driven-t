import { Booking } from '@prisma/client';
import Joi from 'joi';

type CreateBookingParams = Omit<Booking, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export const createBookingSchema = Joi.object<CreateBookingParams>({
  roomId: Joi.number().required(),
});
