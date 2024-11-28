import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { Roles } from "src/common/decorator/roles.decorator";
import { AppRoles } from "src/common/enum/roles.enum";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/common/guard/roles.guard";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { PageDto } from "src/common/dto/page.dto";
import { PageOptionsDto } from "src/common/dto/page-option.dto";

@Controller('api/categories')
@ApiTags('categories')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    public async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return await this.categoryService.create(createCategoryDto);
    }

    @Get()
    @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    public async getAll(@Query() pageOptionsDto: PageOptionsDto,): Promise<PageDto<Category>> {
        return await this.categoryService.findAllCategory(pageOptionsDto);
    }


    @Put(':id')
    @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    public async update(@Param('id') id: number,@Body() createCategoryDto: CreateCategoryDto): Promise<boolean> {
        return await this.categoryService.update(id,createCategoryDto);
    }

    @Put('status/:id')
    @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    public async updateStatus(@Param('id') id: number): Promise<boolean> {
        return await this.categoryService.updateStatus(id);
    }
}