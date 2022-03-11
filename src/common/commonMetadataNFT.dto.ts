import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator'

export class Attribute {
  @IsString()
  @IsNotEmpty()
  type: string

  @IsString()
  @IsNotEmpty()
  value: string
}

export class CreateMetadataNFTDto {
  @IsNumber()
  @IsNotEmpty()
  batchId: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  image: string

  @IsString()
  @IsOptional()
  description?: string

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => Attribute)
  attributes?: Attribute[]
}

export class UpdateMetadataNFTDto {
  @IsNumber()
  @IsOptional()
  batchId: number

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  image?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => Attribute)
  add?: Attribute[]

  @IsArray()
  @IsOptional()
  remove?: string[]
}
