import { EntityBase } from '../entity-base';
import { NoteTypeDto } from './note-type.dto';

export interface NoteDto extends EntityBase {
  name: string;
  bodyText: string;
  noteTypeId: string;
  noteType?: NoteTypeDto;
  userId?: string;
  insertedDate: Date | string;
  createdUserId: string;
}
