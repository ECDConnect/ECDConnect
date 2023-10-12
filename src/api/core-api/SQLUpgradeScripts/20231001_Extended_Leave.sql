ALTER TABLE public."Absentees" ADD "AbsentDateEnd" timestamp NULL;

INSERT INTO public."AbsenceReason" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Description","TenantId") VALUES
	 ('9393d7a8-ceca-006a-1c80-49928a6dc8c1',true,NOW(),NOW(),'','Sick day','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('e4528989-5b91-e7bd-559b-49600c6eae27',true,NOW(),NOW(),'','Clinic appointment','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('a83d114c-6116-05b3-f144-39e114544b10',true,NOW(),NOW(),'','Attending training','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('340d1849-d742-de87-46a7-f530d92c05c0',true,NOW(),NOW(),'','Funeral at home','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('2bfc97ad-ea26-0d58-8db4-a86daeb8f3d1',true,NOW(),NOW(),'','Family commitments','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('e8a70e19-e644-433a-6774-eb97b3424936',true,NOW(),NOW(),'','No reason given','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('7c956074-11e5-33fb-25fc-cb8f486314f4',true,NOW(),NOW(),'','Other','258a15e6-3736-45ea-875c-48d9377de4c8');
