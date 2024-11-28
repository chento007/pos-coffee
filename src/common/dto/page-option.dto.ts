import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Order } from "../constant/order-by.contant";

export class PageOptionsDto {

    @IsString()
    @IsOptional()
    readonly search?: string

    @ApiPropertyOptional({ enum: Order, default: Order.DESC })
    @IsEnum(Order)
    @IsOptional()
    readonly order?: Order = Order.DESC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 50,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    readonly take?: number = 10;

    get skip(): number {
        console.log("page: ", this.page);   // Debug log
        console.log("take: ", this.take);   // Debug log
        return (this.page && this.take) ? (this.page - 1) * this.take : 0;
    }
    

}