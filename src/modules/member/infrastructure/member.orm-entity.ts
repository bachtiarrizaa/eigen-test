import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity({ tableName: 'members' })
export class MemberOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property({ type: 'varchar', unique: true })
  code!: string;

  @Property({ type: 'varchar' })
  name!: string;

  @Property({ type: 'timestamptz', nullable: true })
  penaltyEndDate!: Date | null;

  @Property({ type: 'timestamptz' })
  createdAt: Date = new Date();

  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
