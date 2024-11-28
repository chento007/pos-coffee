import { AppRoles } from 'src/common/enum/roles.enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { CommonEntity } from 'src/common/entity/common.entity';

@Entity()
export class Role extends CommonEntity {
  constructor() {
    super();
    this.id = 1;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  name: AppRoles;

  @ManyToMany(() => User, (user) => user.roles)
  user: User[];
}
