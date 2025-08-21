import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Document, DocumentDocument } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { SearchDocumentsDto } from './dto/search-documents.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<DocumentDocument>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto, file?: Express.Multer.File) {
    const documentData = {
      ...createDocumentDto,
      fileName: file?.originalname,
      fileSize: file?.size,
      mimeType: file?.mimetype,
    };

    const document = new this.documentModel(documentData);
    return document.save();
  }

  async findAll(projectId?: number) {
    const filter = projectId ? { projectId } : {};
    return this.documentModel.find(filter).exec();
  }

  async findOne(id: string) {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document #${id} not found`);
    }
    return document;
  }

  async search(searchDto: SearchDocumentsDto) {
    const filter: any = {};

    if (searchDto.projectId) {
      filter.projectId = searchDto.projectId;
    }

    if (searchDto.tags && searchDto.tags.length > 0) {
      filter.tags = { $in: searchDto.tags };
    }

    if (searchDto.query) {
      filter.$text = { $search: searchDto.query };
    }

    return this.documentModel.find(filter).exec();
  }

  async update(id: string, updateData: Partial<CreateDocumentDto>) {
    const document = await this.documentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!document) {
      throw new NotFoundException(`Document #${id} not found`);
    }
    
    return document;
  }

  async remove(id: string) {
    const document = await this.documentModel.findByIdAndDelete(id).exec();
    if (!document) {
      throw new NotFoundException(`Document #${id} not found`);
    }
    return document;
  }

  async countDocumentsByCountryAndProject(country: string) {
    return this.documentModel
      .aggregate([
        {
          $lookup: {
            from: 'projects',
            localField: 'projectId',
            foreignField: 'id',
            as: 'project',
          },
        },
        {
          $unwind: '$project',
        },
        {
          $match: {
            'project.country': country,
            'project.status': 'active',
          },
        },
        {
          $count: 'total',
        },
      ])
      .exec()
      .then(result => (result[0]?.total || 0));
  }
}
