import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { GetMemberUseCase } from './application/use-cases/get-members.use-case';
import { CreateMemberUseCase } from './application/use-cases/create-member.use-case';
import { UpdateMemberUseCase } from './application/use-cases/update-member.use-case';
import { DeleteMemberUseCase } from './application/use-cases/delete-member.use-case';
import {
  CreateMemberDto,
  UpdateMemberDto,
} from './application/dtos/member.dto';
import { Member } from './domain/entities/member.entity';

describe('MemberController', () => {
  let memberController: MemberController;
  let getMembersUseCase: GetMemberUseCase;
  let createMemberUseCase: CreateMemberUseCase;
  let updateMemberUseCase: UpdateMemberUseCase;
  let deleteMemberUseCase: DeleteMemberUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: GetMemberUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateMemberUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateMemberUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteMemberUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    memberController = module.get<MemberController>(MemberController);
    getMembersUseCase = module.get(GetMemberUseCase);
    createMemberUseCase = module.get(CreateMemberUseCase);
    updateMemberUseCase = module.get(UpdateMemberUseCase);
    deleteMemberUseCase = module.get(DeleteMemberUseCase);
  });

  describe('findAll', () => {
    it('should call findAll use case', async () => {
      const result = [
        {
          code: 'M001',
          name: 'Angga',
          penaltyEndDate: null,
          borrowCount: 0,
        },
        {
          code: 'M002',
          name: 'Ferry',
          penaltyEndDate: null,
          borrowCount: 1,
        },
      ];
      const executeSpy = jest
        .spyOn(getMembersUseCase, 'execute')
        .mockResolvedValue(result);

      expect(await memberController.findAll()).toBe(result);
      expect(executeSpy).toHaveBeenCalled();
    });

    it('should return members with borrow count', async () => {
      const result = [
        {
          code: 'M001',
          name: 'Angga',
          penaltyEndDate: null,
          borrowCount: 2,
        },
      ];
      jest.spyOn(getMembersUseCase, 'execute').mockResolvedValue(result);

      const response = await memberController.findAll();

      expect(response).toHaveLength(1);
      expect(response[0]).toHaveProperty('borrowCount');
    });
  });

  describe('create', () => {
    it('should call create use case', async () => {
      const dto: CreateMemberDto = {
        code: 'M004',
        name: 'John',
      };
      const result = new Member(dto.code, dto.name);
      const executeSpy = jest
        .spyOn(createMemberUseCase, 'execute')
        .mockResolvedValue(result);

      expect(await memberController.create(dto)).toBe(result);
      expect(executeSpy).toHaveBeenCalledWith(dto);
    });

    it('should pass dto to create use case', async () => {
      const dto: CreateMemberDto = {
        code: 'M001',
        name: 'Angga',
      };
      const executeSpy = jest
        .spyOn(createMemberUseCase, 'execute')
        .mockResolvedValue(new Member(dto.code, dto.name));

      await memberController.create(dto);

      expect(executeSpy).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call update use case with id and dto', async () => {
      const id = 'uuid-123';
      const dto: UpdateMemberDto = {
        code: 'M001',
        name: 'Angga Updated',
      };
      const result = new Member(dto.code, dto.name, null, id);
      const executeSpy = jest
        .spyOn(updateMemberUseCase, 'execute')
        .mockResolvedValue(result);

      expect(await memberController.update(id, dto)).toBe(result);
      expect(executeSpy).toHaveBeenCalledWith(id, dto);
    });

    it('should pass correct id and dto to use case', async () => {
      const id = 'uuid-456';
      const dto: UpdateMemberDto = {
        code: 'M002',
        name: 'Ferry Updated',
      };
      const executeSpy = jest
        .spyOn(updateMemberUseCase, 'execute')
        .mockResolvedValue(new Member(dto.code, dto.name, null, id));

      await memberController.update(id, dto);

      expect(executeSpy).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('delete', () => {
    it('should call delete use case with id', async () => {
      const id = 'uuid-123';
      const executeSpy = jest
        .spyOn(deleteMemberUseCase, 'execute')
        .mockResolvedValue(undefined);

      await memberController.delete(id);

      expect(executeSpy).toHaveBeenCalledWith(id);
    });

    it('should execute delete for correct member id', async () => {
      const id = 'uuid-789';
      const executeSpy = jest
        .spyOn(deleteMemberUseCase, 'execute')
        .mockResolvedValue(undefined);

      await memberController.delete(id);

      expect(executeSpy).toHaveBeenCalledWith(id);
    });
  });
});
