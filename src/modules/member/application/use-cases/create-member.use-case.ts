import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MEMBER_REPOSITORY } from '../../domain/interfaces/member.repository';
import type { IMemberRepository } from '../../domain/interfaces/member.repository';
import { CreateMemberDto } from '../dtos/member.dto';
import { Member } from '../../domain/entities/member.entity';

@Injectable()
export class CreateMemberUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(dto: CreateMemberDto): Promise<Member> {
    const existing = await this.memberRepository.findByCode(dto.code);
    if (existing) {
      throw new BadRequestException('Member with this code already exists');
    }

    const member = new Member(dto.code, dto.name);
    await this.memberRepository.save(member);
    return member;
  }
}
