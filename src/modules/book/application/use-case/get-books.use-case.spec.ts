import { Test, TestingModule } from '@nestjs/testing';
import { GetBooksUseCase } from './get-books.use-case';
import {
  BOOK_REPOSITORY,
  IBookRepository,
} from '../../domain/interfaces/book.repository';
import { Book } from '../../domain/entities/book.entity';

describe('GetBooksUseCase', () => {
  let getBooksUseCase: GetBooksUseCase;
  let bookRepository: jest.Mocked<IBookRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBooksUseCase,
        {
          provide: BOOK_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    getBooksUseCase = module.get<GetBooksUseCase>(GetBooksUseCase);
    bookRepository = module.get(BOOK_REPOSITORY);
  });

  it('should return all books', async () => {
    const books = [
      new Book('JK-45', 'Harry Potter', 'J.K. Rowling', 1),
      new Book('SHR-1', 'A Study in Scarlet', 'Arthur Conan Doyle', 1),
    ];
    const findAllSpy = jest
      .spyOn(bookRepository, 'findAll')
      .mockResolvedValue(books);

    const result = await getBooksUseCase.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual(books);
    expect(findAllSpy).toHaveBeenCalled();
  });
});
