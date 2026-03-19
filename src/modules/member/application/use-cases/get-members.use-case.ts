import { Inject, Injectable } from '@nestjs/common';
import { MEMBER_REPOSITORY } from '../../domain/interfaces/member.repository';
import type { IMemberRepository } from '../../domain/interfaces/member.repository';
import { Member } from '../../domain/entities/member.entity';

@Injectable()
export class GetMemberUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(): Promise<Member[]> {
    return this.memberRepository.findAll();
  }
}
