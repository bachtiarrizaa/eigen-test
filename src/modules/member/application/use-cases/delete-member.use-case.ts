import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MEMBER_REPOSITORY } from '../../domain/interfaces/member.repository';
import type { IMemberRepository } from '../../domain/interfaces/member.repository';

@Injectable()
export class DeleteMemberUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.memberRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Member not found');
    }

    await this.memberRepository.delete(id);
  }
}
