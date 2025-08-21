import { Module } from '@nestjs/common';

import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { MatchesModule } from '../matches/matches.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [MatchesModule, DocumentsModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
