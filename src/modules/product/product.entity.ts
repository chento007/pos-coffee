import { CommonEntity } from '../../common/entity/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Category } from '../category/category.entity';

@Entity()
export class Product extends CommonEntity {
  @Column({
    type: 'text',
  })
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'numeric',
    precision: 6,
    scale: 2
  })
  price: number;

  // @Column({
  //   nullable: true,
  //   default: 0
  // })
  // discount: number;

  // @Column()
  // stockQty: number;

  @Column({
    nullable: true
  })
  order: number;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  @Column({
    default: false
  })
  isPopular: boolean;
}
