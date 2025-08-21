import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MatchesService } from '../matches/matches.service';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly matchesService: MatchesService,
  ) {}

  @ApiOperation({ summary: 'Create a new project' })
  @Post()
  @Roles('client', 'admin')
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Get all projects' })
  @Get()
  findAll(@Request() req) {
    const clientId = req.user.role === 'admin' ? undefined : req.user.userId;
    return this.projectsService.findAll(clientId);
  }

  @ApiOperation({ summary: 'Get project by ID' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const clientId = req.user.role === 'admin' ? undefined : req.user.userId;
    return this.projectsService.findOne(+id, clientId);
  }

  @ApiOperation({ summary: 'Update project' })
  @Patch(':id')
  @Roles('client', 'admin')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ) {
    const clientId = req.user.role === 'admin' ? undefined : req.user.userId;
    return this.projectsService.update(+id, updateProjectDto, clientId);
  }

  @ApiOperation({ summary: 'Delete project' })
  @Delete(':id')
  @Roles('client', 'admin')
  remove(@Param('id') id: string, @Request() req) {
    const clientId = req.user.role === 'admin' ? undefined : req.user.userId;
    return this.projectsService.remove(+id, clientId);
  }

  @ApiOperation({ summary: 'Rebuild vendor matches for project' })
  @Post(':id/matches/rebuild')
  rebuildMatches(@Param('id') id: string) {
    return this.matchesService.rebuildMatches(+id);
  }
}