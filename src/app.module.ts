import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './config/mikro-orm.config';
import { BookModule } from './modules/book/book.module';
import { MemberModule } from './modules/member/member.module';

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig), BookModule, MemberModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
