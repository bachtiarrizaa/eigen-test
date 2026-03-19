import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MEMBER_REPOSITORY } from '../../domain/interfaces/member.repository';
import type { IMemberRepository } from '../../domain/interfaces/member.repository';
import { UpdateMemberDto } from '../dtos/member.dto';
import { Member } from '../../domain/entities/member.entity';

@Injectable()
export class UpdateMemberUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(id: string, dto: UpdateMemberDto): Promise<Member> {
    const existing = await this.memberRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Member not found');
    }

    if (dto.code !== existing.code) {
      const codeExists = await this.memberRepository.findByCode(dto.code);
      if (codeExists) {
        throw new BadRequestException('Member with this code already exists');
      }
    }

    existing.code = dto.code;
    existing.name = dto.name;
    await this.memberRepository.update(id, existing);
    return existing;
  }
}
