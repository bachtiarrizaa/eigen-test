import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBookCode } from '../../domain/validators/is-book-code.validator';

export class CreateBookDto {
  @ApiProperty({
    example: 'JK-45',
    description: 'Book code (Letters and numbers separated by -)',
  })
  @IsString()
  @IsNotEmpty()
  @IsBookCode()
  code!: string;

  @ApiProperty({ example: 'Harry Potter' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'J.K. Rowling' })
  @IsString()
  @IsNotEmpty()
  author!: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  stock!: number;
}

export class UpdateBookDto {
  @ApiProperty({
    example: 'JK-45',
    description: 'Book code (Letters and numbers separated by -)',
  })
  @IsString()
  @IsNotEmpty()
  @IsBookCode()
  code!: string;

  @ApiProperty({ example: 'Harry Potter' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'J.K. Rowling' })
  @IsString()
  @IsNotEmpty()
  author!: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  stock!: number;
}
