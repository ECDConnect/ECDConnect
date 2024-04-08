
ALTER TABLE public."VisitBackReferral" add "AdminComment" text null;

INSERT INTO public."Navigation"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Sequence", "Name", "Icon", "Route", "Description", "TenantId")
VALUES('96ff204f-af08-423b-9a27-d4e31b1c7433'::uuid, true, '2024-04-05 00:00:00.000', '2024-04-05 00:00:00.000', NULL, 4, 'Referrals', 'ClipboardListIcon', '/referrals', 'Referrals', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid);