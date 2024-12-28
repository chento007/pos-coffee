import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MockService } from './mock.service';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { ProductModule } from 'src/modules/product/product.module';
import { InvoiceModule } from 'src/modules/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule,
    RoleModule,
    UserModule,
    CategoryModule,
    ProductModule,
    InvoiceModule,
  ],
  controllers: [],
  providers: [MockService],
  exports:[MockService]
})
export class MockModule {}
