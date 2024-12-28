import { Repository } from "typeorm";
import { InvoiceItem } from "./invoice-item.entity";

export interface InvoiceItemRepository extends Repository<InvoiceItem> {}
