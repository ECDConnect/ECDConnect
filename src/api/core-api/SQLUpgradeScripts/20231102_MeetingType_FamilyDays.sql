INSERT INTO public."MeetingType"
("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('d20f61dc-df92-4c0e-8a9c-c41d2d223817', 'open_day', 'Open Day', '', true, current_timestamp, current_timestamp, '', '258a15e6-3736-45ea-875c-48d9377de4c8');

INSERT INTO public."MeetingType"
("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('23be6c89-beb3-4af1-8874-8e6d303a2c0d', 'play_day', 'Play Day', '', true, current_timestamp, current_timestamp, '', '258a15e6-3736-45ea-875c-48d9377de4c8');

INSERT INTO public."MeetingType"
("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('461df2d6-dc4b-4d7b-b885-bbd1dbc30e87', 'story_day', 'Story Day', '', true, current_timestamp, current_timestamp, '', '258a15e6-3736-45ea-875c-48d9377de4c8');

INSERT INTO public."MeetingType"
("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('f0cb8808-17e0-4e5f-acaf-8264b8ab59b8', 'end_of_year_celebration', 'End of Year Celebration', '', true, current_timestamp, current_timestamp, '', '258a15e6-3736-45ea-875c-48d9377de4c8');

INSERT INTO public."MeetingType"
("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('52c4a51e-a255-45db-b8af-17a4ea6ea0d1', 'other', 'Other', '', true, current_timestamp, current_timestamp, '', '258a15e6-3736-45ea-875c-48d9377de4c8');

ALTER TABLE public."ClubMeeting" ADD "OtherDescription" varchar NULL;
ALTER TABLE public."ClubMeeting" ADD "TotalCaregiversAttended" int4 not null default 0;

INSERT INTO public."ClubActivityUploadType"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "Description", "EnumId", "TenantId")
VALUES('efa394f7-3ae9-4a3f-a846-c8fa9a162dcf', true, current_timestamp, current_timestamp, '', 'FamilyDays', 'Family Days', 1, '258a15e6-3736-45ea-875c-48d9377de4c8');

