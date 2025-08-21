import { Injectable } from '@nestjs/common';

import { MatchesService } from '../matches/matches.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private matchesService: MatchesService,
    private documentsService: DocumentsService,
  ) {}

  async getTopVendorsAnalytics() {
    const topVendorsByCountry = await this.matchesService.getTopVendorsByCountry(30);
    
    const analyticsData = {};

    for (const [country, vendors] of Object.entries(topVendorsByCountry)) {
      const documentCount = await this.documentsService.countDocumentsByCountryAndProject(country);
      
      analyticsData[country] = {
        topVendors: vendors,
        documentCount,
      };
    }

    return analyticsData;
  }
}
