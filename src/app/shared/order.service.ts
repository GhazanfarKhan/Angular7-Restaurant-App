import { Injectable } from '@angular/core';
import { Order, OrderDTO } from './order.model';
import { OrderItem } from './order-item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  formData: Order;
  orderItems: OrderItem[];
  constructor(private http: HttpClient, private messageService: MessageService) {

  }
  saveOrUpdateOrder(): Observable<Order> {
    const url = `${environment.apiUrl}/Order`;
    var body = {
      ...this.formData,
      OrderItems: this.orderItems
    }
    return this.http.post<Order>(url, body, httpOptions).pipe(
      tap((order: Order) => this.log(`added order `)),
      catchError(this.handleError<Order>('add order'))
    );
  }
  getOrderList() {
    const url = `${environment.apiUrl}/Order`;
    return this.http.get<Order[]>(url)
      .pipe(
        tap(_ => this.log('fetched orders')),
        catchError(this.handleError('getOrderList', []))
      )
  }
  getOrderById(id: number): Observable<any> {
    const url = `${environment.apiUrl}/order/${id}`;
    return this.http.get<any>(url).pipe(
      tap(_ => this.log(`fetched order id = ${id}`)),
      catchError(this.handleError<any>(`getOrderById id=${id}`))
    );
  }

  deleteOrder(id: number) {
    const url = `${environment.apiUrl}/order/${id}`;
    return this.http.delete<any>(url).pipe(
      tap(_ => this.log(`deleted order id = ${id}`)),
      catchError(this.handleError<any>(`deleteOrder id=${id}`))
    );
  }
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
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
