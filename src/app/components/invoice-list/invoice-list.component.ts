import { Component, inject } from '@angular/core';
import { Invoice } from './../../models/invoice.model';
import { InvoiceService } from './../../services/invoice.service';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css'
})
export class InvoiceListComponent {
  calendar = inject(NgbCalendar);
	formatter = inject(NgbDateParserFormatter);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null = this.calendar.getToday();
	toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 10);

  invoices: Array<Invoice> = [];

  constructor(private invoiceService: InvoiceService) { }

  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

  isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

  isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

  isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

  onSearch():void {
    const startDate: Date = new Date(
      this.fromDate?.year || 0,
      this.getMonth(this.fromDate?.month || 0),
      this.fromDate?.day || 0
    );

    const endDate: Date = new Date(
      this.toDate?.year || 0,
      this.getMonth(this.toDate?.month || 0),
      this.toDate?.day || 0
    );

    this.invoiceService.getWithRangeDates(startDate, endDate)
      .subscribe({
        next: (data) => {
          this.invoices = data.data;
        },
        error: (e) => console.error(e)
      });
  }

  private getMonth(month: number): number {
    return month > 0 ? month - 1 : month
  }
}
