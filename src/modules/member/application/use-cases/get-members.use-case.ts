import { Inject, Injectable } from '@nestjs/common';
import { MEMBER_REPOSITORY } from '../../domain/interfaces/member.repository';
import type { IMemberRepository } from '../../domain/interfaces/member.repository';
import { BORROWING_REPOSITORY } from '../../../borrowing/domain/interfaces/borrowing.repository';
import type { IBorrowingRepository } from '../../../borrowing/domain/interfaces/borrowing.repository';

export interface MemberWithBorrowCount {
  code: string;
  name: string;
  penaltyEndDate: Date | null;
  borrowCount: number;
}

@Injectable()
export class GetMemberUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
    @Inject(BORROWING_REPOSITORY)
    private readonly borrowingRepository: IBorrowingRepository,
  ) {}

  async execute(): Promise<MemberWithBorrowCount[]> {
    const members = await this.memberRepository.findAll();
    const membersWithCount: MemberWithBorrowCount[] = [];

    for (const member of members) {
      const activeBorrowings =
        await this.borrowingRepository.findActiveByMember(member.code);
      membersWithCount.push({
        code: member.code,
        name: member.name,
        penaltyEndDate: member.penaltyEndDate,
        borrowCount: activeBorrowings.length,
      });
    }

    return membersWithCount;
  }
}
