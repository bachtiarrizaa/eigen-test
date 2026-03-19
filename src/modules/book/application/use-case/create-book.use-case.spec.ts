import { Test, TestingModule } from '@nestjs/testing';
import { CreateBookUseCase } from './create-book.use-case';
import {
  BOOK_REPOSITORY,
  IBookRepository,
} from '../../domain/interfaces/book.repository';
import { CreateBookDto } from '../dtos/book.dto';
import { BadRequestException } from '@nestjs/common';
import { Book } from '../../domain/entities/book.entity';

describe('CreateBookUseCase', () => {
  let createBookUseCase: CreateBookUseCase;
  let bookRepository: jest.Mocked<IBookRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBookUseCase,
        {
          provide: BOOK_REPOSITORY,
          useValue: {
            findByCode: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    createBookUseCase = module.get<CreateBookUseCase>(CreateBookUseCase);
    bookRepository = module.get(BOOK_REPOSITORY);
  });

  it('should create a book successfully', async () => {
    const dto: CreateBookDto = {
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K. Rowling',
      stock: 1,
    };

    jest.spyOn(bookRepository, 'findByCode').mockResolvedValue(null);
    const saveSpy = jest
      .spyOn(bookRepository, 'save')
      .mockResolvedValue(undefined);

    const result = await createBookUseCase.execute(dto);

    expect(result).toBeInstanceOf(Book);
    expect(result.code).toBe(dto.code);
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should throw BadRequestException if code already exists', async () => {
    const dto: CreateBookDto = {
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K. Rowling',
      stock: 1,
    };

    jest
      .spyOn(bookRepository, 'findByCode')
      .mockResolvedValue(new Book(dto.code, dto.title, dto.author, dto.stock));
    const saveSpy = jest.spyOn(bookRepository, 'save');

    await expect(createBookUseCase.execute(dto)).rejects.toThrow(
      BadRequestException,
    );
    expect(saveSpy).not.toHaveBeenCalled();
  });
});
