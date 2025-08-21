// src/matches/matches.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { Match } from './entities/match.entity';
import { VendorsModule } from '../vendors/vendors.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    VendorsModule,
    NotificationsModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}