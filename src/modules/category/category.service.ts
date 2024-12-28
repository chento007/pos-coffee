import { Injectable } from "@nestjs/common";
import { Category } from "./category.entity";
import { CategoryRepository } from "./product.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Paginated } from "nestjs-paginate";
import { PageOptionsDto } from "src/common/dto/page-option.dto";
import { PageDto } from "src/common/dto/page.dto";
import { PageMetaDto } from "src/common/dto/page-meta.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: CategoryRepository
    ) { }

    async hasOne(): Promise<boolean> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, count] = await this.categoryRepository.findAndCount();
        return count > 0;
      }
    
    public async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    public async create({ name, description }: CreateCategoryDto): Promise<Category> {

        return await this.categoryRepository.save({ name, description });
    }

    public async findAllCategory(pageOptionsDto: PageOptionsDto): Promise<PageDto<Category>> {

        const queryBuilder = this.categoryRepository.createQueryBuilder("category");

        const search = pageOptionsDto.search ? pageOptionsDto.search.toLowerCase() : '';

        const skip: number = (pageOptionsDto.page - 1) * pageOptionsDto.take;

        queryBuilder
            .orderBy("category.createdAt", pageOptionsDto.order)
            .where('LOWER(category.name) LIKE :search', { search: `%${search}%` })
            .skip(skip)
            .take(pageOptionsDto.take);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        return new PageDto(entities, pageMetaDto);
    }

    public async findById(id: number): Promise<Category> {
        return await this.categoryRepository.findOne({ where: { id } })
    }

    public async update(id: number, updateCategoryDto: CreateCategoryDto): Promise<boolean> {
        const category = await this.findById(id);

        category.name = updateCategoryDto.name
        category.description = updateCategoryDto.description

        const categoryUpdated = await this.categoryRepository.save(category);

        return !!categoryUpdated;
    }

    public async updateStatus(id: number): Promise<boolean> {
        const category = await this.findById(id);

        category.status = !category.status

        const categoryUpdated = await this.categoryRepository.save(category);

        return !!categoryUpdated;
    }
}