import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MEMBER_REPOSITORY } from '../../domain/interfaces/member.repository';
import type { IMemberRepository } from '../../domain/interfaces/member.repository';
import { BORROWING_REPOSITORY } from '../../../borrowing/domain/interfaces/borrowing.repository';
import type { IBorrowingRepository } from '../../../borrowing/domain/interfaces/borrowing.repository';

@Injectable()
export class DeleteMemberUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
    @Inject(BORROWING_REPOSITORY)
    private readonly borrowingRepository: IBorrowingRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.memberRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Member not found');
    }

    const activeBorrowings =
      await this.borrowingRepository.findActiveByMember(id);
    if (activeBorrowings.length > 0) {
      throw new BadRequestException(
        'Cannot delete member with active borrowings',
      );
    }

    await this.memberRepository.delete(id);
  }
}
