import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Invoice } from "./invoice.entity";
import { InvoiceItem } from "./invoice-item.entity";
import { InvoiceController } from "./invoice.controller";
import { InvoiceService } from "./invoice.service";
import { ProductModule } from "../product/product.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Invoice,
            InvoiceItem
        ]),
        ConfigModule,
        ProductModule
    ],
    controllers: [InvoiceController],
    providers: [InvoiceService],
    exports: [InvoiceService],
})
export class InvoiceModule { }