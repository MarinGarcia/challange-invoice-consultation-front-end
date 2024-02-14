import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceResponse } from '../interfaces/invoice-response';
import { environment } from './../../environments/environment';
import moment from 'moment';

const baseUrl = `${environment.apiURL}api/v1/invoices`;

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) {
  }

  getWithRangeDates(startDate: Date, endDate: Date): Observable<InvoiceResponse> {
    const headers= new HttpHeaders().set('Authorization', `Bearer ${environment.token}`)
    const start: string = moment(startDate).format("YYYY-MM-DD hh:mm:ss");
    const end: string = moment(endDate).format("YYYY-MM-DD hh:mm:ss");

    return this.http.get<InvoiceResponse>(
      `${baseUrl}?start_date=${start}&end_date=${end}`,
      { 'headers': headers});
  }
}
