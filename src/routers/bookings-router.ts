import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createBooking, getBooking, updateBooking } from '@/controllers';
import { createBookingSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', validateBody(createBookingSchema), createBooking)
  .put('/:bookingId', validateBody(createBookingSchema), updateBooking);

export { bookingsRouter };
