import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'contact_email', unique: true })
  contactEmail: string;

  @Column()
  password: string;

  @Column({ default: 'client' })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Project, project => project.client)
  projects: Project[];
}