import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { MemberOrmEntity } from '../../modules/member/infrastructure/member.orm-entity';

import { randomUUID } from 'crypto';

export class MemberSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const members = [
      {
        id: randomUUID(),
        code: 'M001',
        name: 'Angga',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        code: 'M002',
        name: 'Ferry',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        code: 'M003',
        name: 'Putri',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const memberData of members) {
      const member = em.create(MemberOrmEntity, memberData);
      await em.upsert(member);
    }
  }
}
