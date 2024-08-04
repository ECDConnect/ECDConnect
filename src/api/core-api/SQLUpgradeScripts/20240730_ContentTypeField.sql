
update "ContentTypeField" set "DisplayName" = 'Would you like to share this activity with other organisations' where "ContentTypeId" =13 and "FieldName" ='shareContent';
update "ContentTypeField" set "DisplayName" = 'Steps (What do I do?)' where "ContentTypeId" =13 and "FieldName" ='description';
update "ContentTypeField" set "DisplayName" = 'Notes' where "ContentTypeId" =13 and "FieldName" ='notes';


update "ContentTypeField" set "DisplayName" = 'Title' where "ContentTypeId" =8 and "FieldName" ='name';
update "ContentTypeField" set "DisplayName" = 'Theme icon' where "ContentTypeId"=8 and "FieldName" = 'imageUrl';
update "ContentTypeField" set "DisplayName" = 'Would you like to share this theme with other organisations using other versions of ECD Connect? *' where "ContentTypeId" =8 and "FieldName" ='shareContent';