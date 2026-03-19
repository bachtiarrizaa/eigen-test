import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { BOOK_REPOSITORY } from '../../../book/domain/interfaces/book.repository';
import { Borrowing } from '../../domain/entities/borrowing.entity';
import { BORROWING_REPOSITORY } from '../../domain/interfaces/borrowing.repository';
import { MEMBER_REPOSITORY } from '../../../member/domain/interfaces/member.repository';
import type { IMemberRepository } from '../../../member/domain/interfaces/member.repository';
import type { IBorrowingRepository } from '../../domain/interfaces/borrowing.repository';
import type { IBookRepository } from '../../../book/domain/interfaces/book.repository';

@Injectable()
export class BorrowBookUseCase {
  constructor(
    @Inject(BORROWING_REPOSITORY)
    private readonly borrowingRepository: IBorrowingRepository,
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(
    memberCode: string,
    bookCode: string,
    date?: string,
  ): Promise<Borrowing> {
    const member = await this.memberRepository.findByCode(memberCode);
    if (!member) {
      throw new BadRequestException('Member not found');
    }

    if (member.isPenalized()) {
      throw new BadRequestException(
        'Member is currently penalized and cannot borrow books',
      );
    }

    const activeBorrowings =
      await this.borrowingRepository.findActiveByMember(memberCode);
    if (activeBorrowings.length >= 2) {
      throw new BadRequestException('Member cannot borrow more than 2 books');
    }

    const book = await this.bookRepository.findByCode(bookCode);
    if (!book) {
      throw new BadRequestException('Book not found');
    }

    if (!book.isAvailable()) {
      throw new BadRequestException('Book is currently out of stock');
    }

    const bookBorrowings =
      await this.borrowingRepository.findActiveByBook(bookCode);
    if (bookBorrowings.length > 0) {
      throw new BadRequestException(
        'Book is already borrowed by another member',
      );
    }

    const borrowedAt = date ? new Date(date) : new Date();

    const borrowing = new Borrowing(memberCode, bookCode, borrowedAt);

    book.decreaseStock();

    await this.bookRepository.save(book);
    await this.borrowingRepository.save(borrowing);

    return borrowing;
  }
}
