import { CommonEntity } from '../../common/entity/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { InvoiceItem } from './invoice-item.entity';

@Entity()
export class Invoice extends CommonEntity {
  @Column({
    nullable: true,
    default: 0,
  })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @OneToMany(() => InvoiceItem, (invoiceDetail) => invoiceDetail.invoice, {
    cascade: true,
  })
  details: InvoiceItem[];
}
