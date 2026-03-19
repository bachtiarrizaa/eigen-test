import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingController } from './borrowing.controller';
import { BorrowBookUseCase } from './application/use-case/borrow-book.use-case';
import { ReturnBookUseCase } from './application/use-case/return-book.use-case';
import { BorrowBookDto, ReturnBookDto } from './application/dtos/borrowing.dto';
import { Borrowing } from './domain/entities/borrowing.entity';

describe('BorrowingController', () => {
  let borrowingController: BorrowingController;
  let borrowBookUseCase: BorrowBookUseCase;
  let returnBookUseCase: ReturnBookUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowingController],
      providers: [
        {
          provide: BorrowBookUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ReturnBookUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    borrowingController = module.get<BorrowingController>(BorrowingController);
    borrowBookUseCase = module.get(BorrowBookUseCase);
    returnBookUseCase = module.get(ReturnBookUseCase);
  });

  describe('borrow', () => {
    it('should call borrow use case with correct parameters', async () => {
      const dto: BorrowBookDto = {
        memberCode: 'M001',
        bookCode: 'JK-45',
      };
      const result = new Borrowing('M001', 'JK-45', new Date());
      const executeSpy = jest
        .spyOn(borrowBookUseCase, 'execute')
        .mockResolvedValue(result);

      expect(await borrowingController.borrow(dto)).toBe(result);
      expect(executeSpy).toHaveBeenCalledWith('M001', 'JK-45', undefined);
    });

    it('should pass memberId, bookCode, and borrow date to use case', async () => {
      const dto: BorrowBookDto = {
        memberCode: 'M001',
        bookCode: 'JK-45',
        borrowedAt: '2026-03-19T10:00:00Z',
      };
      const result = new Borrowing(
        'M001',
        'JK-45',
        dto.borrowedAt ? new Date(dto.borrowedAt) : new Date(),
      );
      const executeSpy = jest
        .spyOn(borrowBookUseCase, 'execute')
        .mockResolvedValue(result);

      await borrowingController.borrow(dto);

      expect(executeSpy).toHaveBeenCalledWith('M001', 'JK-45', dto.borrowedAt);
    });

    it('should return borrowing result', async () => {
      const dto: BorrowBookDto = {
        memberCode: 'M001',
        bookCode: 'JK-45',
      };
      const borrowedAt = new Date('2026-03-19');
      const result = new Borrowing('M001', 'JK-45', borrowedAt);

      jest.spyOn(borrowBookUseCase, 'execute').mockResolvedValue(result);

      const response = await borrowingController.borrow(dto);

      expect(response).toEqual(result);
      expect(response.memberCode).toBe('M001');
      expect(response.bookCode).toBe('JK-45');
    });

    it('should handle different member and book codes', async () => {
      const dto: BorrowBookDto = {
        memberCode: 'M003',
        bookCode: 'TW-11',
      };
      const result = new Borrowing('M003', 'TW-11', new Date());
      const executeSpy = jest
        .spyOn(borrowBookUseCase, 'execute')
        .mockResolvedValue(result);

      await borrowingController.borrow(dto);

      expect(executeSpy).toHaveBeenCalledWith('M003', 'TW-11', undefined);
    });
  });

  describe('returnBook', () => {
    it('should call return use case with correct parameters', async () => {
      const dto: ReturnBookDto = {
        memberCode: 'M001',
        bookCode: 'JK-45',
      };
      const executeSpy = jest
        .spyOn(returnBookUseCase, 'execute')
        .mockResolvedValue(undefined);

      await borrowingController.returnBook(dto);

      expect(executeSpy).toHaveBeenCalledWith('M001', 'JK-45', undefined);
    });

    it('should pass memberId, bookCode, and return date to use case', async () => {
      const dto: ReturnBookDto = {
        memberCode: 'M001',
        bookCode: 'JK-45',
        returnedAt: '2026-03-25T10:00:00Z',
      };
      const executeSpy = jest
        .spyOn(returnBookUseCase, 'execute')
        .mockResolvedValue(undefined);

      await borrowingController.returnBook(dto);

      expect(executeSpy).toHaveBeenCalledWith('M001', 'JK-45', dto.returnedAt);
    });

    it('should handle return without date', async () => {
      const dto: ReturnBookDto = {
        memberCode: 'M002',
        bookCode: 'SHR-1',
      };
      const executeSpy = jest
        .spyOn(returnBookUseCase, 'execute')
        .mockResolvedValue(undefined);

      await borrowingController.returnBook(dto);

      expect(executeSpy).toHaveBeenCalledWith('M002', 'SHR-1', undefined);
    });

    it('should handle different member and book codes', async () => {
      const dto: ReturnBookDto = {
        memberCode: 'M003',
        bookCode: 'TW-11',
      };
      const executeSpy = jest
        .spyOn(returnBookUseCase, 'execute')
        .mockResolvedValue(undefined);

      await borrowingController.returnBook(dto);

      expect(executeSpy).toHaveBeenCalledWith('M003', 'TW-11', undefined);
    });

    it('should return void after successful return', async () => {
      const dto: ReturnBookDto = {
        memberCode: 'M001',
        bookCode: 'JK-45',
      };
      jest.spyOn(returnBookUseCase, 'execute').mockResolvedValue(undefined);

      const result = await borrowingController.returnBook(dto);

      expect(result).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should propagate errors from borrow use case', async () => {
      const dto: BorrowBookDto = {
        memberCode: 'INVALID',
        bookCode: 'JK-45',
      };
      const error = new Error('Member not found');

      jest.spyOn(borrowBookUseCase, 'execute').mockRejectedValue(error);

      await expect(borrowingController.borrow(dto)).rejects.toThrow(
        'Member not found',
      );
    });

    it('should propagate errors from return use case', async () => {
      const dto: ReturnBookDto = {
        memberCode: 'M001',
        bookCode: 'INVALID',
      };
      const error = new Error('Book not found');

      jest.spyOn(returnBookUseCase, 'execute').mockRejectedValue(error);

      await expect(borrowingController.returnBook(dto)).rejects.toThrow(
        'Book not found',
      );
    });
  });
});
