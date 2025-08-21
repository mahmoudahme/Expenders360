import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type DocumentDocument = Document & MongooseDocument;

@Schema({ timestamps: true })
export class Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  projectId: number;

  @Prop()
  fileName?: string;

  @Prop()
  fileSize?: number;

  @Prop()
  mimeType?: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);

// Create text index for search functionality
DocumentSchema.index({ title: 'text', content: 'text', tags: 'text' });

// src/documents/documents.service.ts
