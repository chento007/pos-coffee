import { CommonEntity } from '../../common/entity/common.entity';
import { Column, Entity, ManyToOne } from "typeorm";
import { Invoice } from "./invoice.entity";
import { Product } from "../product/product.entity";

@Entity()
export class InvoiceItem extends CommonEntity{

    @Column({
    nullable: true,
    default: 0
    })
    discount: number;

    @Column({
        type: 'numeric',
        precision: 6,
        scale: 2
    })
    unit_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Invoice, (invoice) => invoice.details, { onDelete: 'CASCADE' })
    invoice: Invoice;

    @ManyToOne(() => Product, { eager: true, onDelete: 'SET NULL' })
    product: Product;
}