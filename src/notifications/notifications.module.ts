// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationsService } from './notifications.service';
import { EmailProcessor } from './processors/email.processor';
import { Project } from '../projects/entities/project.entity';
import { Vendor } from '../vendors/entities/vendor.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
    TypeOrmModule.forFeature([Project, Vendor]),
  ],
  providers: [NotificationsService, EmailProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}