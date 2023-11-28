INSERT INTO public."Navigation"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Sequence", "Name", "Icon", "Route", "Description", "TenantId")
VALUES('dda6a0ae-197b-4674-8ff5-c8d05e770de3', true, current_timestamp, current_timestamp, '', 7, 'Messaging', 'ChatIcon', '/messaging', 'Messaging', null);

update "Navigation" set "Sequence" = 8 where "Id" = '981d0ec0-ea6d-4b87-857f-02cd0e80fe6d';
update "Navigation" set "Sequence" = 9 where "Id" = '1620a32f-6dc2-45ed-bc7c-83d5f511b197';