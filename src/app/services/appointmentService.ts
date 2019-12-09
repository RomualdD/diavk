import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Appointment } from '../appointment';
import { MessageService } from '../message.service';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
  private _apiDiavk = 'http://localhost:8080/api/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  addAppointment(appointment: Appointment, token: string): Observable<Appointment> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.http.post<Appointment>(`${this._apiDiavk}appointment/add`, appointment, this.httpOptions).pipe(
      tap((newAppointment: Appointment) => this.log(`add appointment w/ id=${newAppointment.id}`)),
      catchError(this.handleError<Appointment>('addAppointment'))
    );
  }

  getAppointment(token: string): Observable<Appointment> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    const url = `${this._apiDiavk}appointment/get/`;
    return this.http.get<Appointment>(url, this.httpOptions).pipe(
      tap((appointment: Appointment) => this.log(`fetched user id=${appointment.id}`)),
      catchError(this.handleError<Appointment>(`getAppointment`))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(error);
    };
  }
}
