import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserRespooneDto } from '../auth/dto/user-respone.dto';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { TokenBaseRest } from '../auth/dto/token-base-rest.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { AppRoles } from 'src/common/enum/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { updateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Controller('api/users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UsersService) { }

  @Get()
  @Roles([AppRoles.ADMIN, AppRoles.MANAGER])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public getAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    return this.userService.findAll(pageOptionsDto);
  }

  @Post()
  @Roles([AppRoles.ADMIN, AppRoles.MANAGER])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public create(@Body() createUserDto: CreateUserDto): Promise<TokenBaseRest> {
    return this.userService.create(createUserDto);
  }

  @Delete(':id')
  @Roles([AppRoles.ADMIN, AppRoles.MANAGER])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public delete(@Param('id') id: number): Promise<boolean> {
    return this.userService.delete(id);
  }

  @Put(':id')
  @Roles([AppRoles.ADMIN, AppRoles.MANAGER])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public update(@Param('id') id: number,@Body() updateDto: updateUserDto): Promise<boolean> {
    return this.userService.update(id,updateDto);
  }

  @Put("status/:id")
  @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async changeStatus(@Param("id") id: number): Promise<boolean> {
      return await this.userService.updateStatus(id);
  }
}
