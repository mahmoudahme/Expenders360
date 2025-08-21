// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Project } from '../projects/entities/project.entity';
import { Vendor } from '../vendors/entities/vendor.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async sendNewMatchNotification(
    clientEmail: string,
    project: Project,
    vendor: Vendor,
    score: number,
  ) {
    await this.emailQueue.add('new-match', {
      to: clientEmail,
      subject: 'New Vendor Match Found!',
      template: 'new-match',
      data: {
        projectId: project.id,
        vendorName: vendor.name,
        score,
        country: project.country,
      },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async dailyMatchRefresh() {
    console.log('Starting daily match refresh...');
    
    // Find active projects directly
    const activeProjects = await this.projectRepository.find({
      where: { status: 'active' },
      relations: ['client'],
    });
    
    console.log(`Found ${activeProjects.length} active projects`);
    console.log('Daily match refresh completed');
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async checkExpiredSlas() {
    console.log('Checking for expired SLA vendors...');
    
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 48);

    const expiredVendors = await this.vendorRepository
      .createQueryBuilder('vendor')
      .where('vendor.lastResponseAt < :cutoffDate', { cutoffDate })
      .orWhere('vendor.lastResponseAt IS NULL')
      .getMany();
    
    for (const vendor of expiredVendors) {
      await this.emailQueue.add('sla-warning', {
        to: 'admin@company.com',
        subject: 'Vendor SLA Warning',
        template: 'sla-warning',
        data: {
          vendorName: vendor.name,
          slaHours: vendor.responseSlaHours,
          lastResponse: vendor.lastResponseAt,
        },
      });
    }
    
    console.log(`Found ${expiredVendors.length} vendors with expired SLAs`);
  }
}