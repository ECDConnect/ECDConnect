do $$
begin
	-- #0 Fix the sequence index for the ContentTypeField table
	perform (select SETVAL('public."ContentTypeField_Id_seq"', COALESCE(MAX("Id"), 0)) FROM public."ContentTypeField");
	-- #1 Fix the sequence index for the ContentType table
	perform (select SETVAL('public."ContentType_Id_seq"', COALESCE(MAX("Id"), 0)) FROM public."ContentType");
	-- #2 Fix the sequence index for the Content table
	perform (select SETVAL('public."Content_Id_seq"', COALESCE(MAX("Id"), 0)) FROM public."Content");

	commit;
end $$ LANGUAGE plpgsql;
