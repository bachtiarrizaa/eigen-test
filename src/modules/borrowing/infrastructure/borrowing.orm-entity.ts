import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { MemberOrmEntity } from '../../member/infrastructure/member.orm-entity';
import { BookOrmEntity } from '../../book/infrastructure/book.orm-entity';

@Entity({ tableName: 'borrowings' })
export class BorrowingOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @ManyToOne(() => MemberOrmEntity, { fieldName: 'member_id' })
  member!: MemberOrmEntity;

  @ManyToOne(() => BookOrmEntity, { fieldName: 'book_id' })
  book!: BookOrmEntity;

  @Property({ type: 'timestamptz' })
  borrowedAt: Date = new Date();

  @Property({ type: 'timestamptz', nullable: true })
  returnedAt: Date | null;

  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
