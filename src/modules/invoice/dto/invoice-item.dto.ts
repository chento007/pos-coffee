import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class InvoiceItemDto{
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty()
    quantity: number;
  
    @IsOptional()
    @IsNumber()
    @ApiProperty()
    discount?: number;
  
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    unitPrice: number;
  
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    totalPrice: number;
}