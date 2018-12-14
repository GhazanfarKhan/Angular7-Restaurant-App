import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private messageService: MessageService) {

  }
  getCustomerList() {
    const url = `${environment.apiUrl}/Customer`;
    return this.http.get<Customer[]>(url)
      .pipe(
        tap(_ => this.log('fetched customer')),
        catchError(this.handleError('getCustomerList', []))
      )
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`Customer Service: ${message}`);
  }

  /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}