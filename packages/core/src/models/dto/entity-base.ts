export interface EntityBase {
  id?: string;
  insertedDate?: Date | string;
  updatedDate?: Date | string;
  updatedBy?: string;
  isActive?: boolean;
  isOnline?: boolean;
}
