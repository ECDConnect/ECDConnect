insert into "Content" 
select nextval('public."Content_Id_seq"'), 25, true, transaction_timestamp(), transaction_timestamp(), null, '258a15e6-3736-45ea-875c-48d9377de4c8';
insert into "ContentValue"
select 767, '9688cd08-adef-408c-9d34-5d75ae5c44df', 371, 'Coaching Circle', null, null, nextval('public."ContentValue_Id_seq"');
insert into "ContentValue"
select 767, '9688cd08-adef-408c-9d34-5d75ae5c44df', 372, '#66D0EC', null, null, nextval('public."ContentValue_Id_seq"');