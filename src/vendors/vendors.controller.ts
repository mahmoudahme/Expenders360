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

import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @ApiOperation({ summary: 'Create a new vendor' })
  @Post()
  @Roles('admin')
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(createVendorDto);
  }

  @ApiOperation({ summary: 'Get all vendors' })
  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  @ApiOperation({ summary: 'Get vendor by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update vendor' })
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorsService.update(+id, updateVendorDto);
  }

  @ApiOperation({ summary: 'Delete vendor' })
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(+id);
  }
}
