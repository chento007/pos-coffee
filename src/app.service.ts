import { Injectable, OnModuleInit } from "@nestjs/common";
import { MockService } from "./mock/mock.service";

@Injectable()
export class AppService implements OnModuleInit{ 

  constructor(
    private readonly mockService: MockService,
  ) {}

  async onModuleInit() {
    await this.mockService.mock();  
  }
}
