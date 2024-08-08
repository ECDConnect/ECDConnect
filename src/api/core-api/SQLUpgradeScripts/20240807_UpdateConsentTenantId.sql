-- update tenant id to null for all consent items
update "ContentValue" set "TenantId"=null where "ContentId" =238