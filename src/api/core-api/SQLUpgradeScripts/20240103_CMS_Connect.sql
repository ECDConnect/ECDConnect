insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 2,'type', 1, true, '', 27, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null, 'Type', true, true; 
insert into "ContentTypeField"
select nextval('public."ContentTypeField_Id_seq"'), 3,'hint', 1, true, '', 27, '0001-01-01 00:00:00.000', '0001-01-01 00:00:00.000', null, null, 'Hint', true, true;

update "ContentType" set "IsVisiblePortal" = true where "Id" in (27,28);
update "ContentTypeField" set "DisplayMainTable" = true, "DisplayPage" = true where "ContentTypeId" in (27,28);