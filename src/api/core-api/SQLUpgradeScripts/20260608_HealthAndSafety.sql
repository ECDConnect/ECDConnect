
--find the content type field
select * from "ContentTypeField" WHERE "FieldName" = 'canSkip' and "ContentTypeId" = '41' -- 660 / true

--get the content values
select * from "ContentValue" cv 
where cv."Value" = 'Confirm venue address'
--where cv."ContentId" in ('206983','207010')

update "ContentValue" cv set "Value" = 'Calculate classroom capacity'
where "Value" = 'Calculate capacity for each classroom'

update "ContentValue" cv set "Value" = 'Health, sanitation & safety'
where "Value" = 'Health, sanitation and safety'

update "ContentValue" cv set "Value" = 'Structure & area'
where "Value" = 'Structure, space and area'