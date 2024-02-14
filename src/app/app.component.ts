import { Component } from '@angular/core';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InvoiceListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor() { }
}
