import 'dotenv/config';
import { LoadStrategy, defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

export const mikroOrmConfig = defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  dbName: process.env.DB_NAME || 'hrbeacon_db',
  loadStrategy: LoadStrategy.BALANCED,
  populateWhere: 'infer',
  entities: ['dist/**/*.orm-entity.js'],
  entitiesTs: ['src/**/*.orm-entity.ts'],
  debug: true,
  allowGlobalContext: true,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  seeder: {
    path: 'dist/seeders',
    pathTs: 'src/seeders',
  },
  extensions: [Migrator],
});

export default mikroOrmConfig;
