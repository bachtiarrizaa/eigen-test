import { Module, forwardRef } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BorrowingOrmEntity } from './infrastructure/borrowing.orm-entity';
import { BorrowingRepository } from './infrastructure/repositories/borrowing.repository';
import { BorrowingController } from './borrowing.controller';
import { BorrowBookUseCase } from './application/use-case/borrow-book.use-case';
import { ReturnBookUseCase } from './application/use-case/return-book.use-case';
import { BookModule } from '../book/book.module';
import { MemberModule } from '../member/member.module';
import { BORROWING_REPOSITORY } from './domain/interfaces/borrowing.repository';

@Module({
  imports: [
    MikroOrmModule.forFeature([BorrowingOrmEntity]),
    forwardRef(() => BookModule),
    forwardRef(() => MemberModule),
  ],
  controllers: [BorrowingController],
  providers: [
    {
      provide: BORROWING_REPOSITORY,
      useClass: BorrowingRepository,
    },
    BorrowBookUseCase,
    ReturnBookUseCase,
  ],
  exports: [BORROWING_REPOSITORY],
})
export class BorrowingModule {}
