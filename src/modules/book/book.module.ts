import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { BookOrmEntity } from './infrastructure/book.orm-entity';
import { BookController } from './book.controller';
import { BookRepository } from './infrastructure/repositories/book.repository';
import { GetBooksUseCase } from './application/use-case/get-books.use-case';
import { BOOK_REPOSITORY } from './domain/interfaces/book.repository';
import { CreateBookUseCase } from './application/use-case/create-book.use-case';
import { UpdateBookUseCase } from './application/use-case/update-book.use-case';
import { DeleteBookUseCase } from './application/use-case/delete-book.use-case';

@Module({
  imports: [MikroOrmModule.forFeature([BookOrmEntity])],
  controllers: [BookController],
  providers: [
    {
      provide: BOOK_REPOSITORY,
      useClass: BookRepository,
    },
    GetBooksUseCase,
    CreateBookUseCase,
    UpdateBookUseCase,
    DeleteBookUseCase,
  ],
  exports: [BOOK_REPOSITORY],
})
export class BookModule {}
