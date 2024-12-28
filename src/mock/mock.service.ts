import { Injectable } from '@nestjs/common';
import { AppRoles } from 'src/common/enum/roles.enum';
import { Category } from 'src/modules/category/category.entity';
import { CategoryService } from 'src/modules/category/category.service';
import { CreateCategoryDto } from 'src/modules/category/dto/create-category.dto';
import { InvoiceDto } from 'src/modules/invoice/dto/invoice.dto';
import { Invoice } from 'src/modules/invoice/invoice.entity';
import { InvoiceService } from 'src/modules/invoice/invoice.service';
import { CreateProductDto } from 'src/modules/product/dto/create-product.dto';
import { Product } from 'src/modules/product/product.entity';
import { ProductService } from 'src/modules/product/product.service';
import { RoleService } from 'src/modules/role/role.service';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/user.entity';
import { UsersService } from 'src/modules/user/user.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class MockService {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UsersService,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly invoiceService: InvoiceService,
  ) {}

  @Transactional()
  async mock(): Promise<boolean> {
    console.log('start mock...');
    
    const isExist = await this.roleService.hasOne();

    if (isExist) {
      console.log('it exist can not mock');
      
      return;
    }

    // Create roles
    const employee = await this.roleService.create(AppRoles.EMPLOYEE);
    const admin = await this.roleService.create(AppRoles.ADMIN);
    const manager = await this.roleService.create(AppRoles.MANAGER);

    // Create users
    const users: CreateUserDto[] = [
      {
        username: 'john_doe',
        phone: '123-456-7890',
        email: 'john.doe@example.com',
        password: 'Password@123',
        confirmedPassword: 'Password@123',
        roleIds: [employee.id, admin.id, manager.id],
      },
      {
        username: 'jane_smith',
        phone: '321-654-0987',
        email: 'jane.smith@example.com',
        password: 'Password@123',
        confirmedPassword: 'Jane@2024!',
        roleIds: [employee.id],
      },
    ];

    const userList: User[] = [];
    for (const user of users) {
      const userCreated = await this.userService.createUser(user);
      userList.push(userCreated);
    }

    // Create categories
    const categories: CreateCategoryDto[] = [
      {
        name: 'Appetizers',
        description: 'Starters for meals.',
      },
      {
        name: 'Desserts',
        description: 'Sweet treats.',
      },
    ];

    const categoryList: Category[] = [];
    for (const category of categories) {
      const categoryCreated = await this.categoryService.create(category);
      categoryList.push(categoryCreated);
    }

    // Create products
    const productDtos: CreateProductDto[] = [
      {
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter.',
        price: 5.0,
        categoryId: categoryList.find(c => c.name === 'Appetizers').id,
      },
      {
        name: 'Cheesecake',
        description: 'Creamy cheesecake with strawberry topping.',
        price: 7.0,
        categoryId: categoryList.find(c => c.name === 'Desserts').id,
      },
    ];

    const productList: Product[] = [];
    for (const product of productDtos) {
      const productCreated = await this.productService.createProduct(product);
      productList.push(productCreated);
    }

    // Create invoices
    const invoices: InvoiceDto[] = [
      {
        discount: 10,
        totalAmount: 250.0,
        items: [
          {
            productId: productList.find(p => p.name === 'Garlic Bread').id,
            quantity: 2,
            discount: 5,
            unitPrice: 5.0,
            totalPrice: 9.5, // After a 5% discount
          },
          {
            productId: productList.find(p => p.name === 'Cheesecake').id,
            quantity: 3,
            unitPrice: 7.0,
            totalPrice: 21.0, // No discount applied
          },
        ],
      },
    ];

    const invoiceList: Invoice[] = [];
    for (const invoice of invoices) {
      const invoiceCreated = await this.invoiceService.create(invoice);
      invoiceList.push(invoiceCreated);
    }

    return true;
  }
}
