import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SameAs } from 'src/common/validator/same-as.validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @SameAs('password')
  confirmedPassword: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds: number[];
}
