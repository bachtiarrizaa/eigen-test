import { Inject, Injectable } from '@nestjs/common';
import { BOOK_REPOSITORY } from '../../domain/interfaces/book.repository';
import type { IBookRepository } from '../../domain/interfaces/book.repository';
import { Book } from '../../domain/entities/book.entity';

@Injectable()
export class GetBooksUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }
}
