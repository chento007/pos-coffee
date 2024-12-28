import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorator/roles.decorator';
import { AppRoles } from 'src/common/enum/roles.enum';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoiceService } from './invoice.service';
import { Invoice } from './invoice.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Controller('api/invoices')
@ApiTags('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBody({ type: InvoiceDto })
  public async create(@Body() createInvoiceDto: InvoiceDto): Promise<Invoice> {
    return await this.invoiceService.create(createInvoiceDto);
  }

  @Get()
//   @Roles([AppRoles.EMPLOYEE, AppRoles.ADMIN, AppRoles.MANAGER])
//   @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Invoice>> {
    return this.invoiceService.findAll(pageOptionsDto);
  }
}
