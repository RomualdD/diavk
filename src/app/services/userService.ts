import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../user';
import { MessageService } from '../message.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
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

  getUser(token: string): Observable<User> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    const url = `${this._apiDiavk}users/profil/`;
    return this.http.get<User>(url, this.httpOptions).pipe(
      tap((user: User) => this.log(`fetched user id=${user.id}`)),
      catchError(this.handleError<User>(`getUser`))
    );
  }

  login(user: User): Observable<User> {
    const url = `${this._apiDiavk}users/login/`;
    return this.http.post<User>(url, user, this.httpOptions).pipe(
      tap((user: User) => this.log(`login user w/ id=${user.id}`)),
      catchError(this.handleError<User>('Don\'t have login'))
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this._apiDiavk}users/register/`, user, this.httpOptions).pipe(
      tap((newUser: User) => this.log(`login user w/ id=${newUser.id}`)),
      catchError(this.handleError<User>('addUser'))
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
