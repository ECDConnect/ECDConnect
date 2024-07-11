insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 5, 'shareContent', 1, true, '', 1, current_date, current_date, null, null, 'Share Content', false, true, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 11, 'shareContent', 1, true, '', 2, current_date, current_date, null, null, 'Share Content', false, true, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 6, 'shareContent', 1, true, '', 3, current_date, current_date, null, null, 'Share Content', false, true, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 6, 'shareContent', 1, true, '', 4, current_date, current_date, null, null, 'Share Content', false, true, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 6, 'shareContent', 1, true, '', 5, current_date, current_date, null, null, 'Share Content', false, true, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 6, 'shareContent', 1, true, '', 6, current_date, current_date, null, null, 'Share Content', false, true, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 4, 'shareContent', 1, true, '', 7, current_date, current_date, null, null, 'Share Content', false, true, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 5, 'shareContent', 1, true, '', 8, current_date, current_date, null, null, 'Share Content', false, true, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 7, 'shareContent', 1, true, '', 9, current_date, current_date, null, null, 'Share Content', false, true, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 9, 'shareContent', 1, true, '', 10, current_date, current_date, null, null, 'Share Content', false, true, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 5, 'shareContent', 1, true, '', 11, current_date, current_date, null, null, 'Share Content', false, true, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 3, 'shareContent', 1, true, '', 12, current_date, current_date, null, null, 'Share Content', false, true, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 10, 'shareContent', 1, true, '', 13, current_date, current_date, null, null, 'Share Content', false, true, false; 


---------------date----------------------
insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 6, 'updatedDate', 1, true, '', 1, current_date, current_date, null, null, 'Last updated', true, false, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 12, 'updatedDate', 1, true, '', 2, current_date, current_date, null, null, 'Last updated', true, false, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 7, 'updatedDate', 1, true, '', 3, current_date, current_date, null, null, 'Last updated', true, false, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 7, 'updatedDate', 1, true, '', 4, current_date, current_date, null, null, 'Last updated', true, false, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 7, 'updatedDate', 1, true, '', 5, current_date, current_date, null, null, 'Last updated', true, false, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 7, 'updatedDate', 1, true, '', 6, current_date, current_date, null, null, 'Last updated', true, false, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 5, 'updatedDate', 1, true, '', 7, current_date, current_date, null, null, 'Last updated', true, false, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 6, 'updatedDate', 1, true, '', 8, current_date, current_date, null, null, 'Last updated', true, false, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 8, 'updatedDate', 1, true, '', 9, current_date, current_date, null, null, 'Last updated', true, false, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 10, 'updatedDate', 1, true, '', 10, current_date, current_date, null, null, 'Last updated', true, false, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 6, 'updatedDate', 1, true, '', 11, current_date, current_date, null, null, 'Last updated', true, false, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 4, 'updatedDate', 1, true, '', 12, current_date, current_date, null, null, 'Last updated', true, false, false; 

insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 11, 'updatedDate', 1, true, '', 13, current_date, current_date, null, null, 'Last updated', true, false, false; 

-- activities and themes
INSERT INTO public."ContentTypeField"
("Id", "FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 12, 'themes', 4, true, 'Theme', 13, current_date, current_date, NULL, null, 'Themes', true, true, false);

-- story books and themes
INSERT INTO public."ContentTypeField"
("Id", "FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 11, 'themes', 4, true, 'Theme', 10, current_date, current_date, NULL, null, 'Themes', true, true, false);