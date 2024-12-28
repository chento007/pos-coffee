import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { InvoiceItemDto } from "./invoice-item.dto";
import { ApiProperty } from "@nestjs/swagger";

export class InvoiceDto{

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    discount?: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    totalAmount: number;

    @ApiProperty({type: InvoiceItemDto,isArray: true})
    @IsNotEmpty()
    items: InvoiceItemDto[]
}