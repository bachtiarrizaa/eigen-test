import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { BookSeeder } from './book.seeder';
import { MemberSeeder } from './member.seeder';

export class DatabaseSeeder extends Seeder {
  run(em: EntityManager): Promise<void> {
    return this.call(em, [BookSeeder, MemberSeeder]);
  }
}
