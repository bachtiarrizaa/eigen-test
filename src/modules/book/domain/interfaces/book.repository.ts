import { Book } from '../entities/book.entity';

export const BOOK_REPOSITORY = 'BOOK_REPOSITORY';

export interface IBookRepository {
  findById(id: string): Promise<Book | null>;
  findByCode(code: string): Promise<Book | null>;
  findByTitle(title: string): Promise<Book | null>;
  findAll(): Promise<Book[]>;
  save(book: Book): Promise<void>;
  delete(id: string): Promise<void>;
}
