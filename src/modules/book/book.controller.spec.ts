import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { CreateBookUseCase } from './application/use-case/create-book.use-case';
import { GetBooksUseCase } from './application/use-case/get-books.use-case';
import { UpdateBookUseCase } from './application/use-case/update-book.use-case';
import { DeleteBookUseCase } from './application/use-case/delete-book.use-case';
import { CreateBookDto, UpdateBookDto } from './application/dtos/book.dto';
import { Book } from './domain/entities/book.entity';

describe('BookController', () => {
  let bookController: BookController;
  let createBookUseCase: CreateBookUseCase;
  let getBooksUseCase: GetBooksUseCase;
  let updateBookUseCase: UpdateBookUseCase;
  let deleteBookUseCase: DeleteBookUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: CreateBookUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetBooksUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateBookUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteBookUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    bookController = module.get<BookController>(BookController);
    createBookUseCase = module.get(CreateBookUseCase);
    getBooksUseCase = module.get(GetBooksUseCase);
    updateBookUseCase = module.get(UpdateBookUseCase);
    deleteBookUseCase = module.get(DeleteBookUseCase);
  });

  it('should call findAll use case', async () => {
    const result = [new Book('JK-45', 'Harry Potter', 'A', 1)];
    const executeSpy = jest
      .spyOn(getBooksUseCase, 'execute')
      .mockResolvedValue(result);

    expect(await bookController.findAll()).toBe(result);
    expect(executeSpy).toHaveBeenCalled();
  });

  it('should call create use case', async () => {
    const dto: CreateBookDto = {
      code: 'JK',
      title: 'H',
      author: 'A',
      stock: 1,
    };
    const result = new Book(dto.code, dto.title, dto.author, dto.stock);
    const executeSpy = jest
      .spyOn(createBookUseCase, 'execute')
      .mockResolvedValue(result);

    expect(await bookController.create(dto)).toBe(result);
    expect(executeSpy).toHaveBeenCalledWith(dto);
  });

  it('should call update use case', async () => {
    const id = 'uuid';
    const dto: UpdateBookDto = {
      code: 'JK-NEW',
      title: 'H',
      author: 'A',
      stock: 1,
    };
    const result = new Book(dto.code, dto.title, dto.author, dto.stock);
    const executeSpy = jest
      .spyOn(updateBookUseCase, 'execute')
      .mockResolvedValue(result);

    expect(await bookController.update(id, dto)).toBe(result);
    expect(executeSpy).toHaveBeenCalledWith(id, dto);
  });

  it('should call delete use case', async () => {
    const id = 'uuid';
    const executeSpy = jest
      .spyOn(deleteBookUseCase, 'execute')
      .mockResolvedValue(undefined);

    await bookController.delete(id);
    expect(executeSpy).toHaveBeenCalledWith(id);
  });
});
