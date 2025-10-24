import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async recordEvent(event: Prisma.AuditEventCreateInput) {
    try {
      await this.prisma.auditEvent.create({ data: event });
    } catch (error) {
      this.logger.warn('Failed to record audit event', error);
    }
  }
}
