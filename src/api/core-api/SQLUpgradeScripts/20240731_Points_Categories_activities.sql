INSERT INTO "PointsCategory" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","Name") VALUES
	 ('267fee22-e632-4778-82fa-3e0884867b02'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Training'),
	 ('e1a1b5ba-a12b-4ac2-9f75-338c5336817d'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Statements'),
	 ('820ca93f-ad7c-4ad8-8019-f9762a8713db'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Programmes'),
	 ('5b8c9a93-90da-4390-8005-a9c1db4f4be8'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Schools'),
	 ('e6db6b50-ce14-405d-a765-eccebdb81c41'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Community'),
	 ('dc7ebc7d-e6c8-4c49-ab5d-900664bb1736'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Progress');


INSERT INTO "PointsActivity" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","PointsCategoryId","Name","Points","MaxPointsIndividualMonthly","MaxPointsIndividualYearly") VALUES
	 ('d0f30701-24c6-4a92-ab23-7db49edb9452'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'820ca93f-ad7c-4ad8-8019-f9762a8713db'::uuid,'Classroom days planned',5,0,0),
	 ('1f0e6a37-62f8-4f1b-af82-4b3311c895c6'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'5b8c9a93-90da-4390-8005-a9c1db4f4be8'::uuid,'Classes added',20,0,0),
	 ('ecff0efb-441d-4075-8ca4-82c0545d64e0'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'5b8c9a93-90da-4390-8005-a9c1db4f4be8'::uuid,'Children removed from preschool',5,0,25),
	 ('a012de24-582e-4631-9612-c847c9d166b1'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'5b8c9a93-90da-4390-8005-a9c1db4f4be8'::uuid,'Children registered',10,0,50),
	 ('af31301f-2791-438f-8341-d605af9b4616'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'5b8c9a93-90da-4390-8005-a9c1db4f4be8'::uuid,'Attendance registers saved',5,100,1200),
	 ('8a6f8457-3cda-4b3f-b32a-0d2e3694069e'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'e1a1b5ba-a12b-4ac2-9f75-338c5336817d'::uuid,'Income statements downloaded',50,50,600),
	 ('1be2ffb2-b119-4c9c-9991-6ec4e9686db8'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'e1a1b5ba-a12b-4ac2-9f75-338c5336817d'::uuid,'Income/expenses added',5,25,2500),
	 ('9bf3b569-7518-47a2-9219-38d4040f2c72'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'5b8c9a93-90da-4390-8005-a9c1db4f4be8'::uuid,'Practitioners added',20,0,0),
	 ('b16ca985-7b54-4968-9e43-d08e301f438b'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'820ca93f-ad7c-4ad8-8019-f9762a8713db'::uuid,'Themes planned',100,100,1200),
	 ('959dbdce-6264-4bef-9d47-5d75e284162c'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'dc7ebc7d-e6c8-4c49-ab5d-900664bb1736'::uuid,'Caregiver progress observations completed',5,10,50);
INSERT INTO "PointsActivity" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","PointsCategoryId","Name","Points","MaxPointsIndividualMonthly","MaxPointsIndividualYearly") VALUES
	 ('a320a46f-3e00-4a8e-b7c7-f09629ed5d07'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'dc7ebc7d-e6c8-4c49-ab5d-900664bb1736'::uuid,'Progress summaries downloaded',5,0,10),
	 ('06edbd89-60ca-409d-a65d-a8fc6283cc53'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'e6db6b50-ce14-405d-a765-eccebdb81c41'::uuid,'Short description added in community',10,0,0),
	 ('affdd04f-85bc-4bb3-b123-e9a80bcbd56e'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'e6db6b50-ce14-405d-a765-eccebdb81c41'::uuid,'Community profile complete',50,0,0),
	 ('87da9e98-c977-4a72-9da0-9e3df7932c4b'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'e6db6b50-ce14-405d-a765-eccebdb81c41'::uuid,'New connections in community',5,10,120),
	 ('a6090402-766c-4298-a47d-3f4329276ca1'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'267fee22-e632-4778-82fa-3e0884867b02'::uuid,'Training courses completed',5,0,10),
	 ('0ae80716-6355-432f-8680-5df42c6ea677'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'dc7ebc7d-e6c8-4c49-ab5d-900664bb1736'::uuid,'Progress reports created',5,0,50),
	 ('913871dd-0199-427e-8158-d1453bbbd568'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'e1a1b5ba-a12b-4ac2-9f75-338c5336817d'::uuid,'Caregiver preschool fees tracked',50,0,0);

delete from "PointsUserSummary" WHERE "PointsActivityId" IN (select "Id" from "PointsActivity" WHERE "PointsCategoryId" in (
'8d6655da-3e2d-4c32-af67-5f6777ffdf0f',
'8307b244-2aa7-4dde-9db0-46b0a118fb20',
'518a0610-fae0-48fc-bf97-5ba7b1c8636d',
'187df06f-0218-4f45-bc33-c04a5f844008',
'd37dd44d-143a-4a48-91d1-4765a2df8d29',
'8172390a-83d6-43d5-ac6c-bd350edf71fc',
'e8ad3a50-c9fe-4c02-8fe8-271320886586',
'2f69d79f-948a-4703-bf08-2ea546323eaf',
'9f8d3607-dae2-4e6c-ac40-189435963740',
'db23970c-ee2b-459e-9d54-d090ec5fced1',
'fcef8716-4f76-4143-9b2a-f99dbac10e05',
'26d07e91-4f7b-409e-b302-bce09dd6d67d',
'b8c771e3-2283-426f-beb9-c6878b64c33a',
'4cd64b45-6cf0-441e-acfe-e7c1525cd843',
'5f8fd37a-d2f5-44bc-9670-0513a47b88e5'
));
delete from "PointsClinicSummary" where "PointsCategoryId" in (
'8d6655da-3e2d-4c32-af67-5f6777ffdf0f',
'8307b244-2aa7-4dde-9db0-46b0a118fb20',
'518a0610-fae0-48fc-bf97-5ba7b1c8636d',
'187df06f-0218-4f45-bc33-c04a5f844008',
'd37dd44d-143a-4a48-91d1-4765a2df8d29',
'8172390a-83d6-43d5-ac6c-bd350edf71fc',
'e8ad3a50-c9fe-4c02-8fe8-271320886586',
'2f69d79f-948a-4703-bf08-2ea546323eaf',
'9f8d3607-dae2-4e6c-ac40-189435963740',
'db23970c-ee2b-459e-9d54-d090ec5fced1',
'fcef8716-4f76-4143-9b2a-f99dbac10e05',
'26d07e91-4f7b-409e-b302-bce09dd6d67d',
'b8c771e3-2283-426f-beb9-c6878b64c33a',
'4cd64b45-6cf0-441e-acfe-e7c1525cd843',
'5f8fd37a-d2f5-44bc-9670-0513a47b88e5');

delete from "PointsActivity" WHERE "PointsCategoryId" in (
'8d6655da-3e2d-4c32-af67-5f6777ffdf0f',
'8307b244-2aa7-4dde-9db0-46b0a118fb20',
'518a0610-fae0-48fc-bf97-5ba7b1c8636d',
'187df06f-0218-4f45-bc33-c04a5f844008',
'd37dd44d-143a-4a48-91d1-4765a2df8d29',
'8172390a-83d6-43d5-ac6c-bd350edf71fc',
'e8ad3a50-c9fe-4c02-8fe8-271320886586',
'2f69d79f-948a-4703-bf08-2ea546323eaf',
'9f8d3607-dae2-4e6c-ac40-189435963740',
'db23970c-ee2b-459e-9d54-d090ec5fced1',
'fcef8716-4f76-4143-9b2a-f99dbac10e05',
'26d07e91-4f7b-409e-b302-bce09dd6d67d',
'b8c771e3-2283-426f-beb9-c6878b64c33a',
'4cd64b45-6cf0-441e-acfe-e7c1525cd843',
'5f8fd37a-d2f5-44bc-9670-0513a47b88e5'
);
delete from "PointsCategory" WHERE "Id" in (
'8d6655da-3e2d-4c32-af67-5f6777ffdf0f',
'8307b244-2aa7-4dde-9db0-46b0a118fb20',
'518a0610-fae0-48fc-bf97-5ba7b1c8636d',
'187df06f-0218-4f45-bc33-c04a5f844008',
'd37dd44d-143a-4a48-91d1-4765a2df8d29',
'8172390a-83d6-43d5-ac6c-bd350edf71fc',
'e8ad3a50-c9fe-4c02-8fe8-271320886586',
'2f69d79f-948a-4703-bf08-2ea546323eaf',
'9f8d3607-dae2-4e6c-ac40-189435963740',
'db23970c-ee2b-459e-9d54-d090ec5fced1',
'fcef8716-4f76-4143-9b2a-f99dbac10e05',
'26d07e91-4f7b-409e-b302-bce09dd6d67d',
'b8c771e3-2283-426f-beb9-c6878b64c33a',
'4cd64b45-6cf0-441e-acfe-e7c1525cd843',
'5f8fd37a-d2f5-44bc-9670-0513a47b88e5'
);