/*
-- afrikaans name
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '058b9d8e-e472-48d6-8415-ba9408b95395'::uuid as "LocaleId", cv."ContentTypeFieldId", "afrikaansName" as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishName" 
order by cv."ContentId"

-- afrikaans value
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '058b9d8e-e472-48d6-8415-ba9408b95395'::uuid as "LocaleId", cv."ContentTypeFieldId", "afrikaansvalue" as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- sepedi name
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '06370c67-692e-4664-a90a-c2de0621ff4d'::uuid as "LocaleId", cv2."ContentTypeFieldId", "sepediname" as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

--sepedi value
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '06370c67-692e-4664-a90a-c2de0621ff4d'::uuid as "LocaleId", cv."ContentTypeFieldId", "sepedivalue" as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- zulu name
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '7cc62017-7ee7-4f2c-9214-bc9be3f2396a'::uuid as "LocaleId", cv2."ContentTypeFieldId", "zuluname" as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- zulu value
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '7cc62017-7ee7-4f2c-9214-bc9be3f2396a'::uuid as "LocaleId", cv."ContentTypeFieldId", "zuluvalue" as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- Tshivenda name
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", 'e3adeb4f-d4ff-4daf-9e4a-9195181ee412'::uuid as "LocaleId", cv2."ContentTypeFieldId", "tshivendaname" as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- Tshivenda value
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", 'e3adeb4f-d4ff-4daf-9e4a-9195181ee412'::uuid as "LocaleId", cv."ContentTypeFieldId", "tshivendavalue" as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- Sesotho name
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '0b86af94-d341-435a-b944-7a8c874c385a'::uuid as "LocaleId", cv2."ContentTypeFieldId", sesothoname as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- Sesotho value
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '0b86af94-d341-435a-b944-7a8c874c385a'::uuid as "LocaleId", cv."ContentTypeFieldId", sesothovalue as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"


-- siSwati name
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '8de7442b-4c2e-4bc9-8b0f-0a2b3aa27f46'::uuid as "LocaleId", cv2."ContentTypeFieldId", siswatiname as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- siSwati value
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '8de7442b-4c2e-4bc9-8b0f-0a2b3aa27f46'::uuid as "LocaleId", cv."ContentTypeFieldId", siswativalue as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- Xitsonga name
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", 'b603d6d0-8b50-47ec-af3c-c6a2a078e56b'::uuid as "LocaleId", cv2."ContentTypeFieldId", xitsonganame as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"


-- Xitsonga value
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", 'b603d6d0-8b50-47ec-af3c-c6a2a078e56b'::uuid as "LocaleId", cv."ContentTypeFieldId", xitsongavalue as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- isiXhosa name
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '03fff220-106f-4ff7-9e06-20c4ec439483'::uuid as "LocaleId", cv2."ContentTypeFieldId", xhosaname as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- isiXhosa value
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '03fff220-106f-4ff7-9e06-20c4ec439483'::uuid as "LocaleId", cv."ContentTypeFieldId", xhosavalue as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- isiNdebele name
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '9ff6d6ff-4d77-4642-a6c8-9c3d06a40058'::uuid as "LocaleId", cv2."ContentTypeFieldId", ndebelename as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"


-- isiNdebele value
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", '9ff6d6ff-4d77-4642-a6c8-9c3d06a40058'::uuid as "LocaleId", cv."ContentTypeFieldId", ndebelevalue as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- Setswana name
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", 'c45fda51-e967-4414-8916-c39895aeb080'::uuid as "LocaleId", cv2."ContentTypeFieldId", setswananame as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"

-- Setswana value
insert into "ContentValue" ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "InsertedDate", "UpdatedDate")
select distinct cv."ContentId", 'c45fda51-e967-4414-8916-c39895aeb080'::uuid as "LocaleId", cv."ContentTypeFieldId", setswanavalue as "Value", current_date as "InsertedDate", current_date as "UpdatedDate"
from "CMSImportLanguages" c
inner join "ContentValue" cv on cv."Value" = c."englishvalue" and cv."LocaleId" ='9688cd08-adef-408c-9d34-5d75ae5c44df'
inner join "ContentValue" cv2 on cv2."ContentId" = cv."ContentId" and c."englishname" = cv2."Value" 
where c.rownr != 66
order by cv."ContentId"
*/