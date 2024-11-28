import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProductService } from "./product.service";
import { Roles } from "src/common/decorator/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/common/guard/roles.guard";
import { AppRoles } from "src/common/enum/roles.enum";
import { Product } from "./product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { PageOptionsDto } from "src/common/dto/page-option.dto";
import { PageDto } from "src/common/dto/page.dto";

@Controller('api/products')
@ApiTags('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    public async getAll(@Query() pageOptionsDto: PageOptionsDto,): Promise<PageDto<Product>> {
        return this.productService.findAll(pageOptionsDto);
    }

    @Post()
    @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    public async create(@Body() createProductDto: CreateProductDto): Promise<boolean> {
        return await this.productService.create(createProductDto);
    }

    @Delete(':id')
    @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async deleteProduct(@Param('id') id: number): Promise<void> {
        await this.productService.deleteProductById(id);
    }

    @Put(':id')
    @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async update(@Param('id') id: number,@Body() createProductDto: CreateProductDto): Promise<void> {
        await this.productService.update(id,createProductDto);
    }

    @Put("status/:id")
    @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    public async changeStatus(@Param("id") id: number): Promise<boolean> {
        return await this.productService.updateStatus(id);
    }

    @Put("popular/:id")
    @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    public async updatePopular(@Param("id") id: number): Promise<boolean> {
        return await this.productService.updatePopular(id);
    }

    @Get("category/:categoryId")
    @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    public async getByCategoryId(@Param("categoryId") categoryId: number): Promise<Product[]> {
        return await this.productService.findByCategoryId(categoryId);
    }
}
