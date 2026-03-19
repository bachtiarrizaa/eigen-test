import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
} from '@mikro-orm/postgresql';
import { BorrowingOrmEntity } from '../borrowing.orm-entity';
import { Borrowing } from '../../domain/entities/borrowing.entity';
import { BorrowingMapper } from '../mappers/borrowing.mapper';
import { MemberOrmEntity } from '../../../member/infrastructure/member.orm-entity';
import { BookOrmEntity } from '../../../book/infrastructure/book.orm-entity';
import { IBorrowingRepository } from '../../domain/interfaces/borrowing.repository';

@Injectable()
export class BorrowingRepository implements IBorrowingRepository {
  constructor(
    @InjectRepository(BorrowingOrmEntity)
    private readonly repository: EntityRepository<BorrowingOrmEntity>,
    private readonly em: EntityManager,
  ) {}

  async findById(id: string): Promise<Borrowing | null> {
    const ormBorrowing = await this.repository.findOne(
      { id },
      { populate: ['member', 'book'] },
    );
    return ormBorrowing ? BorrowingMapper.toDomain(ormBorrowing) : null;
  }

  async findByMemberAndBook(
    memberCode: string,
    bookCode: string,
    isActive: boolean,
  ): Promise<Borrowing | null> {
    const where: FilterQuery<BorrowingOrmEntity> = {
      member: { code: memberCode },
      book: { code: bookCode },
    };
    if (isActive) {
      where.returnedAt = null;
    }
    const ormBorrowing = await this.repository.findOne(where, {
      populate: ['member', 'book'],
    });
    return ormBorrowing ? BorrowingMapper.toDomain(ormBorrowing) : null;
  }

  async findActiveByMember(memberCode: string): Promise<Borrowing[]> {
    const ormBorrowings = await this.repository.find(
      { member: { code: memberCode }, returnedAt: null },
      { populate: ['member', 'book'] },
    );
    return ormBorrowings.map((b) => BorrowingMapper.toDomain(b));
  }

  async findActiveByBook(bookCode: string): Promise<Borrowing[]> {
    const ormBorrowings = await this.repository.find(
      { book: { code: bookCode }, returnedAt: null },
      { populate: ['member', 'book'] },
    );
    return ormBorrowings.map((b) => BorrowingMapper.toDomain(b));
  }

  async save(borrowing: Borrowing): Promise<void> {
    const member = await this.em.findOne(MemberOrmEntity, {
      code: borrowing.memberCode,
    });

    const book = await this.em.findOne(BookOrmEntity, {
      code: borrowing.bookCode,
    });

    if (!member || !book) {
      throw new Error('Member or Book not found for borrowing');
    }

    const ormBorrowing = BorrowingMapper.toOrm(borrowing);
    ormBorrowing.member = member;
    ormBorrowing.book = book;

    await this.em.upsert(BorrowingOrmEntity, ormBorrowing);
    await this.em.flush();
  }
}
