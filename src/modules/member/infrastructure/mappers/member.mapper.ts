import { Member } from '../../domain/entities/member.entity';
import { MemberOrmEntity } from '../member.orm-entity';

export class MemberMapper {
  static toDomain(ormEntity: MemberOrmEntity): Member {
    return new Member(
      ormEntity.code,
      ormEntity.name,
      ormEntity.penaltyEndDate,
      ormEntity.id,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toOrm(domainEntity: Member): MemberOrmEntity {
    const ormEntity = new MemberOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.code = domainEntity.code;
    ormEntity.name = domainEntity.name;
    ormEntity.penaltyEndDate = domainEntity.penaltyEndDate;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    return ormEntity;
  }
}
