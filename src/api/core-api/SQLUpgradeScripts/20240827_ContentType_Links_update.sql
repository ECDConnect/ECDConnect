INSERT INTO "ContentType" ("Id","Name","Description","MetaData","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","IsVisiblePortal","PortalDisplayOrder") VALUES
	 (38,'ResourceLink','Resource Link',NULL,true,'0001-01-01 00:00:00.000','0001-01-01 00:00:00.000',NULL,NULL,true,-1);

INSERT INTO "ContentTypeField" ("Id","FieldOrder","FieldName","FieldTypeId","IsActive","DataLinkName","ContentTypeId","InsertedDate","UpdatedDate","UpdatedBy","TenantId","DisplayName","DisplayMainTable","DisplayPage","IsRequired") VALUES
(nextval('public."ContentTypeField_Id_seq"'),1,'title',1,true,'',38,'0001-01-01 00:00:00.000','0001-01-01 00:00:00.000',NULL,NULL,'Title',false,true,false),
(nextval('public."ContentTypeField_Id_seq"'),2,'link',1,true,'',38,'0001-01-01 00:00:00.000','0001-01-01 00:00:00.000',NULL,NULL,'Link',false,true,false),
(nextval('public."ContentTypeField_Id_seq"'),3,'description',1,true,'',38,'0001-01-01 00:00:00.000','0001-01-01 00:00:00.000',NULL,NULL,'Description',false,true,false);

