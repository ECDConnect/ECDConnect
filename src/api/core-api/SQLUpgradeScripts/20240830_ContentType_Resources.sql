INSERT INTO "ContentType" ("Id","Name","Description","MetaData","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","IsVisiblePortal","PortalDisplayOrder") VALUES
	 (39,'ClassroomBusinessResource','Resources',NULL,true,current_date,current_date,NULL,NULL,true,-1);

INSERT INTO "ContentTypeField" ("Id","FieldOrder","FieldName","FieldTypeId","IsActive","DataLinkName","ContentTypeId","InsertedDate","UpdatedDate","UpdatedBy","TenantId","DisplayName","DisplayMainTable","DisplayPage","IsRequired") VALUES
(nextval('public."ContentTypeField_Id_seq"'),1,'resourceType',1,true,'',39,current_date,current_date,NULL,NULL,'Resource Type',true,true,true),
(nextval('public."ContentTypeField_Id_seq"'),2,'title',1,true,'',39,current_date,current_date,NULL,NULL,'Title',true,true,true),
(nextval('public."ContentTypeField_Id_seq"'),3,'shortDescription',1,true,'',39,current_date,current_date,NULL,NULL,'Short description',true,true,true),
(nextval('public."ContentTypeField_Id_seq"'),4,'link',1,true,'',39,current_date,current_date,NULL,NULL,'Link',true,true,true),
(nextval('public."ContentTypeField_Id_seq"'),5,'longDescription',2,true,'',39,current_date,current_date,NULL,NULL,'Description',true,true,true),
(nextval('public."ContentTypeField_Id_seq"'),6,'dataFree',1,true,'',39,current_date,current_date,NULL,NULL,'Is the resource data free?',true,true,true),
(nextval('public."ContentTypeField_Id_seq"'),7,'sectionType',1,true,'',39,current_date,current_date,NULL,NULL,'Section Type',false,false,false),
(nextval('public."ContentTypeField_Id_seq"'),8,'numberLikes',1,true,'',39,current_date,current_date,NULL,NULL,'# of likes',true,false,false),
(nextval('public."ContentTypeField_Id_seq"'),9,'updatedDate',1,true,'',39,current_date,current_date,NULL,NULL,'Last updated',true,false,false),
(nextval('public."ContentTypeField_Id_seq"'),10,'availableLanguages',5,true,'Language',39,current_date,current_date,NULL,NULL,'Lanagues',false,false,false),
(nextval('public."ContentTypeField_Id_seq"'),11,'insertedDate',1,true,'',39,current_date,current_date,NULL,NULL,'Inserted Date',true,false,false);



