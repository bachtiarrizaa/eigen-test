import { Test, TestingModule } from '@nestjs/testing';
import { ReturnBookUseCase } from './return-book.use-case';
import {
  BOOK_REPOSITORY,
  IBookRepository,
} from '../../../book/domain/interfaces/book.repository';
import {
  BORROWING_REPOSITORY,
  IBorrowingRepository,
} from '../../domain/interfaces/borrowing.repository';
import {
  MEMBER_REPOSITORY,
  IMemberRepository,
} from '../../../member/domain/interfaces/member.repository';
import { Book } from '../../../book/domain/entities/book.entity';
import { Member } from '../../../member/domain/entities/member.entity';
import { Borrowing } from '../../domain/entities/borrowing.entity';
import { BadRequestException } from '@nestjs/common';

describe('ReturnBookUseCase', () => {
  let returnBookUseCase: ReturnBookUseCase;
  let memberRepository: jest.Mocked<IMemberRepository>;
  let bookRepository: jest.Mocked<IBookRepository>;
  let borrowingRepository: jest.Mocked<IBorrowingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReturnBookUseCase,
        {
          provide: MEMBER_REPOSITORY,
          useValue: {
            findByCode: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: BOOK_REPOSITORY,
          useValue: {
            findByCode: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: BORROWING_REPOSITORY,
          useValue: {
            findByMemberAndBook: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    returnBookUseCase = module.get<ReturnBookUseCase>(ReturnBookUseCase);
    memberRepository = module.get(MEMBER_REPOSITORY);
    bookRepository = module.get(BOOK_REPOSITORY);
    borrowingRepository = module.get(BORROWING_REPOSITORY);
  });

  it('should return a book successfully without penalty', async () => {
    const borrowedAt = new Date('2026-03-19');
    const returnedAt = new Date('2026-03-24'); // 5 days - not overdue
    const borrowing = new Borrowing('M001', 'JK-45', borrowedAt);
    const book = new Book('JK-45', 'Harry Potter', 'J.K Rowling', 0);

    jest
      .spyOn(borrowingRepository, 'findByMemberAndBook')
      .mockResolvedValue(borrowing);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(book);
    jest.spyOn(borrowingRepository, 'save').mockResolvedValue(undefined);
    jest.spyOn(bookRepository, 'save').mockResolvedValue(undefined);
    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(null);

    await returnBookUseCase.execute('M001', 'JK-45', returnedAt.toISOString());

    expect(borrowing.returnedAt).not.toBeNull();
    expect(borrowing.isActive()).toBe(false);
  });

  it('should throw error if book was not borrowed by member', async () => {
    jest
      .spyOn(borrowingRepository, 'findByMemberAndBook')
      .mockResolvedValue(null);

    await expect(returnBookUseCase.execute('M001', 'JK-45')).rejects.toThrow(
      BadRequestException,
    );
    await expect(returnBookUseCase.execute('M001', 'JK-45')).rejects.toThrow(
      'This book was not borrowed by this member or has already been returned',
    );
  });

  it('should increase book stock when returned', async () => {
    const borrowing = new Borrowing('M001', 'JK-45', new Date('2026-03-19'));
    const book = new Book('JK-45', 'Harry Potter', 'J.K Rowling', 0); // was borrowed

    jest
      .spyOn(borrowingRepository, 'findByMemberAndBook')
      .mockResolvedValue(borrowing);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(book);
    jest.spyOn(borrowingRepository, 'save').mockResolvedValue(undefined);
    const bookSaveSpy = jest
      .spyOn(bookRepository, 'save')
      .mockResolvedValue(undefined);

    await returnBookUseCase.execute('M001', 'JK-45');

    expect(bookSaveSpy).toHaveBeenCalled();
    expect(book.stock).toBe(1);
  });

  it('should apply penalty if returned after 7 days', async () => {
    const borrowedAt = new Date('2026-03-19');
    const returnedAt = new Date('2026-03-27'); // 8 days - overdue
    const borrowing = new Borrowing('M001', 'JK-45', borrowedAt);
    const member = new Member('M001', 'Angga');
    const book = new Book('JK-45', 'Harry Potter', 'J.K Rowling', 0);

    jest
      .spyOn(borrowingRepository, 'findByMemberAndBook')
      .mockResolvedValue(borrowing);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(book);
    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(member);
    jest.spyOn(borrowingRepository, 'save').mockResolvedValue(undefined);
    jest.spyOn(bookRepository, 'save').mockResolvedValue(undefined);
    const memberSaveSpy = jest
      .spyOn(memberRepository, 'save')
      .mockResolvedValue(undefined);

    await returnBookUseCase.execute('M001', 'JK-45', returnedAt.toISOString());

    expect(memberSaveSpy).toHaveBeenCalled();
    expect(member.isPenalized()).toBe(true);
    expect(member.penaltyEndDate).not.toBeNull();
  });

  it('should not apply penalty if returned within 7 days', async () => {
    const borrowedAt = new Date('2026-03-19');
    const returnedAt = new Date('2026-03-25'); // 6 days - not overdue
    const borrowing = new Borrowing('M001', 'JK-45', borrowedAt);
    const member = new Member('M001', 'Angga');
    const book = new Book('JK-45', 'Harry Potter', 'J.K Rowling', 0);

    jest
      .spyOn(borrowingRepository, 'findByMemberAndBook')
      .mockResolvedValue(borrowing);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(book);
    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(member);
    jest.spyOn(borrowingRepository, 'save').mockResolvedValue(undefined);
    jest.spyOn(bookRepository, 'save').mockResolvedValue(undefined);
    const memberSaveSpy = jest
      .spyOn(memberRepository, 'save')
      .mockResolvedValue(undefined);

    await returnBookUseCase.execute('M001', 'JK-45', returnedAt.toISOString());

    expect(member.isPenalized()).toBe(false);
    expect(memberSaveSpy).not.toHaveBeenCalled();
  });

  it('should mark borrowing as returned with provided date', async () => {
    const borrowedAt = new Date('2026-03-19');
    const returnedAt = new Date('2026-03-25');
    const borrowing = new Borrowing('M001', 'JK-45', borrowedAt);
    const book = new Book('JK-45', 'Harry Potter', 'J.K Rowling', 0);

    jest
      .spyOn(borrowingRepository, 'findByMemberAndBook')
      .mockResolvedValue(borrowing);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(book);
    jest.spyOn(borrowingRepository, 'save').mockResolvedValue(undefined);
    jest.spyOn(bookRepository, 'save').mockResolvedValue(undefined);

    await returnBookUseCase.execute('M001', 'JK-45', returnedAt.toISOString());

    expect(borrowing.returnedAt).toEqual(returnedAt);
  });

  it('should use current date if return date not provided', async () => {
    const borrowing = new Borrowing('M001', 'JK-45', new Date('2026-03-19'));
    const book = new Book('JK-45', 'Harry Potter', 'J.K Rowling', 0);

    jest
      .spyOn(borrowingRepository, 'findByMemberAndBook')
      .mockResolvedValue(borrowing);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(book);
    jest.spyOn(borrowingRepository, 'save').mockResolvedValue(undefined);
    jest.spyOn(bookRepository, 'save').mockResolvedValue(undefined);

    const _beforeReturn = new Date();
    await returnBookUseCase.execute('M001', 'JK-45');
    const _afterReturn = new Date();

    expect(borrowing.returnedAt).not.toBeNull();
    expect(borrowing.returnedAt!.getTime()).toBeGreaterThanOrEqual(
      _beforeReturn.getTime(),
    );
    expect(borrowing.returnedAt!.getTime()).toBeLessThanOrEqual(
      _afterReturn.getTime(),
    );
  });

  it('should handle case where book not found after return', async () => {
    const borrowing = new Borrowing('M001', 'JK-45', new Date('2026-03-19'));

    jest
      .spyOn(borrowingRepository, 'findByMemberAndBook')
      .mockResolvedValue(borrowing);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(null);
    jest.spyOn(borrowingRepository, 'save').mockResolvedValue(undefined);

    // Should not throw - book might have been deleted
    await expect(
      returnBookUseCase.execute('M001', 'JK-45'),
    ).resolves.not.toThrow();
  });

  it('should save borrowing record after return', async () => {
    const borrowing = new Borrowing('M001', 'JK-45', new Date('2026-03-19'));
    const book = new Book('JK-45', 'Harry Potter', 'J.K Rowling', 0);

    jest
      .spyOn(borrowingRepository, 'findByMemberAndBook')
      .mockResolvedValue(borrowing);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(book);
    jest.spyOn(bookRepository, 'save').mockResolvedValue(undefined);
    const borrowingSaveSpy = jest
      .spyOn(borrowingRepository, 'save')
      .mockResolvedValue(undefined);

    await returnBookUseCase.execute('M001', 'JK-45');

    expect(borrowingSaveSpy).toHaveBeenCalledWith(borrowing);
  });
});
