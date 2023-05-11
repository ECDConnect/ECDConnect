do $$
begin
	-- #0 Fix the Tables we're going to insert into
	perform (select SETVAL('public."ContentTypeField_Id_seq"', COALESCE(MAX("Id"), 0)) FROM public."ContentTypeField");
	perform (select SETVAL('public."ContentType_Id_seq"', COALESCE(MAX("Id"), 0)) FROM public."ContentType");
	perform (select SETVAL('public."Content_Id_seq"', COALESCE(MAX("Id"), 0)) FROM public."Content");

	commit;
end $$ LANGUAGE plpgsql;
