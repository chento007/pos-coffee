import { RoleRepository } from './role.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Role]),
        ConfigModule,
    ],
    controllers: [
        RoleController
    ],
    providers: [RoleService],
    exports: [RoleService], 
})
export class RoleModule { }
