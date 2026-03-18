import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { BookOrmEntity } from '../../modules/book/infrastructure/book.orm-entity';

import { randomUUID } from 'crypto';

export class BookSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const books = [
      {
        id: randomUUID(),
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        stock: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        code: 'SHR-1',
        title: 'A Study in Scarlet',
        author: 'Arthur Conan Doyle',
        stock: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        code: 'TW-11',
        title: 'Twilight',
        author: 'Stephenie Meyer',
        stock: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        code: 'HOB-83',
        title: 'The Hobbit, or There and Back Again',
        author: 'J.R.R. Tolkien',
        stock: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        code: 'NRN-7',
        title: 'The Lion, the Witch and the Wardrobe',
        author: 'C.S. Lewis',
        stock: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        code: 'BK-01',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const bookData of books) {
      const book = em.create(BookOrmEntity, bookData);
      await em.upsert(book);
    }
  }
}
