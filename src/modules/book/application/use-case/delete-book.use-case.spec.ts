import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBookUseCase } from './delete-book.use-case';
import {
  BOOK_REPOSITORY,
  IBookRepository,
} from '../../domain/interfaces/book.repository';
import { BadRequestException } from '@nestjs/common';
import { Book } from '../../domain/entities/book.entity';

describe('DeleteBookUseCase', () => {
  let deleteBookUseCase: DeleteBookUseCase;
  let bookRepository: jest.Mocked<IBookRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBookUseCase,
        {
          provide: BOOK_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteBookUseCase = module.get<DeleteBookUseCase>(DeleteBookUseCase);
    bookRepository = module.get(BOOK_REPOSITORY);
  });

  it('should delete a book successfully', async () => {
    const id = 'uuid-123';
    const findByIdSpy = jest
      .spyOn(bookRepository, 'findById')
      .mockResolvedValue(
        new Book('JK-45', 'Harry Potter', 'J.K. Rowling', 1, id),
      );
    const deleteSpy = jest
      .spyOn(bookRepository, 'delete')
      .mockResolvedValue(undefined);

    await deleteBookUseCase.execute(id);

    expect(findByIdSpy).toHaveBeenCalledWith(id);
    expect(deleteSpy).toHaveBeenCalledWith(id);
  });

  it('should throw BadRequestException if book not found', async () => {
    jest.spyOn(bookRepository, 'findById').mockResolvedValue(null);
    const deleteSpy = jest.spyOn(bookRepository, 'delete');

    await expect(deleteBookUseCase.execute('invalid-id')).rejects.toThrow(
      BadRequestException,
    );
    expect(deleteSpy).not.toHaveBeenCalled();
  });
});
