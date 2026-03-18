import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { BookSeeder } from './BookSeeder';
import { MemberSeeder } from './MemberSeeder';

export class DatabaseSeeder extends Seeder {
  run(em: EntityManager): Promise<void> {
    return this.call(em, [BookSeeder, MemberSeeder]);
  }
}
