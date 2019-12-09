import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Verification } from '../verification';
import { MessageService } from '../message.service';
@Injectable({
    providedIn: 'root'
})
export class VerificationService {
    private _apiDiavk = 'http://localhost:8080/api/';

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    constructor(private http: HttpClient, private messageService: MessageService) { }

    private log(message: string) {
      this.messageService.add(`MessageService: ${message}`);
    }

    addVerification(verification: Verification, token: string): Observable<Verification> {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
      return this.http.post<Verification>(`${this._apiDiavk}verification/add`, verification, this.httpOptions).pipe(
        tap((verification: Verification) => this.log(`ajout vérification w/ id=${verification.id}`)),
        catchError(this.handleError<Verification>('addUser'))
      );
    }

    getVerification(token: string): Observable<Verification> {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
      const url = `${this._apiDiavk}verification/get/`;
      return this.http.get<Verification>(url, this.httpOptions).pipe(
        tap((verification: Verification) => this.log(`fetched user id=${verification.id}`)),
        catchError(this.handleError<Verification>(`getVerification`))
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
