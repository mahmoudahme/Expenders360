import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, clientId: number) {
    const project = this.projectRepository.create({
      ...createProjectDto,
      clientId,
    });

    return this.projectRepository.save(project);
  }

  async findAll(clientId?: number) {
    const where = clientId ? { clientId } : {};
    return this.projectRepository.find({
      where,
      relations: ['client', 'matches'],
    });
  }

  async findOne(id: number, clientId?: number) {
    const where = clientId ? { id, clientId } : { id };
    const project = await this.projectRepository.findOne({
      where,
      relations: ['client', 'matches'],
    });

    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, clientId?: number) {
    const project = await this.findOne(id, clientId);

    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: number, clientId?: number) {
    const project = await this.findOne(id, clientId);
    return this.projectRepository.remove(project);
  }

  async findActiveProjects() {
    return this.projectRepository.find({
      where: { status: 'active' },
      relations: ['matches'],
    });
  }
}
