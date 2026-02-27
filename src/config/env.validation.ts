// src/config/env.validation.ts
import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, Min, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  @Min(1)
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_ACCESS_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;
}

export function envValidation(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`❌ Variables de entorno inválidas:\n${errors.toString()}`);
  }
  return validatedConfig;
}