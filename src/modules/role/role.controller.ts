import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RoleService } from "./role.service";
import { Roles } from "src/common/decorator/roles.decorator";
import { AppRoles } from "src/common/enum/roles.enum";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/common/guard/roles.guard";
import { PageOptionsDto } from "src/common/dto/page-option.dto";
import { PageDto } from "src/common/dto/page.dto";
import { Role } from "./role.entity";

@Controller('api/roles')
@ApiTags('roles')
export class RoleController {

    constructor(private readonly roleService: RoleService) { }
    @Get()
    @Roles([AppRoles.ADMIN, AppRoles.MANAGER])
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    public getAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<Role>> {
      return this.roleService.findAll(pageOptionsDto);
    }
}