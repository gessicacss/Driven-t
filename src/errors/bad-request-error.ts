import { ApplicationError } from '@/protocols';

export function badRequestError(): ApplicationError {
  return {
    name: 'BadRequest',
    message: 'HotelId does not exist or its invalid!',
  };
}
