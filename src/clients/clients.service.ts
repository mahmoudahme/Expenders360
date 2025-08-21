import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  async findAll() {
    return this.clientRepository.find({
      relations: ['projects'],
    });
  }

  async findOne(id: number) {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['projects'],
    });

    if (!client) {
      throw new NotFoundException(`Client #${id} not found`);
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);
    return this.clientRepository.save(client);
  }

  async remove(id: number) {
    const client = await this.findOne(id);
    return this.clientRepository.remove(client);
  }
}