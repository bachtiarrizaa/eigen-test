import { Test, TestingModule } from '@nestjs/testing';
import { GetMemberUseCase } from './get-members.use-case';
import {
  MEMBER_REPOSITORY,
  IMemberRepository,
} from '../../domain/interfaces/member.repository';
import {
  BORROWING_REPOSITORY,
  IBorrowingRepository,
} from '../../../borrowing/domain/interfaces/borrowing.repository';
import { Member } from '../../domain/entities/member.entity';
import { Borrowing } from '../../../borrowing/domain/entities/borrowing.entity';

describe('GetMemberUseCase', () => {
  let getMemberUseCase: GetMemberUseCase;
  let memberRepository: jest.Mocked<IMemberRepository>;
  let borrowingRepository: jest.Mocked<IBorrowingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMemberUseCase,
        {
          provide: MEMBER_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
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

    getMemberUseCase = module.get<GetMemberUseCase>(GetMemberUseCase);
    memberRepository = module.get(MEMBER_REPOSITORY);
    borrowingRepository = module.get(BORROWING_REPOSITORY);
  });

  it('should return all members with borrow count', async () => {
    const members = [
      new Member('M001', 'Angga'),
      new Member('M002', 'Ferry'),
      new Member('M003', 'Putri'),
    ];

    jest.spyOn(memberRepository, 'findAll').mockResolvedValue(members);
    jest.spyOn(borrowingRepository, 'findActiveByMember').mockResolvedValue([]);

    const result = await getMemberUseCase.execute();

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      code: 'M001',
      name: 'Angga',
      borrowCount: 0,
    });
    expect(result[1]).toMatchObject({
      code: 'M002',
      name: 'Ferry',
      borrowCount: 0,
    });
    expect(result[2]).toMatchObject({
      code: 'M003',
      name: 'Putri',
      borrowCount: 0,
    });
  });

  it('should count active borrowings per member', async () => {
    const members = [new Member('M001', 'Angga'), new Member('M002', 'Ferry')];

    jest.spyOn(memberRepository, 'findAll').mockResolvedValue(members);

    const mockBorrowings = [new Borrowing('M001', 'JK-45', new Date())];
    jest
      .spyOn(borrowingRepository, 'findActiveByMember')
      .mockImplementation((code: string) => {
        return Promise.resolve(code === 'M001' ? mockBorrowings : []);
      });

    const result = await getMemberUseCase.execute();

    expect(result[0].borrowCount).toBe(1);
    expect(result[1].borrowCount).toBe(0);
  });

  it('should include penaltyEndDate in response', async () => {
    const penaltyDate = new Date();
    penaltyDate.setDate(penaltyDate.getDate() + 2);

    const members = [new Member('M001', 'Angga', penaltyDate)];

    jest.spyOn(memberRepository, 'findAll').mockResolvedValue(members);
    jest.spyOn(borrowingRepository, 'findActiveByMember').mockResolvedValue([]);

    const result = await getMemberUseCase.execute();

    expect(result[0].penaltyEndDate).toEqual(penaltyDate);
  });

  it('should return empty array if no members exist', async () => {
    jest.spyOn(memberRepository, 'findAll').mockResolvedValue([]);

    const result = await getMemberUseCase.execute();

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });
});
