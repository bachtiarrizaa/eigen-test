import { Member } from './member.entity';

describe('Member Entity', () => {
  describe('constructor', () => {
    it('should create a member with required properties', () => {
      const member = new Member('M001', 'Angga');

      expect(member.code).toBe('M001');
      expect(member.name).toBe('Angga');
      expect(member.penaltyEndDate).toBeNull();
    });

    it('should create a member with all properties', () => {
      const testDate = new Date('2026-03-19');
      const member = new Member(
        'M001',
        'Angga',
        testDate,
        'uuid-id',
        new Date('2026-03-10'),
        new Date('2026-03-15'),
      );

      expect(member.code).toBe('M001');
      expect(member.name).toBe('Angga');
      expect(member.penaltyEndDate).toEqual(testDate);
      expect(member.id).toBe('uuid-id');
    });
  });

  describe('isPenalized', () => {
    it('should return false if penaltyEndDate is null', () => {
      const member = new Member('M001', 'Angga');

      expect(member.isPenalized()).toBe(false);
    });

    it('should return true if penaltyEndDate is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);

      const member = new Member('M001', 'Angga', futureDate);

      expect(member.isPenalized()).toBe(true);
    });

    it('should return false if penaltyEndDate is in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const member = new Member('M001', 'Angga', pastDate);

      expect(member.isPenalized()).toBe(false);
    });
  });

  describe('applyPenalty', () => {
    it('should set penaltyEndDate to 3 days from now', () => {
      const member = new Member('M001', 'Angga');
      const beforeApply = new Date();

      member.applyPenalty();

      expect(member.penaltyEndDate).not.toBeNull();
      expect(member.isPenalized()).toBe(true);

      const diff = member.penaltyEndDate!.getTime() - beforeApply.getTime();
      const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

      expect(daysDiff).toBe(3);
    });

    it('should replace existing penalty with new one', () => {
      const oldPenalty = new Date();
      oldPenalty.setDate(oldPenalty.getDate() + 1);

      const member = new Member('M001', 'Angga', oldPenalty);
      const oldEndDate = member.penaltyEndDate;

      member.applyPenalty();

      expect(member.penaltyEndDate).not.toEqual(oldEndDate);
      expect(member.isPenalized()).toBe(true);
    });
  });
});
