import { Book } from './book.entity';

describe('Book Entity', () => {
  it('should create a book instance', () => {
    const book = new Book('JK-45', 'Harry Potter', 'J.K. Rowling', 1);
    expect(book.code).toBe('JK-45');
    expect(book.title).toBe('Harry Potter');
    expect(book.author).toBe('J.K. Rowling');
    expect(book.stock).toBe(1);
    expect(book.id).toBeDefined();
  });

  it('should return true if stock > 0', () => {
    const book = new Book('JK-45', 'Harry Potter', 'J.K. Rowling', 1);
    expect(book.isAvailable()).toBe(true);
  });

  it('should return false if stock is 0', () => {
    const book = new Book('JK-45', 'Harry Potter', 'J.K. Rowling', 0);
    expect(book.isAvailable()).toBe(false);
  });

  it('should increase stock', () => {
    const book = new Book('JK-45', 'Harry Potter', 'J.K. Rowling', 1);
    book.increaseStock();
    expect(book.stock).toBe(2);
  });

  it('should throw error when decreasing stock if not available', () => {
    const book = new Book('JK-45', 'Harry Potter', 'J.K. Rowling', 0);
    expect(() => book.decreaseStock()).toThrow(
      'Book "Harry Potter" is out of stock',
    );
  });
});
