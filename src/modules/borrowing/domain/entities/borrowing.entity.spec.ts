import { Borrowing } from './borrowing.entity';

describe('Borrowing Entity', () => {
  describe('constructor', () => {
    it('should create a borrowing with required properties', () => {
      const borrowedAt = new Date('2026-03-19');
      const borrowing = new Borrowing('M001', 'JK-45', borrowedAt);

      expect(borrowing.memberCode).toBe('M001');
      expect(borrowing.bookCode).toBe('JK-45');
      expect(borrowing.borrowedAt).toEqual(borrowedAt);
      expect(borrowing.returnedAt).toBeNull();
    });

    it('should create a borrowing with all properties', () => {
      const borrowedAt = new Date('2026-03-19');
      const returnedAt = new Date('2026-03-25');
      const borrowing = new Borrowing(
        'M001',
        'JK-45',
        borrowedAt,
        returnedAt,
        'uuid-id',
        new Date('2026-03-25'),
      );

      expect(borrowing.memberCode).toBe('M001');
      expect(borrowing.bookCode).toBe('JK-45');
      expect(borrowing.borrowedAt).toEqual(borrowedAt);
      expect(borrowing.returnedAt).toEqual(returnedAt);
      expect(borrowing.id).toBe('uuid-id');
    });
  });

  describe('isActive', () => {
    it('should return true if returnedAt is null', () => {
      const borrowing = new Borrowing('M001', 'JK-45', new Date('2026-03-19'));

      expect(borrowing.isActive()).toBe(true);
    });

    it('should return false if returnedAt is set', () => {
      const borrowing = new Borrowing(
        'M001',
        'JK-45',
        new Date('2026-03-19'),
        new Date('2026-03-25'),
      );

      expect(borrowing.isActive()).toBe(false);
    });
  });

  describe('getDaysBorrowed', () => {
    it('should calculate days borrowed correctly', () => {
      const startDate = new Date('2026-03-19');
      const endDate = new Date('2026-03-26'); // 7 days later
      const borrowing = new Borrowing('M001', 'JK-45', startDate, endDate);

      expect(borrowing.getDaysBorrowed()).toBe(7);
    });

    it('should return 0 for same day borrowing', () => {
      const date = new Date('2026-03-19');
      const borrowing = new Borrowing('M001', 'JK-45', date, date);

      expect(borrowing.getDaysBorrowed()).toBe(0);
    });

    it('should calculate days from borrowed to now if not returned', () => {
      const borrowedAt = new Date();
      borrowedAt.setDate(borrowedAt.getDate() - 5);

      const borrowing = new Borrowing('M001', 'JK-45', borrowedAt);

      const days = borrowing.getDaysBorrowed();
      expect(days).toBe(5);
    });
  });

  describe('isOverdue', () => {
    it('should return false if borrowed less than 7 days', () => {
      const startDate = new Date('2026-03-19');
      const endDate = new Date('2026-03-25'); // 6 days
      const borrowing = new Borrowing('M001', 'JK-45', startDate, endDate);

      expect(borrowing.isOverdue()).toBe(false);
    });

    it('should return false if borrowed exactly 7 days', () => {
      const startDate = new Date('2026-03-19');
      const endDate = new Date('2026-03-26'); // 7 days exactly
      const borrowing = new Borrowing('M001', 'JK-45', startDate, endDate);

      expect(borrowing.isOverdue()).toBe(false);
    });

    it('should return true if borrowed more than 7 days', () => {
      const startDate = new Date('2026-03-19');
      const endDate = new Date('2026-03-27'); // 8 days
      const borrowing = new Borrowing('M001', 'JK-45', startDate, endDate);

      expect(borrowing.isOverdue()).toBe(true);
    });
  });

  describe('markReturned', () => {
    it('should mark as returned with provided date', () => {
      const borrowing = new Borrowing('M001', 'JK-45', new Date('2026-03-19'));
      const returnDate = new Date('2026-03-25');

      borrowing.markReturned(returnDate);

      expect(borrowing.returnedAt).toEqual(returnDate);
      expect(borrowing.isActive()).toBe(false);
    });

    it('should mark as returned with current date if not provided', () => {
      const borrowing = new Borrowing('M001', 'JK-45', new Date('2026-03-19'));
      const beforeMark = new Date();

      borrowing.markReturned();

      expect(borrowing.returnedAt).not.toBeNull();
      expect(borrowing.returnedAt!.getTime()).toBeGreaterThanOrEqual(
        beforeMark.getTime(),
      );
    });

    it('should throw error if already returned', () => {
      const borrowing = new Borrowing(
        'M001',
        'JK-45',
        new Date('2026-03-19'),
        new Date('2026-03-25'),
      );

      expect(() => borrowing.markReturned()).toThrow(
        'This borrowing has already been returned',
      );
    });
  });
});
