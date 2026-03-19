import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { BORROWING_REPOSITORY } from '../../domain/interfaces/borrowing.repository';
import type { IBorrowingRepository } from '../../domain/interfaces/borrowing.repository';
import { MEMBER_REPOSITORY } from '../../../member/domain/interfaces/member.repository';
import type { IMemberRepository } from '../../../member/domain/interfaces/member.repository';
import { BOOK_REPOSITORY } from '../../../book/domain/interfaces/book.repository';
import type { IBookRepository } from '../../../book/domain/interfaces/book.repository';

@Injectable()
export class ReturnBookUseCase {
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
  ): Promise<void> {
    const borrowing = await this.borrowingRepository.findByMemberAndBook(
      memberCode,
      bookCode,
      true,
    );
    if (!borrowing) {
      throw new BadRequestException(
        'This book was not borrowed by this member or has already been returned',
      );
    }

    const returnedAt = date ? new Date(date) : new Date();
    borrowing.markReturned(returnedAt);

    const book = await this.bookRepository.findByCode(bookCode);
    if (book) {
      book.increaseStock();
      await this.bookRepository.save(book);
    }

    if (borrowing.isOverdue()) {
      const member = await this.memberRepository.findByCode(memberCode);
      if (member) {
        member.applyPenalty();
        await this.memberRepository.save(member);
      }
    }

    await this.borrowingRepository.save(borrowing);
  }
}
