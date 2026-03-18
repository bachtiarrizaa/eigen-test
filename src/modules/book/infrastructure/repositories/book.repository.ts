import { Injectable } from '@nestjs/common';
import { IBookRepository } from '../../domain/interfaces/book.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BookOrmEntity } from '../book.orm-entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Book } from '../../domain/entities/book.entity';
import { BookMapper } from '../mappers/book.mapper';

@Injectable()
export class BookRepository implements IBookRepository {
  constructor(
    @InjectRepository(BookOrmEntity)
    private readonly repository: EntityRepository<BookOrmEntity>,
    private readonly em: EntityManager,
  ) {}

  async findById(id: string): Promise<Book | null> {
    const ormBook = await this.repository.findOne({ id });
    return ormBook ? BookMapper.toDomain(ormBook) : null;
  }

  async findByCode(code: string): Promise<Book | null> {
    const ormBook = await this.repository.findOne({ code });
    return ormBook ? BookMapper.toDomain(ormBook) : null;
  }

  async findByTitle(title: string): Promise<Book | null> {
    const ormBook = await this.repository.findOne({ title });
    return ormBook ? BookMapper.toDomain(ormBook) : null;
  }

  async findAll(): Promise<Book[]> {
    const ormBooks = await this.repository.findAll();
    return ormBooks.map((book) => BookMapper.toDomain(book));
  }

  async save(book: Book): Promise<void> {
    const ormBook = BookMapper.toOrm(book);
    await this.em.upsert(BookOrmEntity, ormBook);
    await this.em.flush();
  }
  async delete(id: string): Promise<void> {
    await this.repository.nativeDelete({ id });
  }
}
