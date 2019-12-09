import { Moment } from 'moment';

export class Appointment {
  id: number;
  name: string;
  date: Moment;
  hour: string;
  additional_informations: string;
  remarque: string;
  user: number;
}
