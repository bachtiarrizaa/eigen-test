import { Test, TestingModule } from '@nestjs/testing';
import { DeleteMemberUseCase } from './delete-member.use-case';
import {
  MEMBER_REPOSITORY,
  IMemberRepository,
} from '../../domain/interfaces/member.repository';
import {
  BORROWING_REPOSITORY,
  IBorrowingRepository,
} from '../../../borrowing/domain/interfaces/borrowing.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Member } from '../../domain/entities/member.entity';
import { Borrowing } from '../../../borrowing/domain/entities/borrowing.entity';

describe('DeleteMemberUseCase', () => {
  let deleteMemberUseCase: DeleteMemberUseCase;
  let memberRepository: jest.Mocked<IMemberRepository>;
  let borrowingRepository: jest.Mocked<IBorrowingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteMemberUseCase,
        {
          provide: MEMBER_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: BORROWING_REPOSITORY,
          useValue: {
            findActiveByMember: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteMemberUseCase = module.get<DeleteMemberUseCase>(DeleteMemberUseCase);
    memberRepository = module.get(MEMBER_REPOSITORY);
    borrowingRepository = module.get(BORROWING_REPOSITORY);
  });

  it('should delete a member successfully', async () => {
    const id = 'uuid-123';
    const member = new Member('M001', 'Angga', null, id);

    jest.spyOn(memberRepository, 'findById').mockResolvedValue(member);
    jest.spyOn(borrowingRepository, 'findActiveByMember').mockResolvedValue([]);
    const deleteSpy = jest
      .spyOn(memberRepository, 'delete')
      .mockResolvedValue(undefined);

    await deleteMemberUseCase.execute(id);

    expect(deleteSpy).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException if member not found', async () => {
    const id = 'nonexistent-id';

    jest.spyOn(memberRepository, 'findById').mockResolvedValue(null);

    await expect(deleteMemberUseCase.execute(id)).rejects.toThrow(
      NotFoundException,
    );
    await expect(deleteMemberUseCase.execute(id)).rejects.toThrow(
      'Member not found',
    );
  });

  it('should throw BadRequestException if member has active borrowings', async () => {
    const id = 'uuid-123';
    const member = new Member('M001', 'Angga', null, id);
    const activeBorrowings = [
      new Borrowing('M001', 'JK-45', new Date()),
      new Borrowing('M001', 'SHR-1', new Date()),
    ];

    jest.spyOn(memberRepository, 'findById').mockResolvedValue(member);
    jest
      .spyOn(borrowingRepository, 'findActiveByMember')
      .mockResolvedValue(activeBorrowings);

    await expect(deleteMemberUseCase.execute(id)).rejects.toThrow(
      BadRequestException,
    );
    await expect(deleteMemberUseCase.execute(id)).rejects.toThrow(
      'Cannot delete member with active borrowings',
    );
  });

  it('should allow deletion if member has no active borrowings', async () => {
    const id = 'uuid-123';
    const member = new Member('M001', 'Angga', null, id);

    jest.spyOn(memberRepository, 'findById').mockResolvedValue(member);
    jest.spyOn(borrowingRepository, 'findActiveByMember').mockResolvedValue([]);
    const deleteSpy = jest
      .spyOn(memberRepository, 'delete')
      .mockResolvedValue(undefined);

    await deleteMemberUseCase.execute(id);

    expect(deleteSpy).toHaveBeenCalledWith(id);
  });

  it('should check active borrowings for the member', async () => {
    const id = 'uuid-123';
    const member = new Member('M001', 'Angga', null, id);

    jest.spyOn(memberRepository, 'findById').mockResolvedValue(member);
    jest.spyOn(borrowingRepository, 'findActiveByMember').mockResolvedValue([]);
    jest.spyOn(memberRepository, 'delete').mockResolvedValue(undefined);

    const borrowingSpy = jest.spyOn(borrowingRepository, 'findActiveByMember');

    await deleteMemberUseCase.execute(id);

    expect(borrowingSpy).toHaveBeenCalledWith(id);
  });
});
