import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

@Entity('matches')
@Index(['projectId', 'vendorId'], { unique: true })
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'vendor_id' })
  vendorId: number;

  @Column('decimal', { precision: 5, scale: 2 })
  score: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Project, project => project.matches)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Vendor, vendor => vendor.matches)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;
}
