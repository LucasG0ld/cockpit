import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../prisma/generated/client';

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
    const event: Prisma.AuditEventCreateInput = {
      type: 'user.team_member.invited',
      targetId: 'user_456',
      metadata: { email: 'test@example.com' },
      organization: {
        connect: { id: 'org_123' },
      },
      actor: {
        connect: { id: 'user_123' },
      },
    };

    await service.recordEvent(event);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prisma.auditEvent.create).toHaveBeenCalledWith({
      data: event,
    });
  });
});
