import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBookUseCase } from './application/use-case/create-book.use-case';
import { GetBooksUseCase } from './application/use-case/get-books.use-case';
import { UpdateBookUseCase } from './application/use-case/update-book.use-case';
import { DeleteBookUseCase } from './application/use-case/delete-book.use-case';
import { CreateBookDto, UpdateBookDto } from './application/dtos/book.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(
    private readonly getBooksUseCase: GetBooksUseCase,
    private readonly createBookUseCase: CreateBookUseCase,
    private readonly updateBookUseCase: UpdateBookUseCase,
    private readonly deleteBookUseCase: DeleteBookUseCase,
  ) {}

  @Get()
  @ResponseMessage('Books retrieved successfully')
  @ApiOperation({ summary: 'Get all books and their available quantities' })
  @ApiResponse({ status: 200, description: 'Return all books.' })
  async findAll() {
    return this.getBooksUseCase.execute();
  }

  @Post()
  @ResponseMessage('Book created successfully')
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully.' })
  async create(@Body() dto: CreateBookDto) {
    return this.createBookUseCase.execute(dto);
  }

  @Put(':id')
  @ResponseMessage('Book updated successfully')
  @ApiOperation({ summary: 'Update book' })
  @ApiResponse({ status: 200, description: 'Book updated successfully.' })
  async update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.updateBookUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ResponseMessage('Book deleted successfully')
  @ApiOperation({ summary: 'Delete book' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully.' })
  async delete(@Param('id') id: string) {
    await this.deleteBookUseCase.execute(id);
  }
}
