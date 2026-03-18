import { BaseEntity } from '../../../../common/domain/entities/base.entity';

export class Book extends BaseEntity {
  constructor(
    public readonly code: string,
    public title: string,
    public author: string,
    public stock: number,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  isAvailable(): boolean {
    return this.stock > 0;
  }

  decreaseStock(): void {
    if (!this.isAvailable()) {
      throw new Error(`Book "${this.title}" is out of stock`);
    }
  }

  increaseStock(): void {
    this.stock += 1;
  }
}
