import { Entity, Property, PrimaryKey } from '@mikro-orm/decorators/legacy';

@Entity({ tableName: 'books' })
export class BookOrmEntity {
  @PrimaryKey({ type: 'varchar' })
  code!: string;

  @Property({ type: 'varchar' })
  title!: string;

  @Property({ type: 'varchar' })
  author!: string;

  @Property({ type: 'int' })
  stock!: number;
}
