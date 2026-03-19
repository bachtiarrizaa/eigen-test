import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMemberCode } from '../../domain/validators/is-member-code.validator';

export class CreateMemberDto {
  @ApiProperty({
    example: 'M001',
    description: 'Member code (must start with M)',
  })
  @IsString()
  @IsNotEmpty()
  @IsMemberCode()
  code!: string;

  @ApiProperty({ example: 'Angga' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdateMemberDto {
  @ApiProperty({
    example: 'M002',
    description: 'Member code (must start with M)',
  })
  @IsString()
  @IsNotEmpty()
  @IsMemberCode()
  code!: string;

  @ApiProperty({ example: 'Angga' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
