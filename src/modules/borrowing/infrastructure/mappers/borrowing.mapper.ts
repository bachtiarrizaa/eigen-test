import { Borrowing } from '../../domain/entities/borrowing.entity';
import { BorrowingOrmEntity } from '../borrowing.orm-entity';

export class BorrowingMapper {
  static toDomain(ormEntity: BorrowingOrmEntity): Borrowing {
    return new Borrowing(
      ormEntity.member.code,
      ormEntity.book.code,
      ormEntity.borrowedAt,
      ormEntity.returnedAt,
      ormEntity.id,
      ormEntity.updatedAt,
    );
  }

  static toOrm(domainEntity: Borrowing): BorrowingOrmEntity {
    const ormEntity = new BorrowingOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.borrowedAt = domainEntity.borrowedAt;
    ormEntity.returnedAt = domainEntity.returnedAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    return ormEntity;
  }
}
