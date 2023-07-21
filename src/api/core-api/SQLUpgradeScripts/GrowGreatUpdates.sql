alter table public."Visit" add "DueDate" timestamp null;

/* This is for missing visit types
INSERT INTO public."VisitType" ("Id","Name","NormalizedName","Description","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Order","Type","TenantId") VALUES
	 ('7ec10b7c-917b-11ed-a1eb-0242ac120002','day_3','Day 3','Day 3',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',1,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec10c8a-917b-11ed-a1eb-0242ac120002','day_7','Day 7','Day 7',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',2,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec10e42-917b-11ed-a1eb-0242ac120002','week_2','Week 2','Week 2',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',3,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec10f5a-917b-11ed-a1eb-0242ac120002','week_4','Week 4','Week 4',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',4,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec11374-917b-11ed-a1eb-0242ac120002','week_7_to_8','Week 7 to 8','Week 7 to 8',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',5,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec102e4-917b-11ed-a1eb-0242ac120002','visit_1','Visit 1','First visit',true,'2023-01-11 09:47:02.002','2023-01-11 09:47:02.002','',1,'mother','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec10564-917b-11ed-a1eb-0242ac120002','visit_2','Visit 2','Second visit',true,'2023-01-11 09:47:02.002','2023-01-11 09:47:02.002','',2,'mother','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec1083e-917b-11ed-a1eb-0242ac120002','visit_3','Visit 3','Third visit',true,'2023-01-11 09:47:02.002','2023-01-11 09:47:02.002','',3,'mother','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec10960-917b-11ed-a1eb-0242ac120002','visit_4','Visit 4','Fourth visit',true,'2023-01-11 09:47:02.002','2023-01-11 09:47:02.002','',4,'mother','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec10a6e-917b-11ed-a1eb-0242ac120002','additional_visits','Additional visits','Additional visits',true,'2023-01-11 09:47:02.002','2023-01-11 09:47:02.002','',5,'mother','39077d0e-e443-4076-aaf2-978dc6805aa0');
INSERT INTO public."VisitType" ("Id","Name","NormalizedName","Description","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Order","Type","TenantId") VALUES
	 ('1b6513aa-9187-11ed-a1eb-0242ac120002','additional_visits','Additional visits','Additional visits',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',17,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('9bc23b31-7962-434a-96b9-009b7f094354','5_years','5 Years','5 Years',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',16,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec114aa-917b-11ed-a1eb-0242ac120002','3_months','3 month','3 Months',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',6,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec115b8-917b-11ed-a1eb-0242ac120002','4_months','4 month','4 Months',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',7,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec116d0-917b-11ed-a1eb-0242ac120002','5_months','5 month','5 Months',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',8,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec11810-917b-11ed-a1eb-0242ac120002','6_months','6 month','6 Months',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',9,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec11928-917b-11ed-a1eb-0242ac120002','9_months','9 month','9 Months',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',10,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('7ec11a36-917b-11ed-a1eb-0242ac120002','12_months','12 month','12 Months',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',11,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('1b65078e-9187-11ed-a1eb-0242ac120002','15_months','15 month','15 Months',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',12,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('1b651026-9187-11ed-a1eb-0242ac120002','18_months','18 month','18 Months',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',13,'child','39077d0e-e443-4076-aaf2-978dc6805aa0');
INSERT INTO public."VisitType" ("Id","Name","NormalizedName","Description","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Order","Type","TenantId") VALUES
	 ('1b651166-9187-11ed-a1eb-0242ac120002','21_months','21 month','21 Months',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',14,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('1b65127e-9187-11ed-a1eb-0242ac120002','24_months','24 month','24 Months',true,'2023-01-11 09:57:21.105','2023-01-11 09:57:21.105','',15,'child','39077d0e-e443-4076-aaf2-978dc6805aa0'),
	 ('f51ce0c1-6b3e-48d6-b317-657a36f77b18','support_visit','Support Visit','Support Visit',true,'2023-05-09 11:04:35.446021','2023-05-09 11:04:35.446021',NULL,3,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('09f7545b-b531-4c12-8f50-f84d70feaa9e','pqa_visit_3','First PQA 3','First site visit',true,'2023-05-25 12:12:00.878135','2023-05-25 12:12:00.878135',NULL,7,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('cb7fb5de-b7f2-479c-a484-9862570dfcf6','support_call','Support Call','Support Call',true,'2023-05-23 08:40:30.442442','2023-05-23 08:40:30.442442',NULL,4,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('e3d9f93b-8ef2-4ba4-8a97-0d73e7c7c7cb','practitioner_visit','Practitioner Visit','Practitioner Visit',true,'2023-06-13 07:41:13.181759','2023-06-13 07:41:13.181759','',2,'coach','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('a02f67e5-fd59-4704-95c7-7933e344665d','practitioner_call','Practitioner Call','Practitioner Call',true,'2023-06-13 09:58:52.843756','2023-06-13 09:58:52.843756','',3,'coach','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('263f729e-edb1-4f49-a9ce-f9cff446c41e','re_accreditation_2','Re-accreditation 2','Re-accreditation',true,'2023-06-01 10:49:26.40436','2023-06-01 10:49:26.40436',NULL,10,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('8183ba9c-7e2a-43f6-bb17-8557867c2fa5','re_accreditation_follow_up','Re-accreditation Follow-up','Re-accreditation Follow-up',true,'2023-05-26 12:23:34.256869','2023-05-26 12:23:34.256869',NULL,12,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('793458f3-43a8-4a42-a4c1-a78323c10ab7','re_accreditation_3','Re-accreditation 3','Re-accreditation',true,'2023-06-01 10:49:26.40436','2023-06-01 10:49:26.40436',NULL,11,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."VisitType" ("Id","Name","NormalizedName","Description","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Order","Type","TenantId") VALUES
	 ('16e6b742-5642-40c7-be13-556e1b0b12e2','re_accreditation_1','Re-accreditation','Re-accreditation',true,'2023-05-24 09:37:26.708513','2023-05-24 09:37:26.708513',NULL,9,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('b9da5bc5-0a63-4809-94b1-6ad3769bb3a1','smart_space_checklist','SmartSpace Checklist','SmartSpace Checklist',true,'2023-05-29 13:57:00.749431','2023-05-29 13:57:00.749431',NULL,1,'trainee','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('6a0e984d-23ed-457d-b75a-2586056bce56','startup_support_agreement','Start-up support agreement','Start-up support agreement',true,'2023-06-01 08:11:36.363358','2023-06-01 08:11:36.363358',NULL,2,'trainee','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('79812ea0-806a-4d2c-8835-74061264af88','franchisee_agreement','Franchisee Agreement','Franchisee Agreement',true,'2023-07-21 14:51:34.281479','2023-07-21 14:51:34.281479','',4,'coach','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('ea806dac-724a-4637-9574-8ecc286a8f74','pqa_visit_1','PQA Visit 1','First site visit',true,'2023-05-15 09:41:58.550394','2023-05-15 09:41:58.550394',NULL,5,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('d411b7ab-8d3b-48d3-91d4-eced83fb835b','pqa_visit_follow_up','PQA Visit Follow-up','PQA Visit Follow-up',true,'2023-05-24 08:39:16.395247','2023-05-24 08:39:16.395247','',8,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('14596b00-801c-4225-85ae-4cb7d45c8be1','pqa_visit_2','First PQA 2','First site visit',true,'2023-05-25 12:12:00.878135','2023-05-25 12:12:00.878135',NULL,6,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('c0864f35-d618-4855-b79b-fecf437c01c4','pre_pqa_visit_1','First site visit before PQA','First site visit',true,'2023-05-09 11:04:35.446021','2023-05-09 11:04:35.446021',NULL,1,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('65bf9a44-612b-4439-a1ef-857134ebcc05','pre_pqa_visit_2','Second site visit before PQA','Second site visit',true,'2023-05-09 11:04:35.446021','2023-05-09 11:04:35.446021',NULL,2,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8'),
	 ('c6de99cd-8fa4-4a8b-ae5c-40de7da2fc73','trainee_visit','Trainee Visit','Trainee Visit',true,'2023-06-02 08:30:31.758764','2023-06-02 08:30:31.758764',NULL,1,'coach','258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."VisitType" ("Id","Name","NormalizedName","Description","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Order","Type","TenantId") VALUES
	 ('7c160e0a-390a-4601-9d9e-c0e4a127e5b2','self_assessment','Self Assessment','Self Assessment',true,'2023-06-12 14:31:19.50872','2023-06-12 14:31:19.50872','',13,'practitioner','258a15e6-3736-45ea-875c-48d9377de4c8');
*/