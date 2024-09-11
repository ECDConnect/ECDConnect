-- ADD CONTENT FIELD FOR SKILL SUPPORTING IMAGE

-- TODO look up highest contentTypeFieldId and replace first parameter with next value!
select * from "ContentTypeField" order by "Id" desc;

INSERT INTO public."ContentTypeField" ("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(593, 5, 'isReverseScored', 3, true, '', 7, CURRENT_DATE, CURRENT_DATE, '', null, 'Reverse scored', false, true, false);
