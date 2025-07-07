export interface EntityCacheBase {
  cacheId?: string;
  userCacheId?: string;
  parentCacheId?: string;
  isActive?: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface EntityDocumentBase extends EntityCacheBase {
  file?: string;
  fileName?: string;
  fileType?: string;
}
