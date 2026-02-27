// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  nombre: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  @MaxLength(50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener mayúscula, minúscula y número/caracter especial',
  })
  password: string;

  @IsOptional()
  @IsEnum(Role, { message: 'El rol debe ser ADMIN o VENDEDOR' })
  role?: Role;
}