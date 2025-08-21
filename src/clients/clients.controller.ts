import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({ summary: 'Create a new client' })
  @Post()
  @Roles('admin')
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @ApiOperation({ summary: 'Get all clients' })
  @Get()
  @Roles('admin')
  findAll() {
    return this.clientsService.findAll();
  }

  @ApiOperation({ summary: 'Get client by ID' })
  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update client' })
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @ApiOperation({ summary: 'Delete client' })
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
