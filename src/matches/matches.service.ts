import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Match } from './entities/match.entity';
import { VendorsService } from '../vendors/vendors.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private vendorsService: VendorsService,
    private notificationsService: NotificationsService,
  ) {}

  async rebuildMatches(projectId: number) {
    // Get project details
    const project = await this.matchRepository.manager.findOne(Project, {
      where: { id: projectId },
      relations: ['client'],
    });

    if (!project) {
      throw new NotFoundException(`Project #${projectId} not found`);
    }

    // Find suitable vendors
    const vendors = await this.vendorsService.findVendorsForMatching(
      project.country,
      project.servicesNeeded,
    );

    const matches = [];

    for (const vendor of vendors) {
      // Calculate match score
      const servicesOverlap = this.calculateServicesOverlap(
        project.servicesNeeded,
        vendor.servicesOffered,
      );
      
      const slaWeight = this.calculateSlaWeight(vendor.responseSlaHours);
      const score = servicesOverlap * 2 + parseFloat(vendor.rating.toString()) + slaWeight;

      // Upsert match
      const existingMatch = await this.matchRepository.findOne({
        where: { projectId, vendorId: vendor.id },
      });

      if (existingMatch) {
        existingMatch.score = score;
        await this.matchRepository.save(existingMatch);
        matches.push(existingMatch);
      } else {
        const newMatch = this.matchRepository.create({
          projectId,
          vendorId: vendor.id,
          score,
        });
        const savedMatch = await this.matchRepository.save(newMatch);
        matches.push(savedMatch);

        // Send notification for new match
        await this.notificationsService.sendNewMatchNotification(
          project.client.contactEmail,
          project,
          vendor,
          score,
        );
      }
    }

    return matches;
  }

  private calculateServicesOverlap(needed: string[], offered: string[]): number {
    const intersection = needed.filter(service => 
      offered.some(offer => offer.toLowerCase().includes(service.toLowerCase()))
    );
    return intersection.length;
  }

  private calculateSlaWeight(slaHours: number): number {
    if (slaHours <= 12) return 2;
    if (slaHours <= 24) return 1;
    if (slaHours <= 48) return 0.5;
    return 0;
  }

  async findByProject(projectId: number) {
    return this.matchRepository.find({
      where: { projectId },
      relations: ['vendor'],
      order: { score: 'DESC' },
    });
  }

  async getTopVendorsByCountry(days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const query = `
      SELECT 
        p.country,
        v.id,
        v.name,
        AVG(m.score) as avg_score,
        COUNT(m.id) as match_count
      FROM matches m
      JOIN vendors v ON m.vendor_id = v.id
      JOIN projects p ON m.project_id = p.id
      WHERE m.created_at >= ?
      GROUP BY p.country, v.id, v.name
      ORDER BY p.country, avg_score DESC
    `;

    const results = await this.matchRepository.query(query, [cutoffDate]);
    
    // Group by country and take top 3 per country
    const grouped = results.reduce((acc, row) => {
      if (!acc[row.country]) {
        acc[row.country] = [];
      }
      if (acc[row.country].length < 3) {
        acc[row.country].push({
          vendorId: row.id,
          vendorName: row.name,
          avgScore: parseFloat(row.avg_score),
          matchCount: parseInt(row.match_count),
        });
      }
      return acc;
    }, {});

    return grouped;
  }
}
