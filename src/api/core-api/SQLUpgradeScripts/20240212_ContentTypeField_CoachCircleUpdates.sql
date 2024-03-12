update "ContentTypeField" set "IsRequired" = true, "DisplayMainTable" = true, "DisplayPage"=true where "ContentTypeId" =26 and "FieldName" ='title';
update "ContentTypeField" set "IsRequired" = true, "DisplayMainTable" = true, "DisplayPage"=true where "ContentTypeId" =26 and "FieldName" ='startDate';
update "ContentTypeField" set "IsRequired" = false, "DisplayMainTable" = true, "DisplayPage"=true where "ContentTypeId" =26 and "FieldName" ='endDate';
update "ContentTypeField" set "IsRequired" = true, "DisplayMainTable" = false, "DisplayPage"=true where "ContentTypeId" =26 and "FieldName" ='topicContent';
update "ContentTypeField" set "IsRequired" = true, "DisplayMainTable" = false, "DisplayPage"=true where "ContentTypeId" =26 and "FieldName" ='resource';