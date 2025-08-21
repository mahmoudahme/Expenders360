import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Match } from '../../matches/entities/match.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column()
  country: string;

  @Column('simple-array', { name: 'services_needed' })
  servicesNeeded: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Client, client => client.projects)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @OneToMany(() => Match, match => match.project)
  matches: Match[];
}