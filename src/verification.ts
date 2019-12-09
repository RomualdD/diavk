import { Moment } from 'moment';

export class Verification {
  id: number;
  verification: string;
  one_hour: string;
  two_hour: string;
  three_hour: string;
  four_hour: string;
  notification: string;
  verification_date: Moment;
  user: number;
}
