import { BaseEntity } from '../../../../common/domain/entities/base.entity';

export class Borrowing extends BaseEntity {
  constructor(
    public readonly memberCode: string,
    public readonly bookCode: string,
    borrowedAt?: Date,
    public returnedAt: Date | null = null,
    id?: string,
    updatedAt?: Date,
  ) {
    super(id, borrowedAt, updatedAt);
  }

  get borrowedAt(): Date {
    return this.createdAt;
  }

  isActive(): boolean {
    return this.returnedAt === null;
  }

  getDaysBorrowed(): number {
    const end = this.returnedAt ?? new Date();
    const diff = end.getTime() - this.borrowedAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  isOverdue(): boolean {
    return this.getDaysBorrowed() > 7;
  }

  markReturned(date?: Date): void {
    if (!this.isActive()) {
      throw new Error('This borrowing has already been returned');
    }
    this.returnedAt = date ?? new Date();
  }
}
