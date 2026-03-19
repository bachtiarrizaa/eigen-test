import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, forwardRef } from '@nestjs/common';
import { MemberOrmEntity } from './infrastructure/member.orm-entity';
import { MemberController } from './member.controller';
import { MEMBER_REPOSITORY } from './domain/interfaces/member.repository';
import { MemberRepository } from './infrastructure/repositories/book.repository';
import { GetMemberUseCase } from './application/use-cases/get-members.use-case';
import { CreateMemberUseCase } from './application/use-cases/create-member.use-case';
import { UpdateMemberUseCase } from './application/use-cases/update-member.use-case';
import { DeleteMemberUseCase } from './application/use-cases/delete-member.use-case';
import { BorrowingModule } from '../borrowing/borrowing.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([MemberOrmEntity]),
    forwardRef(() => BorrowingModule),
  ],
  controllers: [MemberController],
  providers: [
    {
      provide: MEMBER_REPOSITORY,
      useClass: MemberRepository,
    },
    GetMemberUseCase,
    CreateMemberUseCase,
    UpdateMemberUseCase,
    DeleteMemberUseCase,
  ],
  exports: [MEMBER_REPOSITORY],
})
export class MemberModule {}
