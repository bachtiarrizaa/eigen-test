import { Borrowing } from '../entities/borrowing.entity';

export const BORROWING_REPOSITORY = 'BORROWING_REPOSITORY';

export interface IBorrowingRepository {
  findById(id: string): Promise<Borrowing | null>;
  findByMemberAndBook(
    memberCode: string,
    bookCode: string,
    isActive: boolean,
  ): Promise<Borrowing | null>;
  findActiveByMember(memberCode: string): Promise<Borrowing[]>;
  findActiveByBook(bookCode: string): Promise<Borrowing[]>;
  save(borrowing: Borrowing): Promise<void>;
}
