import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductRepository } from "./product.repository";
import { CreateProductDto } from "./dto/create-product.dto";
import { PageOptionsDto } from "src/common/dto/page-option.dto";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { PageDto } from "src/common/dto/page.dto";
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class ProductService {

    constructor(@InjectRepository(Product)
    private readonly productRepository: ProductRepository) { }

    async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Product>> {

        const queryBuilder : SelectQueryBuilder<Product> = this.productRepository.createQueryBuilder("product");

        const search: string = pageOptionsDto.search ? pageOptionsDto.search.toLowerCase() : '';

        const skip: number = (pageOptionsDto.page - 1) * pageOptionsDto.take;

        queryBuilder
            .leftJoinAndSelect('product.category', 'category')
            .where('LOWER(product.name) LIKE :search', { search: `%${search}%` })
            .orderBy('product.createdAt', pageOptionsDto.order)
            .skip(skip)
            .take(pageOptionsDto.take);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();
        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        return new PageDto(entities, pageMetaDto);
    }

    async create({ name, categoryId, description, price }: CreateProductDto): Promise<boolean> {

        const product = await this.productRepository.save({ name, categoryId, description, price });

        return !!product;
    }

    async update(id, { name, categoryId, description, price }: CreateProductDto): Promise<boolean> {

        const isIdExist = await this.isProductIdExist(id);
        if (!isIdExist) {
            throw new NotFoundException("Product not found");
        }

        // Find the product by ID
        const product = await this.findById(id);

        product.name = name;
        product.categoryId = categoryId;
        product.description = description;
        product.price = price;

        // Save the updated product back to the database
        const productupdated = await this.productRepository.save(product);

        return !!productupdated;
    }

    async deleteProductById(id: number): Promise<void> {
        const isExist = await this.isProductIdExist(id);
        if (!isExist) {
            throw new NotFoundException('Product not found');  // Throw error if the product doesn't exist
        }

        await this.productRepository.delete(id);
    }

    async updateStatus(id: number): Promise<boolean> {
        // Check if the product exists
        const isIdExist = await this.isProductIdExist(id);
        if (!isIdExist) {
            throw new NotFoundException("Product not found");
        }

        // Find the product by ID
        const product = await this.findById(id);

        product.status = !product.status;

        // Save the updated product back to the database
        const productupdated = await this.productRepository.save(product);

        return productupdated ? true : false;  // Optionally return the updated product
    }

    async updatePopular(id: number): Promise<boolean> {
        // Check if the product exists
        const isIdExist = await this.isProductIdExist(id);
        if (!isIdExist) {
            throw new NotFoundException("Product not found");
        }

        // Find the product by ID
        const product = await this.findById(id);

        product.isPopular = !product.isPopular;

        // Save the updated product back to the database
        const productupdated = await this.productRepository.save(product);

        return productupdated ? true : false;  // Optionally return the updated product
    }


    async isProductIdExist(id: number): Promise<boolean> {
        const product = await this.findById(id);

        return !!product;
    }

    async findById(id: number) {
        return await this.productRepository.findOne({ where: { id } });
    }

    async findByCategoryId(categoryId: number): Promise<Product[]> {

        if (Number(categoryId) === -1) {
            return await this.productRepository.find({
                relations: ['category'],
                where: {
                    isPopular: true,
                    status: true
                }
            });

        }

        return await this.productRepository.find({
            relations: ['category'],
            where: {
                categoryId,
                status: true
            }
        });
    }
}