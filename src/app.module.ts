import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './config/mikro-orm.config';
import { BookModule } from './modules/book/book.module';

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig), BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
