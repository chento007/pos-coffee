import { updateUserDto } from './dto/update-user.dto';
import { RoleService } from './../role/role.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { Hash } from 'src/utils/Hash';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenBaseRest } from '../auth/dto/token-base-rest.dto';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private roleService: RoleService
  ) { }

  public async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder("user");
  
    const search = pageOptionsDto.search ? pageOptionsDto.search.toLowerCase() : '';
    const skip: number = (pageOptionsDto.page - 1) * pageOptionsDto.take;
  
    // Build the query
    queryBuilder
      .select([
        "user.id",
        "user.uuid",
        "user.chatId",
        "user.username",
        "user.fullname",
        "user.phone",
        "user.email",
        "user.status",
        "user.createdAt",
        "user.updatedAt",
      ])
      .leftJoinAndSelect('user.roles', 'role')  
      .where('LOWER(user.username) LIKE :search', { search: `%${search}%` })
      .orderBy("user.createdAt", pageOptionsDto.order)
      .skip(skip)
      .take(pageOptionsDto.take);
  
    const itemCount = await queryBuilder.getCount();
  
    const users = await queryBuilder.getMany(); 
  
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
  
    return new PageDto(users, pageMetaDto);
  }

  async updateStatus(id: number): Promise<boolean> {
    const isIdExist = await this.isUserExist(id);
    if (!isIdExist) {
        throw new NotFoundException("Product not found");
    }

    const user = await this.findById(id);

    user.status = !user.status;

    const productupdated = await this.userRepository.save(user);

    return productupdated ? true : false;  
}
  

  public async create(createUserDto: CreateUserDto): Promise<TokenBaseRest> {
    let { email, password, confirmedPassword, username, roleIds } = createUserDto;

    const isEmilExsit = await this.userRepository.findOneBy({ email: email });
    if (isEmilExsit) {
      throw new BadRequestException('Email is already exist.');
    }

    const isUsernameExist = await this.userRepository.findAndCountBy({
      username: username,
    });
    if (isEmilExsit) {
      throw new BadRequestException('Username is already exist.');
    }

    password = await Hash.makeHash(password);

    const roles = await this.roleService.findByIds(roleIds);

    const user = await this.userRepository.save({ email, password, username, roles: roles });
    
    const token = await this.getTokens(user.id);
    
    await this.updateRefreshToken(user.id, token.refresh);

    return token;
  }

  public async update(id: number, createUserDto: updateUserDto): Promise<boolean> {
    const { email, username, roleIds, phone } = createUserDto;

    // Find user by ID
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],  // Ensure roles are loaded
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    // Update user fields
    user.username = username;
    user.phone = phone;
    user.email = email;

    // Update roles if provided
    if (roleIds) {
      const roles = await this.roleService.findByIds(roleIds);
      if (!roles || roles.length === 0) {
        throw new BadRequestException('Invalid role(s) provided.');
      }

      user.roles = roles;
    }

    // Save the updated user, including roles
    await this.userRepository.save(user);

    return true;
  }


  public async delete(id: number): Promise<boolean> {

    const isExist = await this.isUserExist(id);
    if (isExist) {
      const user = await this.userRepository.update(id, {
        status: false
      });

      return true;
    }
    return false;
  }

  public async isUserExist(id: number) {
    const isUserExist = await this.findById(id);

    if (isUserExist) {
      return true;
    }
    return false;
  }

  public async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } })
  }


  public async updateRefreshToken(userId: number, refresh: string) {
    if (!userId) {
      throw new Error('User ID must be provided');
    }
  
    const hashedRefreshToken = await Hash.makeHash(refresh);
    
    // Ensure the criteria (userId) is provided as part of an object
    const result = await this.userRepository.update(
      { id: userId }, // criteria
      { refresh: hashedRefreshToken } // values to update
    );
  
    // Optionally check if the update was successful
    if (result.affected === 0) {
      throw new Error('User not found or update failed');
    }
  }
  

  public async getTokens(userId: number) {
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(
        { id: userId },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      ),
      this.jwtService.signAsync(
        { id: userId },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_EXPIRATION_TIME',
          ),
        },
      ),
    ]);

    return {
      access,
      refresh,
    };
  }

  public async get(userId: number) {
    return await this.userRepository.findBy({ id: userId });
  }
}
