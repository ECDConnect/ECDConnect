insert into "Content" 
select 783, 25, true, transaction_timestamp(), transaction_timestamp(), null, '258a15e6-3736-45ea-875c-48d9377de4c8';
insert into "ContentValue"
select 783, '9688cd08-adef-408c-9d34-5d75ae5c44df', 371, 'Club monthly meeting', null, null, nextval('public."ContentValue_Id_seq"');
insert into "ContentValue"
select 783, '9688cd08-adef-408c-9d34-5d75ae5c44df', 372, '#66D0EC', null, null, nextval('public."ContentValue_Id_seq"');