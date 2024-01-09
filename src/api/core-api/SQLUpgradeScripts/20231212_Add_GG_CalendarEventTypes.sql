update "ContentType" set "TenantId" = null where "Id" = 25;

select max("Id") from "Content";
alter sequence "Content_Id_seq" restart with 787;
select last_value from "Content_Id_seq";
select nextval('public."Content_Id_seq"');

-- Home visit
insert into "Content" 
select 787, 25, true, transaction_timestamp(), transaction_timestamp(), null, '39077d0e-e443-4076-aaf2-978dc6805aa0';
insert into "ContentValue"
select 787, '9688cd08-adef-408c-9d34-5d75ae5c44df', 371, 'Home visit', null, null, nextval('public."ContentValue_Id_seq"');
insert into "ContentValue"
select 787, '9688cd08-adef-408c-9d34-5d75ae5c44df', 372, '#F8B07C', null, null, nextval('public."ContentValue_Id_seq"');
-- Breastfeeding club
insert into "Content" 
select 788, 25, true, transaction_timestamp(), transaction_timestamp(), null, '39077d0e-e443-4076-aaf2-978dc6805aa0';
insert into "ContentValue"
select 788, '9688cd08-adef-408c-9d34-5d75ae5c44df', 371, 'Breastfeeding club', null, null, nextval('public."ContentValue_Id_seq"');
insert into "ContentValue"
select 788, '9688cd08-adef-408c-9d34-5d75ae5c44df', 372, '#A8DEDF', null, null, nextval('public."ContentValue_Id_seq"');
-- Other
insert into "Content" 
select 789, 25, true, transaction_timestamp(), transaction_timestamp(), null, '39077d0e-e443-4076-aaf2-978dc6805aa0';
insert into "ContentValue"
select 789, '9688cd08-adef-408c-9d34-5d75ae5c44df', 371, 'Other', null, null, nextval('public."ContentValue_Id_seq"');
insert into "ContentValue"
select 789, '9688cd08-adef-408c-9d34-5d75ae5c44df', 372, '#EBF3FF', null, null, nextval('public."ContentValue_Id_seq"');

select max("Id") from "Content";
alter sequence "Content_Id_seq" restart with 790; -- make one more than max(id)


select * from "Content" where "Id" in (787,788,789);
select * from "ContentValue" cv where "ContentId" in (787,788,789);