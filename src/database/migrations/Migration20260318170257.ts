import { Migration } from '@mikro-orm/migrations';

export class Migration20260318170257 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "books" ("id" uuid not null, "code" varchar(255) not null, "title" varchar(255) not null, "author" varchar(255) not null, "stock" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "books" add constraint "books_code_unique" unique ("code");`,
    );

    this.addSql(
      `create table "members" ("id" uuid not null, "code" varchar(255) not null, "name" varchar(255) not null, "penalty_end_date" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "members" add constraint "members_code_unique" unique ("code");`,
    );

    this.addSql(
      `create table "borrowings" ("id" uuid not null, "member_id" uuid not null, "book_id" uuid not null, "borrowed_at" timestamptz not null, "returned_at" timestamptz null, "updated_at" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "borrowings" add constraint "borrowings_member_id_foreign" foreign key ("member_id") references "members" ("id");`,
    );
    this.addSql(
      `alter table "borrowings" add constraint "borrowings_book_id_foreign" foreign key ("book_id") references "books" ("id");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "borrowings" drop constraint "borrowings_book_id_foreign";`,
    );
    this.addSql(
      `alter table "borrowings" drop constraint "borrowings_member_id_foreign";`,
    );

    this.addSql(`drop table if exists "books" cascade;`);
    this.addSql(`drop table if exists "members" cascade;`);
    this.addSql(`drop table if exists "borrowings" cascade;`);
  }
}
