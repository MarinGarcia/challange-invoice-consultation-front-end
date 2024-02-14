import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  calendar = inject(NgbCalendar);
	formatter = inject(NgbDateParserFormatter);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null = this.calendar.getToday();
	toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 10);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiQ29udGFMaW5rIn0.52aon-6GGXFyjc_cOG6fOZhY_YMCwiGwvqQZBQ0RJQw');
    this.http.get<any>('http://localhost:3000/api/v1/invoices', { 'headers': headers }).subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => console.info('complete') 
    });
  }

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

  onSearch() {
    console.log("from Date: ", this.fromDate);
    console.log("to Date:", this.toDate);
  }
}
