import { Repository } from "typeorm";
import { Invoice } from "./invoice.entity";
import { InvoiceItem } from "./invoice-item.entity";

export interface InvoiceItemsRepository extends Repository<InvoiceItem> {}
