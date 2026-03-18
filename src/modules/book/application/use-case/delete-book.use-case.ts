import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IBookRepository } from '../../domain/interfaces/book.repository';
import { BOOK_REPOSITORY } from '../../domain/interfaces/book.repository';

@Injectable()
export class DeleteBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new BadRequestException('Book not found');
    }

    await this.bookRepository.delete(id);
  }
}
