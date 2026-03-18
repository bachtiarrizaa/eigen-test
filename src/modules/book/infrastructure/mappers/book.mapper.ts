import { Book } from '../../domain/entities/book.entity';
import { BookOrmEntity } from '../book.orm-entity';

export class BookMapper {
  static toDomain(ormEntity: BookOrmEntity): Book {
    return new Book(
      ormEntity.code,
      ormEntity.title,
      ormEntity.author,
      ormEntity.stock,
      ormEntity.id,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toOrm(domainEntity: Book): BookOrmEntity {
    const ormEntity = new BookOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.code = domainEntity.code;
    ormEntity.title = domainEntity.title;
    ormEntity.author = domainEntity.author;
    ormEntity.stock = domainEntity.stock;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    return ormEntity;
  }
}
