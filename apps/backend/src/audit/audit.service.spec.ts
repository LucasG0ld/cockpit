import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuditService', () => {
  let service: AuditService;
  let prisma: PrismaService;

  const mockPrisma = {
    auditEvent: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should record an event', async () => {
    const event = {
      organizationId: 'org_123',
      actorId: 'user_123',
      type: 'user.team_member.invited',
      targetId: 'user_456',
      metadata: { email: 'test@example.com' },
    };

    await service.recordEvent(event);

    expect(prisma.auditEvent.create).toHaveBeenCalledWith({
      data: event,
    });
  });
});
