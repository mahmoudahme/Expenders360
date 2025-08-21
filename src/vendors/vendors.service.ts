import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto) {
    const vendor = this.vendorRepository.create(createVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async findAll() {
    return this.vendorRepository.find({
      relations: ['matches'],
    });
  }

  async findOne(id: number) {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['matches'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor #${id} not found`);
    }

    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
    const vendor = await this.findOne(id);
    Object.assign(vendor, updateVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async remove(id: number) {
    const vendor = await this.findOne(id);
    return this.vendorRepository.remove(vendor);
  }

  async findVendorsForMatching(country: string, servicesNeeded: string[]) {
    return this.vendorRepository
      .createQueryBuilder('vendor')
      .where('vendor.countriesSupported LIKE :country', { country: `%${country}%` })
      .andWhere(
        servicesNeeded.map((service, index) => 
          `vendor.servicesOffered LIKE :service${index}`
        ).join(' OR '),
        servicesNeeded.reduce((params, service, index) => {
          params[`service${index}`] = `%${service}%`;
          return params;
        }, {})
      )
      .getMany();
  }

  async findExpiredSlaVendors() {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 48); // 48 hours ago

    return this.vendorRepository
      .createQueryBuilder('vendor')
      .where('vendor.lastResponseAt < :cutoffDate', { cutoffDate })
      .orWhere('vendor.lastResponseAt IS NULL')
      .getMany();
  }
}
