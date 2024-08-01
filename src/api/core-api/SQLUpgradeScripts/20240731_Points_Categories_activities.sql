INSERT INTO "PointsCategory" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","Name") VALUES
	 ('8b5ee6ed-0ad7-4743-8d90-85e1b9cfb233'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Child attendance'),
	 ('e1b298a4-e0af-40d0-8a1f-f894994fcb87'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Child registration'),
	 ('77f86326-a350-4364-87bc-5e7a7d08647f'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Child removed'),
	 ('820ca93f-ad7c-4ad8-8019-f9762a8713db'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Theme planned'),
	 ('0ad10179-e787-4c60-92a8-9fd8de1d20c4'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'No theme planned'),
	 ('5b8c9a93-90da-4390-8005-a9c1db4f4be8'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'New practitioner'),
	 ('eae5f9ec-05f9-418d-8426-a9b19140c833'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'New class'),
	 ('b307b71b-6a85-4317-97d2-5cb9b7b1bee9'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Download income statement'),
	 ('249e4eee-702d-4f5b-9c23-faaaa2ba808b'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Adding items to statement'),
	 ('e1a1b5ba-a12b-4ac2-9f75-338c5336817d'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Preschool fees');
INSERT INTO "PointsCategory" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","Name") VALUES
	 ('ccccc4b9-b56e-4651-af4f-989d7ca344a5'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Complete child progress observations'),
	 ('dc7ebc7d-e6c8-4c49-ab5d-900664bb1736'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Create child progress report'),
	 ('97be51ff-c58c-41e8-8d36-27a140c6c339'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Download preschool or class progress summary'),
	 ('267fee22-e632-4778-82fa-3e0884867b02'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Complete an online training course'),
	 ('e6db6b50-ce14-405d-a765-eccebdb81c41'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'Community');



INSERT INTO "PointsActivity" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","PointsCategoryId","Name","Points","MaxPointsIndividualMonthly","MaxPointsIndividualYearly") VALUES
	 ('af31301f-2791-438f-8341-d605af9b4616'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'8b5ee6ed-0ad7-4743-8d90-85e1b9cfb233'::uuid,'Child attendance register saved',5,100,1200),
	 ('ecff0efb-441d-4075-8ca4-82c0545d64e0'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'77f86326-a350-4364-87bc-5e7a7d08647f'::uuid,'Child removed from the preschool',5,0,25),
	 ('d0f30701-24c6-4a92-ab23-7db49edb9452'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'0ad10179-e787-4c60-92a8-9fd8de1d20c4'::uuid,'Full "No theme" day planned - all items are chosen for the day - small group, large group, story, story activity',5,0,0),
	 ('9bf3b569-7518-47a2-9219-38d4040f2c72'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'5b8c9a93-90da-4390-8005-a9c1db4f4be8'::uuid,'Add a new practitioner to the preschool',20,0,0),
	 ('1f0e6a37-62f8-4f1b-af82-4b3311c895c6'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'eae5f9ec-05f9-418d-8426-a9b19140c833'::uuid,'Add a new class to the preschool',20,0,0),
	 ('8a6f8457-3cda-4b3f-b32a-0d2e3694069e'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'b307b71b-6a85-4317-97d2-5cb9b7b1bee9'::uuid,'Downloading an income statement for the month for the first time',50,50,600),
	 ('1be2ffb2-b119-4c9c-9991-6ec4e9686db8'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'249e4eee-702d-4f5b-9c23-faaaa2ba808b'::uuid,'Adding an expense OR income item to a statement',5,25,2500),
	 ('a012de24-582e-4631-9612-c847c9d166b1'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'e1b298a4-e0af-40d0-8a1f-f894994fcb87'::uuid,'Child registration complete',10,0,50),
	 ('b16ca985-7b54-4968-9e43-d08e301f438b'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'820ca93f-ad7c-4ad8-8019-f9762a8713db'::uuid,'Theme planned',100,100,1200),
	 ('913871dd-0199-427e-8158-d1453bbbd568'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'e1a1b5ba-a12b-4ac2-9f75-338c5336817d'::uuid,'Preschool fees greater than 0 were added for each child this month',50,0,0);
INSERT INTO "PointsActivity" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","PointsCategoryId","Name","Points","MaxPointsIndividualMonthly","MaxPointsIndividualYearly") VALUES
	 ('959dbdce-6264-4bef-9d47-5d75e284162c'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'ccccc4b9-b56e-4651-af4f-989d7ca344a5'::uuid,'Complete child progress observations',5,10,50),
	 ('0ae80716-6355-432f-8680-5df42c6ea677'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'dc7ebc7d-e6c8-4c49-ab5d-900664bb1736'::uuid,'Create a child progress report',5,0,50),
	 ('a320a46f-3e00-4a8e-b7c7-f09629ed5d07'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'97be51ff-c58c-41e8-8d36-27a140c6c339'::uuid,'Download preschool or class progress summary',5,0,10),
	 ('a6090402-766c-4298-a47d-3f4329276ca1'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'267fee22-e632-4778-82fa-3e0884867b02'::uuid,'Complete an online training course',5,0,10),
	 ('06edbd89-60ca-409d-a65d-a8fc6283cc53'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'e6db6b50-ce14-405d-a765-eccebdb81c41'::uuid,'Adding short description',10,0,0),
	 ('affdd04f-85bc-4bb3-b123-e9a80bcbd56e'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'e6db6b50-ce14-405d-a765-eccebdb81c41'::uuid,'Completing your community profile',50,0,0),
	 ('87da9e98-c977-4a72-9da0-9e3df7932c4b'::uuid,true,'2024-07-24 00:00:00.000','2024-07-24 00:00:00.000','',NULL,'e6db6b50-ce14-405d-a765-eccebdb81c41'::uuid,'Connecting with another user via the Community section',5,10,120);
