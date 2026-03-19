import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BorrowBookDto {
  @ApiProperty({ example: 'M001', description: 'Member code' })
  @IsString()
  @IsNotEmpty()
  memberCode!: string;

  @ApiProperty({ example: 'JK-45', description: 'Book code' })
  @IsString()
  @IsNotEmpty()
  bookCode!: string;

  @ApiPropertyOptional({
    example: '2026-03-24T12:00:00Z',
    description: 'Borrow date',
  })
  @IsOptional()
  @IsDateString()
  borrowedAt?: string;
}

export class ReturnBookDto {
  @ApiProperty({ example: 'M001', description: 'Member code' })
  @IsString()
  @IsNotEmpty()
  memberCode!: string;

  @ApiProperty({ example: 'JK-45', description: 'Book code' })
  @IsString()
  @IsNotEmpty()
  bookCode!: string;

  @ApiPropertyOptional({
    example: '2026-03-31T12:00:00Z',
    description: 'Return date',
  })
  @IsOptional()
  @IsDateString()
  returnedAt?: string;
}
