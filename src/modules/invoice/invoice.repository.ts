import { Repository } from "typeorm";
import { Invoice } from "./invoice.entity";

export interface InvoiceRepository extends Repository<Invoice> {}
