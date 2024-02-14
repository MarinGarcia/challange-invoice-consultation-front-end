import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceResponse } from '../interfaces/invoice-response';
import { environment } from './../../environments/environment';

const baseUrl = `${environment.apiURL}api/v1/invoices`;

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient, private headers: HttpHeaders) { 
    this.headers.set('Authorization', `Bearer ${environment.token}`);
  }

  getWithRangeDates(startDate: Date, endDate: Date): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(
      `${baseUrl}?start_date=${startDate}&end_date=${endDate}`,
      { 'headers': this.headers });
  }
}
