import { Test, TestingModule } from '@nestjs/testing';
import { CreateMemberUseCase } from './create-member.use-case';
import {
  MEMBER_REPOSITORY,
  IMemberRepository,
} from '../../domain/interfaces/member.repository';
import { CreateMemberDto } from '../dtos/member.dto';
import { BadRequestException } from '@nestjs/common';
import { Member } from '../../domain/entities/member.entity';

describe('CreateMemberUseCase', () => {
  let createMemberUseCase: CreateMemberUseCase;
  let memberRepository: jest.Mocked<IMemberRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMemberUseCase,
        {
          provide: MEMBER_REPOSITORY,
          useValue: {
            findByCode: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    createMemberUseCase = module.get<CreateMemberUseCase>(CreateMemberUseCase);
    memberRepository = module.get(MEMBER_REPOSITORY);
  });

  it('should create a member successfully', async () => {
    const dto: CreateMemberDto = {
      code: 'M001',
      name: 'Angga',
    };

    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(null);
    const saveSpy = jest
      .spyOn(memberRepository, 'save')
      .mockResolvedValue(undefined);

    const result = await createMemberUseCase.execute(dto);

    expect(result).toBeInstanceOf(Member);
    expect(result.code).toBe(dto.code);
    expect(result.name).toBe(dto.name);
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should throw BadRequestException if code already exists', async () => {
    const dto: CreateMemberDto = {
      code: 'M001',
      name: 'Angga',
    };

    const existingMember = new Member('M001', 'Existing Member');
    jest
      .spyOn(memberRepository, 'findByCode')
      .mockResolvedValue(existingMember);

    await expect(createMemberUseCase.execute(dto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(createMemberUseCase.execute(dto)).rejects.toThrow(
      'Member with this code already exists',
    );
  });

  it('should initialize penaltyEndDate as null', async () => {
    const dto: CreateMemberDto = {
      code: 'M002',
      name: 'Ferry',
    };

    jest.spyOn(memberRepository, 'findByCode').mockResolvedValue(null);
    jest.spyOn(memberRepository, 'save').mockResolvedValue(undefined);

    const result = await createMemberUseCase.execute(dto);

    expect(result.penaltyEndDate).toBeNull();
  });
});
