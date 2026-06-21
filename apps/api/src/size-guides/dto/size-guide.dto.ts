import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSizeGuideDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  htmlContent: string;
}

export class UpdateSizeGuideDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  htmlContent?: string;
}
