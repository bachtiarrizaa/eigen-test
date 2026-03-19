import { Injectable } from '@nestjs/common';
import { IMemberRepository } from '../../domain/interfaces/member.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { MemberOrmEntity } from '../member.orm-entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Member } from '../../domain/entities/member.entity';
import { MemberMapper } from '../mappers/member.mapper';

@Injectable()
export class MemberRepository implements IMemberRepository {
  constructor(
    @InjectRepository(MemberOrmEntity)
    private readonly repository: EntityRepository<MemberOrmEntity>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<Member[]> {
    const ormMembers = await this.repository.findAll();
    return ormMembers.map((member) => MemberMapper.toDomain(member));
  }

  async findByCode(code: string): Promise<Member | null> {
    const ormMember = await this.repository.findOne({ code });
    return ormMember ? MemberMapper.toDomain(ormMember) : null;
  }

  async findById(id: string): Promise<Member | null> {
    const ormMember = await this.repository.findOne({ id });
    return ormMember ? MemberMapper.toDomain(ormMember) : null;
  }

  async save(member: Member): Promise<void> {
    const ormMember = MemberMapper.toOrm(member);
    await this.em.upsert(MemberOrmEntity, ormMember);
    await this.em.flush();
  }

  async update(id: string, member: Member): Promise<void> {
    const ormMember = await this.repository.findOne({ id });
    if (!ormMember) {
      throw new Error('Member not found');
    }
    ormMember.name = member.name;
    ormMember.penaltyEndDate = member.penaltyEndDate;
    await this.em.flush();
  }

  async delete(id: string): Promise<void> {
    await this.em.nativeDelete(MemberOrmEntity, { id });
  }
}
