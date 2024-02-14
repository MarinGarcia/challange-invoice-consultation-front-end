import { Invoice } from "../models/invoice.model";

export interface InvoiceResponse {
  records: number;
  data: Array<Invoice>
}
