import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';
import { Repository, In } from 'typeorm';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { AppRoles } from 'src/common/enum/roles.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: RoleRepository,
  ) {}

  async hasOne(): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, count] = await this.roleRepository.findAndCount();
    return count > 0;
  }

  async findByIds(ids: number[]): Promise<Role[]> {
    return await this.roleRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async create(name: AppRoles) {
    return this.roleRepository.save({ name: name });
  }

  public async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Role>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    const search = pageOptionsDto.search
      ? pageOptionsDto.search.toLowerCase()
      : '';

    const skip: number = (pageOptionsDto.page - 1) * pageOptionsDto.take;

    queryBuilder
      .orderBy('role.createdAt', pageOptionsDto.order)
      .where('LOWER(role.name) LIKE :search', { search: `%${search}%` })
      .skip(skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }
}
