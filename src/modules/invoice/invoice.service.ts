import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoiceItem } from './invoice-item.entity';
import { InvoiceItemsRepository } from './invoice-items.repository';
import { ProductService } from '../product/product.service';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { SelectQueryBuilder } from 'typeorm';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';

export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: InvoiceRepository,
    @InjectRepository(InvoiceItem)
    private readonly invoicItemseRepository: InvoiceItemsRepository,
    private readonly productService: ProductService,
  ) {}

  async create({ discount, totalAmount, items }: InvoiceDto): Promise<Invoice> {
    const invoice = await this.invoiceRepository.save({
      totalAmount: totalAmount,
      discount: discount,
    });

    for (const {
      productId,
      quantity,
      totalPrice,
      unitPrice,
      discount,
    } of items) {
      const product = await this.productService.findById(productId);
      const invoiceItem = await this.invoicItemseRepository.save({
        product: product,
        quantity: quantity,
        invoice: invoice,
        totalPrice: totalPrice,
        unit_price: unitPrice,
        discount: discount,
      });
    }

    return invoice;
  }

  async hasInvoiceHasOne(): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, count] = await this.invoiceRepository.findAndCount();
    return count > 0;
  }

  async hasInvoiceItemHasOne(): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, count] = await this.invoicItemseRepository.findAndCount();
    return count > 0;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Invoice>> {
    const queryBuilder: SelectQueryBuilder<Invoice> =
      this.invoiceRepository.createQueryBuilder('invoice');

    const search: string = pageOptionsDto.search
      ? pageOptionsDto.search.toLowerCase()
      : '';

    const skip: number = (pageOptionsDto.page - 1) * pageOptionsDto.take;

    queryBuilder
      .leftJoinAndSelect('invoice.details', 'details')
      .leftJoinAndSelect('details.product', 'product')
      .orderBy('invoice.createdAt', pageOptionsDto.order)
      .skip(skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }
}
