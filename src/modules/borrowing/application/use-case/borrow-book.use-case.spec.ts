import { Test, TestingModule } from '@nestjs/testing';
import { BorrowBookUseCase } from './borrow-book.use-case';
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

describe('BorrowBookUseCase', () => {
  let borrowBookUseCase: BorrowBookUseCase;
  let memberRepository: jest.Mocked<IMemberRepository>;
  let bookRepository: jest.Mocked<IBookRepository>;
  let borrowingRepository: jest.Mocked<IBorrowingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowBookUseCase,
        {
          provide: MEMBER_REPOSITORY,
          useValue: {
            findByCode: jest.fn(),
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
            findActiveByMember: jest.fn(),
            findActiveByBook: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    borrowBookUseCase = module.get<BorrowBookUseCase>(BorrowBookUseCase);
    memberRepository = module.get(MEMBER_REPOSITORY);
    bookRepository = module.get(BOOK_REPOSITORY);
    borrowingRepository = module.get(BORROWING_REPOSITORY);
  });

  it('should borrow a book successfully', async () => {
    const member = new Member('M001', 'Angga');
    const book = new Book('JK-45', 'Harry Potter', 'J.K Rowling', 1);

    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(member);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(book);
    jest.spyOn(borrowingRepository, 'findActiveByMember').mockResolvedValue([]);
    jest.spyOn(borrowingRepository, 'findActiveByBook').mockResolvedValue([]);
    const saveSpy = jest
      .spyOn(borrowingRepository, 'save')
      .mockResolvedValue(undefined);

    const result = await borrowBookUseCase.execute('M001', 'JK-45');

    expect(result).toBeInstanceOf(Borrowing);
    expect(result.memberCode).toBe('M001');
    expect(result.bookCode).toBe('JK-45');
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should throw error if member not found', async () => {
    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(null);

    await expect(borrowBookUseCase.execute('M999', 'JK-45')).rejects.toThrow(
      BadRequestException,
    );
    await expect(borrowBookUseCase.execute('M999', 'JK-45')).rejects.toThrow(
      'Member not found',
    );
  });

  it('should throw error if member is penalized', async () => {
    const penaltyDate = new Date();
    penaltyDate.setDate(penaltyDate.getDate() + 2);
    const member = new Member('M001', 'Angga', penaltyDate);

    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(member);

    await expect(borrowBookUseCase.execute('M001', 'JK-45')).rejects.toThrow(
      BadRequestException,
    );
    await expect(borrowBookUseCase.execute('M001', 'JK-45')).rejects.toThrow(
      'Member is currently penalized and cannot borrow books',
    );
  });

  it('should throw error if member already borrowed 2 books', async () => {
    const member = new Member('M001', 'Angga');
    const activeBorrowings = [
      new Borrowing('M001', 'JK-45', new Date()),
      new Borrowing('M001', 'SHR-1', new Date()),
    ];

    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(member);
    jest
      .spyOn(borrowingRepository, 'findActiveByMember')
      .mockResolvedValue(activeBorrowings);

    await expect(borrowBookUseCase.execute('M001', 'TW-11')).rejects.toThrow(
      BadRequestException,
    );
    await expect(borrowBookUseCase.execute('M001', 'TW-11')).rejects.toThrow(
      'Member cannot borrow more than 2 books',
    );
  });

  it('should throw error if book not found', async () => {
    const member = new Member('M001', 'Angga');

    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(member);
    jest.spyOn(borrowingRepository, 'findActiveByMember').mockResolvedValue([]);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(null);

    await expect(borrowBookUseCase.execute('M001', 'INVALID')).rejects.toThrow(
      BadRequestException,
    );
    await expect(borrowBookUseCase.execute('M001', 'INVALID')).rejects.toThrow(
      'Book not found',
    );
  });

  it('should throw error if book is out of stock', async () => {
    const member = new Member('M001', 'Angga');
    const book = new Book('JK-45', 'Harry Potter', 'J.K Rowling', 0); // out of stock

    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(member);
    jest.spyOn(borrowingRepository, 'findActiveByMember').mockResolvedValue([]);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(book);

    await expect(borrowBookUseCase.execute('M001', 'JK-45')).rejects.toThrow(
      BadRequestException,
    );
    await expect(borrowBookUseCase.execute('M001', 'JK-45')).rejects.toThrow(
      'Book is currently out of stock',
    );
  });

  it('should throw error if book is already borrowed', async () => {
    const member = new Member('M001', 'Angga');
    const book = new Book('JK-45', 'Harry Potter', 'J.K Rowling', 1);
    const activeBorrowings = [new Borrowing('M002', 'JK-45', new Date())];

    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(member);
    jest.spyOn(borrowingRepository, 'findActiveByMember').mockResolvedValue([]);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(book);
    jest
      .spyOn(borrowingRepository, 'findActiveByBook')
      .mockResolvedValue(activeBorrowings);

    await expect(borrowBookUseCase.execute('M001', 'JK-45')).rejects.toThrow(
      BadRequestException,
    );
    await expect(borrowBookUseCase.execute('M001', 'JK-45')).rejects.toThrow(
      'Book is already borrowed by another member',
    );
  });

  it('should decrease book stock when borrowed', async () => {
    const member = new Member('M001', 'Angga');
    const book = new Book('JK-45', 'Harry Potter', 'J.K Rowling', 2);

    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(member);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(book);
    jest.spyOn(borrowingRepository, 'findActiveByMember').mockResolvedValue([]);
    jest.spyOn(borrowingRepository, 'findActiveByBook').mockResolvedValue([]);
    jest.spyOn(borrowingRepository, 'save').mockResolvedValue(undefined);
    const bookSaveSpy = jest
      .spyOn(bookRepository, 'save')
      .mockResolvedValue(undefined);

    await borrowBookUseCase.execute('M001', 'JK-45');

    expect(bookSaveSpy).toHaveBeenCalled();
    expect(book.stock).toBe(1);
  });

  it('should use provided borrow date', async () => {
    const member = new Member('M001', 'Angga');
    const book = new Book('JK-45', 'Harry Potter', 'J.K Rowling', 1);
    const borrowDate = '2026-03-15T10:00:00Z';

    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(member);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(book);
    jest.spyOn(borrowingRepository, 'findActiveByMember').mockResolvedValue([]);
    jest.spyOn(borrowingRepository, 'findActiveByBook').mockResolvedValue([]);
    jest.spyOn(borrowingRepository, 'save').mockResolvedValue(undefined);
    jest.spyOn(bookRepository, 'save').mockResolvedValue(undefined);

    const result = await borrowBookUseCase.execute('M001', 'JK-45', borrowDate);

    expect(result.borrowedAt).toEqual(new Date(borrowDate));
  });
});
