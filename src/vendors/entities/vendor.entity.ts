import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Match } from '../../matches/entities/match.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('simple-array', { name: 'countries_supported' })
  countriesSupported: string[];

  @Column('simple-array', { name: 'services_offered' })
  servicesOffered: string[];

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ name: 'response_sla_hours', default: 24 })
  responseSlaHours: number;

  @Column({ name: 'last_response_at', nullable: true })
  lastResponseAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Match, match => match.vendor)
  matches: Match[];
}
