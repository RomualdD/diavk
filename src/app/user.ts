import { Moment } from 'moment';

export class User {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  password: string;
  birthdate: Moment;
  phone: string;
  phone2: string;
  language: string;
  keyverif: string;
  active: string;
  qrcode: string;
  role: number;
  pathology: number;
}
