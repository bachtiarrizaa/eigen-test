import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IBookRepository } from '../../domain/interfaces/book.repository';
import { BOOK_REPOSITORY } from '../../domain/interfaces/book.repository';
import { Book } from '../../domain/entities/book.entity';
import { CreateBookDto } from '../dtos/book.dto';

@Injectable()
export class CreateBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(dto: CreateBookDto): Promise<Book> {
    const existing = await this.bookRepository.findByCode(dto.code);
    if (existing) {
      throw new BadRequestException('Book with this code already exists');
    }

    const book = new Book(dto.code, dto.title, dto.author, dto.stock);
    await this.bookRepository.save(book);
    return book;
  }
}
