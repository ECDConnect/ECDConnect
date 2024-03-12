INSERT INTO public."Navigation"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Sequence", "Name", "Icon", "Route", "Description", "TenantId")
VALUES('d4ee8669-9993-4bf0-9b8f-e0028297add3', true, current_timestamp, current_timestamp, '', 3, 'Clinics', 'HeartIcon', '/clinics', 'Clinics', '39077d0e-e443-4076-aaf2-978dc6805aa0');

update "Navigation" set "Sequence" = 4 where "Id" = 'd5265e99-3ce1-4c44-accf-1a976940dd82';
update "Navigation" set "Sequence" = 5 where "Id" = '2da41c62-f754-43de-9e16-ceb789321caa';
update "Navigation" set "Sequence" = 6 where "Id" = 'e891cabd-a254-43e4-bc04-c69fd895843c';
update "Navigation" set "Sequence" = 7 where "Id" = '9f2bae62-fb92-42b9-a67b-bac7589f305f';
update "Navigation" set "Sequence" = 8 where "Id" = 'dda6a0ae-197b-4674-8ff5-c8d05e770de3';
update "Navigation" set "Sequence" = 9 where "Id" = '981d0ec0-ea6d-4b87-857f-02cd0e80fe6d';
update "Navigation" set "Sequence" = 10 where "Id" = '1620a32f-6dc2-45ed-bc7c-83d5f511b197';