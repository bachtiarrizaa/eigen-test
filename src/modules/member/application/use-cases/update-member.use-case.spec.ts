import { Test, TestingModule } from '@nestjs/testing';
import { UpdateMemberUseCase } from './update-member.use-case';
import {
  MEMBER_REPOSITORY,
  IMemberRepository,
} from '../../domain/interfaces/member.repository';
import { UpdateMemberDto } from '../dtos/member.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Member } from '../../domain/entities/member.entity';

describe('UpdateMemberUseCase', () => {
  let updateMemberUseCase: UpdateMemberUseCase;
  let memberRepository: jest.Mocked<IMemberRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMemberUseCase,
        {
          provide: MEMBER_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            findByCode: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    updateMemberUseCase = module.get<UpdateMemberUseCase>(UpdateMemberUseCase);
    memberRepository = module.get(MEMBER_REPOSITORY);
  });

  it('should update a member successfully', async () => {
    const id = 'uuid-123';
    const existingMember = new Member('M001', 'Angga', null, id);
    const dto: UpdateMemberDto = {
      code: 'M001',
      name: 'Angga Updated',
    };

    jest.spyOn(memberRepository, 'findById').mockResolvedValue(existingMember);
    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(null);
    const updateSpy = jest
      .spyOn(memberRepository, 'update')
      .mockResolvedValue(undefined);

    const result = await updateMemberUseCase.execute(id, dto);

    expect(result.code).toBe(dto.code);
    expect(result.name).toBe(dto.name);
    expect(updateSpy).toHaveBeenCalledWith(id, expect.any(Member));
  });

  it('should throw NotFoundException if member not found', async () => {
    const id = 'nonexistent-id';
    const dto: UpdateMemberDto = {
      code: 'M001',
      name: 'Angga',
    };

    jest.spyOn(memberRepository, 'findById').mockResolvedValue(null);

    await expect(updateMemberUseCase.execute(id, dto)).rejects.toThrow(
      NotFoundException,
    );
    await expect(updateMemberUseCase.execute(id, dto)).rejects.toThrow(
      'Member not found',
    );
  });

  it('should throw BadRequestException if new code already exists', async () => {
    const id = 'uuid-123';
    const existingMember = new Member('M001', 'Angga', null, id);
    const anotherMember = new Member('M002', 'Ferry');
    const dto: UpdateMemberDto = {
      code: 'M002',
      name: 'Angga',
    };

    jest.spyOn(memberRepository, 'findById').mockResolvedValue(existingMember);
    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(anotherMember);

    await expect(updateMemberUseCase.execute(id, dto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(updateMemberUseCase.execute(id, dto)).rejects.toThrow(
      'Member with this code already exists',
    );
  });

  it('should allow updating code if not used by another member', async () => {
    const id = 'uuid-123';
    const existingMember = new Member('M001', 'Angga', null, id);
    const dto: UpdateMemberDto = {
      code: 'M002',
      name: 'Angga',
    };

    jest.spyOn(memberRepository, 'findById').mockResolvedValue(existingMember);
    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(null);
    const updateSpy = jest
      .spyOn(memberRepository, 'update')
      .mockResolvedValue(undefined);

    const result = await updateMemberUseCase.execute(id, dto);

    expect(result.code).toBe('M002');
    expect(updateSpy).toHaveBeenCalled();
  });

  it('should allow updating name only', async () => {
    const id = 'uuid-123';
    const existingMember = new Member('M001', 'Angga', null, id);
    const dto: UpdateMemberDto = {
      code: 'M001',
      name: 'Angga Pratama',
    };

    jest.spyOn(memberRepository, 'findById').mockResolvedValue(existingMember);
    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(null);
    const updateSpy = jest
      .spyOn(memberRepository, 'update')
      .mockResolvedValue(undefined);

    const result = await updateMemberUseCase.execute(id, dto);

    expect(result.name).toBe('Angga Pratama');
    expect(updateSpy).toHaveBeenCalled();
  });
});
