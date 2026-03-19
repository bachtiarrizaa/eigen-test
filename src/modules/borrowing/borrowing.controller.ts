import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BorrowBookUseCase } from './application/use-case/borrow-book.use-case';
import { ReturnBookUseCase } from './application/use-case/return-book.use-case';
import { BorrowBookDto, ReturnBookDto } from './application/dtos/borrowing.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@ApiTags('borrowing')
@Controller('borrowing')
export class BorrowingController {
  constructor(
    private readonly borrowBookUseCase: BorrowBookUseCase,
    private readonly returnBookUseCase: ReturnBookUseCase,
  ) {}

  @Post('borrow')
  @ResponseMessage('Book borrowed successfully')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Member borrows a book' })
  @ApiResponse({ status: 201, description: 'Book borrowed successfully.' })
  async borrow(@Body() dto: BorrowBookDto) {
    return this.borrowBookUseCase.execute(
      dto.memberCode,
      dto.bookCode,
      dto.borrowedAt,
    );
  }

  @Post('return')
  @ResponseMessage('Book returned successfully')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Member returns a book' })
  @ApiResponse({ status: 200, description: 'Book returned successfully.' })
  async returnBook(@Body() dto: ReturnBookDto) {
    return this.returnBookUseCase.execute(
      dto.memberCode,
      dto.bookCode,
      dto.returnedAt,
    );
  }
}
