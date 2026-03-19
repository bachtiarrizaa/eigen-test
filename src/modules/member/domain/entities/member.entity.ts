import { BaseEntity } from '../../../../common/domain/entities/base.entity';

export class Member extends BaseEntity {
  constructor(
    public code: string,
    public name: string,
    public penaltyEndDate: Date | null = null,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  isPenalized(): boolean {
    if (!this.penaltyEndDate) return false;
    return new Date() < this.penaltyEndDate;
  }

  applyPenalty(): void {
    const penaltyEnd = new Date();
    penaltyEnd.setDate(penaltyEnd.getDate() + 3);
    this.penaltyEndDate = penaltyEnd;
  }
}
