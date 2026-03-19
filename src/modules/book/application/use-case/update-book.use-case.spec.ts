import { Test, TestingModule } from '@nestjs/testing';
import { UpdateBookUseCase } from './update-book.use-case';
import {
  BOOK_REPOSITORY,
  IBookRepository,
} from '../../domain/interfaces/book.repository';
import { UpdateBookDto } from '../dtos/book.dto';
import { BadRequestException } from '@nestjs/common';
import { Book } from '../../domain/entities/book.entity';

describe('UpdateBookUseCase', () => {
  let updateBookUseCase: UpdateBookUseCase;
  let bookRepository: jest.Mocked<IBookRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateBookUseCase,
        {
          provide: BOOK_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            findByCode: jest.fn(),
            findByTitle: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    updateBookUseCase = module.get<UpdateBookUseCase>(UpdateBookUseCase);
    bookRepository = module.get(BOOK_REPOSITORY);
  });

  it('should update a book successfully', async () => {
    const id = 'uuid-123';
    const dto: UpdateBookDto = {
      code: 'JK-45-NEW',
      title: 'Harry Potter New',
      author: 'J.K. Rowling',
      stock: 5,
    };

    const existingBook = new Book(
      'JK-45',
      'Harry Potter',
      'J.K. Rowling',
      1,
      id,
    );

    jest.spyOn(bookRepository, 'findById').mockResolvedValue(existingBook);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(null);
    jest.spyOn(bookRepository, 'findByTitle').mockResolvedValue(null);
    const saveSpy = jest
      .spyOn(bookRepository, 'save')
      .mockResolvedValue(undefined);

    const result = await updateBookUseCase.execute(id, dto);

    expect(result.code).toBe(dto.code);
    expect(result.title).toBe(dto.title);
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should throw BadRequestException if book not found', async () => {
    jest.spyOn(bookRepository, 'findById').mockResolvedValue(null);

    await expect(
      updateBookUseCase.execute('invalid-id', {
        code: 'C',
        title: 'T',
        author: 'A',
        stock: 1,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if new code already exists for another book', async () => {
    const id = 'uuid-123';
    const dto: UpdateBookDto = {
      code: 'JK-45-EXISTING',
      title: 'Harry Potter',
      author: 'J.K. Rowling',
      stock: 1,
    };

    const existingBook = new Book(
      'JK-45',
      'Harry Potter',
      'J.K. Rowling',
      1,
      id,
    );
    const bookWithConflictCode = new Book(
      dto.code,
      'Another Title',
      'Author',
      1,
      'another-uuid',
    );

    jest.spyOn(bookRepository, 'findById').mockResolvedValue(existingBook);
    jest
      .spyOn(bookRepository, 'findByCode')
      .mockResolvedValue(bookWithConflictCode);

    await expect(updateBookUseCase.execute(id, dto)).rejects.toThrow(
      'Book code already exists',
    );
  });

  it('should throw BadRequestException if new title already exists for another book', async () => {
    const id = 'uuid-123';
    const dto: UpdateBookDto = {
      code: 'JK-45',
      title: 'Existing Title',
      author: 'J.K. Rowling',
      stock: 1,
    };

    const existingBook = new Book(
      'JK-45',
      'Harry Potter',
      'J.K. Rowling',
      1,
      id,
    );
    const bookWithConflictTitle = new Book(
      'ANOTHER-CODE',
      dto.title,
      'Author',
      1,
      'another-uuid',
    );

    jest.spyOn(bookRepository, 'findById').mockResolvedValue(existingBook);
    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(null);
    jest
      .spyOn(bookRepository, 'findByTitle')
      .mockResolvedValue(bookWithConflictTitle);

    await expect(updateBookUseCase.execute(id, dto)).rejects.toThrow(
      'Book with this title already exists',
    );
  });
});
