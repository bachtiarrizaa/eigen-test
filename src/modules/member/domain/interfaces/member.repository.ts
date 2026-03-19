import { Member } from '../entities/member.entity';

export const MEMBER_REPOSITORY = 'MEMBER_REPOSITORY';

export interface IMemberRepository {
  findAll(): Promise<Member[]>;
  findByCode(code: string): Promise<Member | null>;
  findById(id: string): Promise<Member | null>;
  save(book: Member): Promise<void>;
  update(id: string, member: Member): Promise<void>;
  delete(id: string): Promise<void>;
}
