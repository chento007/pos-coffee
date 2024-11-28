import { ApiProperty } from '@nestjs/swagger'


import { IsOptional, IsString } from 'class-validator'

export class TelegrafPayloadCallBackDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  update_id: string

  @ApiProperty()
  @IsOptional()
  message: any
}