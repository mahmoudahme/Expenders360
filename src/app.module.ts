import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { VendorsModule } from './vendors/vendors.module';
import { MatchesModule } from './matches/matches.module';
import { DocumentsModule } from './documents/documents.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // MySQL Connection
    TypeOrmModule.forRoot({ 
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USERNAME || 'root',
      password: process.env.DATABASE_PASSWORD === '' ? undefined : process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME || 'project_management',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),

    // MongoDB Connection
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/project_management_docs'
    ),

    // Redis/Bull Queue
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),

    // Schedule Module for CRON jobs
    ScheduleModule.forRoot(),

    // Feature Modules
    AuthModule,
    ClientsModule,
    ProjectsModule,
    VendorsModule,
    MatchesModule,
    DocumentsModule,
    AnalyticsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
