import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IBookRepository } from '../../domain/interfaces/book.repository';
import { BOOK_REPOSITORY } from '../../domain/interfaces/book.repository';
import { Book } from '../../domain/entities/book.entity';
import { UpdateBookDto } from '../dtos/book.dto';

@Injectable()
export class UpdateBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(id: string, dto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new BadRequestException('Book not found');
    }

    const existingBookByCode = await this.bookRepository.findByCode(dto.code);
    if (existingBookByCode && existingBookByCode.id !== id) {
      throw new BadRequestException('Book code already exists');
    }

    const existingBookByTitle = await this.bookRepository.findByTitle(dto.title);
    if (existingBookByTitle && existingBookByTitle.id !== id) {
      throw new BadRequestException('Book with this title already exists');
    }

    const updatedBook = new Book(
      dto.code,
      dto.title,
      dto.author,
      dto.stock,
      book.id,
      book.createdAt,
      book.updatedAt,
    );
    await this.bookRepository.save(updatedBook);
    return updatedBook;
  }
}
