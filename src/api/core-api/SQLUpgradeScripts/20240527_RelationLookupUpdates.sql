
INSERT INTO public."Relation"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Description", "TenantId")
VALUES('bfd58127-67f5-476e-8e5e-94dd070f3918', true, Current_date, Current_date, null, 'Aunt/Uncle', null);

INSERT INTO public."Relation"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Description", "TenantId")
VALUES('742bbf23-30b4-4eb8-9aed-08bd2d36fe81', true, Current_date, Current_date, null, 'Other', null);

UPDATE public."Relation"
set "IsActive" = false
where "Description" not in (
'Mother',
'Father',
'Grandparent',
'Guardian',
'Aunt/Uncle',
'Other'
);