




UPDATE public."ContentTypeField" SET  "DisplayMainTable" = 	false 
where "FieldName" = 'isScored' and "ContentTypeId" = 41;

UPDATE public."ContentTypeField" SET  "DisplayMainTable" = 	false 
where "FieldName" = 'isScoreResult' and "ContentTypeId" = 41;

UPDATE public."ContentTypeField" SET  "DisplayMainTable" = 	false 
where "FieldName" = 'canSkip' and "ContentTypeId" = 41;

UPDATE public."ContentTypeField" SET  "DisplayMainTable" = 	false 
where "FieldName" = 'multiAnswers' and "ContentTypeId" = 41;

UPDATE public."ContentTypeField" SET  "DisplayMainTable" = 	false 
where "FieldName" = 'minValue' and "ContentTypeId" = 42;

UPDATE public."ContentTypeField" SET  "DisplayMainTable" = 	false 
where "FieldName" = 'nameDescription' and "ContentTypeId" = 42;


UPDATE public."ContentTypeField" SET  "DisplayMainTable" = 	false 
where "FieldName" in ('buttonlinkA', 'buttonlinkADescription','buttonlinkB','buttonlinkBDescription','buttonlinkC','buttonlinkCDescription','infoBoxBTitle','infoBoxBDescription','infoBoxBLink','infoBoxBLinkDescription') and "ContentTypeId" = 15;

