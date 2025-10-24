-- ORDER OF INSERTS ARE IMPORTANT

INSERT INTO public."ContentType"
("Id","Name", "Description", "MetaData", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(nextval('public."ContentType_Id_seq"'),'Form', 'Forms', null, true, current_date, current_date, '', null, true, '-1'::integer);
INSERT INTO public."ContentType"
("Id","Name", "Description", "MetaData", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(nextval('public."ContentType_Id_seq"'),'FormPage', 'Form Page', null, true, current_date, current_date, '', null, true, '-1'::integer);
INSERT INTO public."ContentType"
("Id","Name", "Description", "MetaData", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(nextval('public."ContentType_Id_seq"'),'FormQuestion', 'Form Questions', null, true, current_date, current_date, '', null, true, '-1'::integer);
INSERT INTO public."ContentType"
("Id","Name", "Description", "MetaData", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsVisiblePortal", "PortalDisplayOrder")
VALUES(nextval('public."ContentType_Id_seq"'),'FormQuestionOption', 'Form Question Options', null, true, current_date, current_date, '', null, true, '-1'::integer);

--BEFORE RUNNING BELOW, NEED TO CHECK 40,41,42,43 - THIS WILL BE DIFFERENT IN EACH ENVIRONMENT

--Form
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),1, 'name', 1, true, '', 40, current_date, current_date, '', null, 'Name', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),2, 'description', 1, true, '', 40, current_date, current_date, '', null, 'Description', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),3, 'roleIds', 1, true, '', 40, current_date, current_date, '', null, 'Roles', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),4, 'isPublished', 1, true, '', 40, current_date, current_date, '', null, 'Published', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),5, 'publishedDate', 1, true, '', 40, current_date, current_date, '', null, 'Date Published', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),6, 'logoUrl', 3, true, '', 40, current_date, current_date, '', null, 'Logo', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),7, 'formPages', 4, true, 'FormPage', 40, current_date, current_date, NULL, NULL, 'Pages', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),8, 'updatedDate', 1, true, '', 40, current_date, current_date, NULL, NULL, 'Last updated', true, false, false);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),9, 'adminDescription', 1, true, '', 40, current_date, current_date, '', null, 'Description', true, true, true);

--FormPage
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),1, 'name', 1, true, '', 41, current_date, current_date, '', null, 'Name', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),2, 'description', 1, true, '', 41, current_date, current_date, '', null, 'Description', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),3, 'stepNr', 1, true, '', 41, current_date, current_date, NULL, NULL, 'Step #', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),4, 'formQuestions', 4, true, 'FormQuestion', 41, current_date, current_date, NULL, NULL, 'Questions', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),5, 'updatedDate', 1, true, '', 41, current_date, current_date, NULL, NULL, 'Last updated', true, false, false);

--FormQuestion
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),1, 'name', 1, true, '', 42, current_date, current_date, '', null, 'Name', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),2, 'description', 1, true, '', 42, current_date, current_date, NULL, NULL, 'Description', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),3, 'answerType', 1, true, '', 42, current_date, current_date, '', null, 'Type', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),4, 'formQuestionOptions', 4, true, 'FormQuestionOption', 42, current_date, current_date, NULL, NULL, 'Options', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),5, 'updatedDate', 1, true, '', 42, current_date, current_date, NULL, NULL, 'Last updated', true, false, false);


--FormQuestionOption
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),1, 'name', 1, true, '', 43, current_date, current_date, '', null, 'Name', true, true, true);
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),2, 'updatedDate', 1, true, '', 43, current_date, current_date, NULL, NULL, 'Last updated', true, false, false);

--BEFORE RUNNING BELOW, NEED TO ADD ALL APPLICABLE TENANT IDS

-- FormQuestionOption: DATA INSERTS
DO $$
DECLARE
    tenant_ids TEXT[] := ARRAY[
        '258a15e6-3736-45ea-875c-48d9377de4c8',
        'e8f571eb-1972-4e71-a20f-347c65d059bb'
    ];
    tenant_id TEXT;

    form_question_options TEXT[] := ARRAY[
        'Sometimes', 'Most of the time', 'All the time', 'Greeting time',
        'Morning ring or message board', 'Teacher-directed small group activity',
        'Free play time', 'Large group time (songs, big group activities)',
        'Story time', 'Outside time', 'None'
    ];

    new_content_id INT;
    locale_id TEXT := '9688cd08-adef-408c-9d34-5d75ae5c44df';
    contentTypeId INT := (select "Id" from "ContentType" WHERE "Name" = 'FormQuestionOption');
    contentTypeFieldId INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'name' and "ContentTypeId" = contentTypeId);     
    question_option TEXT;
BEGIN
    FOREACH tenant_id IN ARRAY tenant_ids LOOP
        RAISE NOTICE 'tenant_id: %', tenant_id;

        FOREACH question_option IN ARRAY form_question_options LOOP
            new_content_id := nextval('public."Content_Id_seq"');

            INSERT INTO public."Content"
                ("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
            VALUES
                (new_content_id, contentTypeId, TRUE, current_date, current_date, '', NULL, FALSE);

            INSERT INTO public."ContentValue"
                ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
            VALUES
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, contentTypeFieldId, question_option, NULL, tenant_id::uuid, current_date, current_date);
        END LOOP;
    END LOOP;
END $$;


--FormQuestion: DATA INSERTS
DO $$
DECLARE
    tenant_ids TEXT[] := ARRAY[
        '258a15e6-3736-45ea-875c-48d9377de4c8',
        'e8f571eb-1972-4e71-a20f-347c65d059bb'
    ];
    tenant_id TEXT;

    step_1 TEXT[] := ARRAY[
        'I make sure children are supervised',
        'I make a fun & interesting space, with things on the wall',
        'I unpack toys, books and materials and put them where children can reach them',
        'I set up different interest areas with area labels (art, pretend, building, toys and games, story)',
        'I put up a daily routine that children can see',
        'I make sure children always have the chance to plan their activities before free play, and talk about it afterwards'
    ];

    step_2 TEXT[] := ARRAY[
        'I speak and act warmly and respectfully to children. I give individual attention to different children and encourage them',
        'I make sure that children who are upset are comforted',
        'I use calm methods to keep order and do not use harsh words or physical methods',
        'I involve children in solving conflicts and listen carefully to their feelings, views and suggestions'
    ];

    step_3 TEXT[] := ARRAY[
        'I talk with children throughout the programme. I encourage children to talk about what they are doing and thinking, and I listen carefully to their ideas',
        'I help to improve children''s language by telling them new words and explaining what they mean',
        'I let children make their own choices about what to play and I allow them to play and learn at their own level',
        'I give children appropriate toys and materials to play with and support them to use them when needed',
        'I join in children''s play and give support when needed. I get onto their level and share information and ask questions during play, to help children think and learn',
        'I make storytimes that are fun and full of conversation. I use questions and comments to encourage children to think'
    ];

    step_4 TEXT[] := ARRAY['Which activities do you do every day?'];
    step_5 TEXT[] := ARRAY['What are some of the things you would like to do differently or get better at'];

    new_content_id INT;
    locale_id TEXT := '9688cd08-adef-408c-9d34-5d75ae5c44df';
    contentTypeId INT := (select "Id" from "ContentType" WHERE "Name" = 'FormQuestion');
    ctFieldId1 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'name' and "ContentTypeId" = contentTypeId);
    ctFieldId2 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'answerType' and "ContentTypeId" = contentTypeId);
    ctFieldId3 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'formQuestionOptions' and "ContentTypeId" = contentTypeId);
    ctFieldId4 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'description' and "ContentTypeId" = contentTypeId);

    optionIds1 TEXT;
    optionIds2 TEXT;

    answerType1 TEXT := 'radioButton';
    answerType2 TEXT := 'checkBox';
    answerType3 TEXT := 'text';
    question TEXT;


BEGIN
    FOREACH tenant_id IN ARRAY tenant_ids LOOP
        RAISE NOTICE 'tenant_id: %', tenant_id;
	

       optionIds1 := (
					    SELECT string_agg("ContentId"::text, ',')
					    FROM (
					        SELECT DISTINCT "ContentId"
					        FROM "ContentValue" cv
					        WHERE cv."Value" IN ('Sometimes', 'Most of the time', 'All the time')
					          AND cv."TenantId" = tenant_id::uuid
					        ORDER BY "ContentId"
					    ) sub
					);
		optionIds2 := (
					    SELECT string_agg("ContentId"::text, ',')
					    FROM (
					        SELECT DISTINCT "ContentId"
					        FROM "ContentValue" cv
					        WHERE cv."Value" IN ('Greeting time','Morning ring or message board','Teacher-directed small group activity','Free play time','Large group time (songs, big group activities)','Story time','Outside time','None')
					          AND cv."TenantId" = tenant_id::uuid
					        ORDER BY "ContentId"
					    ) sub
					);


--         Steps 1 to 3 (radioButton)
        FOREACH question IN ARRAY step_1 || step_2 || step_3 LOOP
            new_content_id := nextval('public."Content_Id_seq"');

            INSERT INTO public."Content"
                ("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
            VALUES
                (new_content_id, contentTypeId, TRUE, now(), now(), 'system', null, FALSE);

            INSERT INTO public."ContentValue"
                ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
            VALUES
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId1, question, tenant_id::uuid, now(), now()),
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, answerType1, tenant_id::uuid, now(), now()),
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId3, optionIds1, tenant_id::uuid, now(), now());
        END LOOP;

--         Step 4 (checkBox)
        FOREACH question IN ARRAY step_4 LOOP
            new_content_id := nextval('public."Content_Id_seq"');
            INSERT INTO public."Content"
                ("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
            VALUES
                (new_content_id, contentTypeId, TRUE, now(), now(), 'system', null, FALSE);

            INSERT INTO public."ContentValue"
                ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
            VALUES
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId1, question, tenant_id::uuid, now(), now()),
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, answerType2, tenant_id::uuid, now(), now()),
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId3, optionIds2, tenant_id::uuid, now(), now());
        END LOOP;

--         Step 5 (text)
        FOREACH question IN ARRAY step_5 LOOP
            new_content_id := nextval('public."Content_Id_seq"');
            INSERT INTO public."Content"
                ("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
            VALUES
                (new_content_id, contentTypeId, TRUE, now(), now(), 'system', null, FALSE);

            INSERT INTO public."ContentValue"
                ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
            VALUES
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId1, question, tenant_id::uuid, now(), now()),
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, answerType3, tenant_id::uuid, now(), now()),
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId3, '', tenant_id::uuid, now(), now()),
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, 'e.g. always include recall time in my daily routine', tenant_id::uuid, now(), now());
        END LOOP;

    END LOOP;
END $$;


--FormPage: DATA INSERTS
DO $$
DECLARE
    tenant_ids TEXT[] := ARRAY[
        '258a15e6-3736-45ea-875c-48d9377de4c8',
        'e8f571eb-1972-4e71-a20f-347c65d059bb'
    ];
    tenant_id TEXT;

	page_1_name TEXT := 'Self-assessment';
	page_2_name TEXT := 'Self-assessment';
	page_3_name TEXT := 'Self-assessment';
	page_4_name TEXT := 'Self-assessment';
	page_5_name TEXT := 'Reflections';

	page_1_description TEXT := 'Read each statement and think carefully about your programme.';
	page_2_description TEXT := 'Read each statement and think carefully about your programme.';
	page_3_description TEXT := 'Read each statement and think carefully about your programme.';
	page_4_description TEXT := '';
	page_5_description TEXT := '';

	page_1_step TEXT := '1';
    page_2_step TEXT := '2';
    page_3_step TEXT := '3';
	page_4_step TEXT := '4';
	page_5_step TEXT := '5';

	page_1_questions TEXT;
    page_2_questions TEXT;
    page_3_questions TEXT;
	page_4_questions TEXT;
	page_5_questions TEXT;

    questions_1 TEXT[] := ARRAY[
        'I make sure children are supervised',
        'I make a fun & interesting space, with things on the wall',
        'I unpack toys, books and materials and put them where children can reach them',
        'I set up different interest areas with area labels (art, pretend, building, toys and games, story)',
        'I put up a daily routine that children can see',
        'I make sure children always have the chance to plan their activities before free play, and talk about it afterwards'
    ];

    questions_2 TEXT[] := ARRAY[
        'I speak and act warmly and respectfully to children. I give individual attention to different children and encourage them',
        'I make sure that children who are upset are comforted',
        'I use calm methods to keep order and do not use harsh words or physical methods',
        'I involve children in solving conflicts and listen carefully to their feelings, views and suggestions'
    ];

    questions_3 TEXT[] := ARRAY[
        'I talk with children throughout the programme. I encourage children to talk about what they are doing and thinking, and I listen carefully to their ideas',
        'I help to improve children''s language by telling them new words and explaining what they mean',
        'I let children make their own choices about what to play and I allow them to play and learn at their own level',
        'I give children appropriate toys and materials to play with and support them to use them when needed',
        'I join in children''s play and give support when needed. I get onto their level and share information and ask questions during play, to help children think and learn',
        'I make storytimes that are fun and full of conversation. I use questions and comments to encourage children to think'
    ];

    questions_4 TEXT[] := ARRAY['Which activities do you do every day?'];
    questions_5 TEXT[] := ARRAY['What are some of the things you would like to do differently or get better at'];

    new_content_id INT;
    locale_id TEXT := '9688cd08-adef-408c-9d34-5d75ae5c44df';
    contentTypeId INT := (select "Id" from "ContentType" WHERE "Name" = 'FormPage');
    ctFieldId1 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'name' and "ContentTypeId" = contentTypeId);
    ctFieldId2 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'description' and "ContentTypeId" = contentTypeId);
    ctFieldId3 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'stepNr' and "ContentTypeId" = contentTypeId);
    ctFieldId4 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'formQuestions' and "ContentTypeId" = contentTypeId);


BEGIN
    FOREACH tenant_id IN ARRAY tenant_ids LOOP	
		RAISE NOTICE 'tenant_id: %', tenant_id;

		---------
		new_content_id := nextval('public."Content_Id_seq"');
		page_1_questions := (
					    SELECT string_agg("ContentId"::text, ',')
					    FROM (
					        SELECT DISTINCT "ContentId"
					        FROM "ContentValue" cv
					        WHERE cv."Value" = ANY(questions_1)
					          AND cv."TenantId" = tenant_id::uuid
					        ORDER BY "ContentId"
					    ) sub
					);
		RAISE NOTICE 'page_1_questions: %', page_1_questions;
		

		INSERT INTO public."Content"
                ("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
        VALUES
            (new_content_id, contentTypeId, TRUE, now(), now(), 'system', null, FALSE);

        INSERT INTO public."ContentValue"
            ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
        VALUES
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId1, page_1_name, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, page_1_description, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId3, page_1_step, tenant_id::uuid, now(), now()),
			(nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, page_1_questions, tenant_id::uuid, now(), now());
		---------
		new_content_id := nextval('public."Content_Id_seq"');
		page_2_questions := (
					    SELECT string_agg("ContentId"::text, ',')
					    FROM (
					        SELECT DISTINCT "ContentId"
					        FROM "ContentValue" cv
					        WHERE cv."Value" = ANY(questions_2)
					          AND cv."TenantId" = tenant_id::uuid
					        ORDER BY "ContentId"
					    ) sub
					);
		RAISE NOTICE 'page_2_questions: %', page_2_questions;
		INSERT INTO public."Content"
                ("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
        VALUES
            (new_content_id, contentTypeId, TRUE, now(), now(), 'system', null, FALSE);

        INSERT INTO public."ContentValue"
            ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
        VALUES
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId1, page_2_name, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, page_2_description, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId3, page_2_step, tenant_id::uuid, now(), now()),
			(nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, page_2_questions, tenant_id::uuid, now(), now());
		---------
		new_content_id := nextval('public."Content_Id_seq"');
		page_3_questions := (
					    SELECT string_agg("ContentId"::text, ',')
					    FROM (
					        SELECT DISTINCT "ContentId"
					        FROM "ContentValue" cv
					        WHERE cv."Value" = ANY(questions_3)
					          AND cv."TenantId" = tenant_id::uuid
					        ORDER BY "ContentId"
					    ) sub
					);
		RAISE NOTICE 'page_3_questions: %', page_3_questions;
		INSERT INTO public."Content"
                ("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
        VALUES
            (new_content_id, contentTypeId, TRUE, now(), now(), 'system', null, FALSE);

        INSERT INTO public."ContentValue"
            ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
        VALUES
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId1, page_3_name, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, page_3_description, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId3, page_3_step, tenant_id::uuid, now(), now()),
			(nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, page_3_questions, tenant_id::uuid, now(), now());
		---------
		new_content_id := nextval('public."Content_Id_seq"');
		page_4_questions := (
					    SELECT string_agg("ContentId"::text, ',')
					    FROM (
					        SELECT DISTINCT "ContentId"
					        FROM "ContentValue" cv
					        WHERE cv."Value" = ANY(questions_4)
					          AND cv."TenantId" = tenant_id::uuid
					        ORDER BY "ContentId"
					    ) sub
					);
		RAISE NOTICE 'page_4_questions: %', page_4_questions;
		INSERT INTO public."Content"
                ("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
        VALUES
            (new_content_id, contentTypeId, TRUE, now(), now(), 'system', null, FALSE);

        INSERT INTO public."ContentValue"
            ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
        VALUES
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId1, page_4_name, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, page_4_description, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId3, page_4_step, tenant_id::uuid, now(), now()),
			(nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, page_4_questions, tenant_id::uuid, now(), now());
		---------
		new_content_id := nextval('public."Content_Id_seq"');
		page_5_questions := (
					    SELECT string_agg("ContentId"::text, ',')
					    FROM (
					        SELECT DISTINCT "ContentId"
					        FROM "ContentValue" cv
					        WHERE cv."Value" = ANY(questions_5)
					          AND cv."TenantId" = tenant_id::uuid
					        ORDER BY "ContentId"
					    ) sub
					);
		RAISE NOTICE 'page_5_questions: %', page_5_questions;
		INSERT INTO public."Content"
                ("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
        VALUES
            (new_content_id, contentTypeId, TRUE, now(), now(), 'system', null, FALSE);

        INSERT INTO public."ContentValue"
            ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
        VALUES
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId1, page_5_name, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, page_5_description, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId3, page_5_step, tenant_id::uuid, now(), now()),
			(nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, page_5_questions, tenant_id::uuid, now(), now());
		---------

    END LOOP;
END $$;

--Form: DATA INSERTS
DO $$
DECLARE
    tenant_ids TEXT[] := ARRAY[
        '258a15e6-3736-45ea-875c-48d9377de4c8',
        'e8f571eb-1972-4e71-a20f-347c65d059bb'
    ];
    tenant_id TEXT;

    form_name TEXT := 'Self-assessment (SmartStart)';
    form_description TEXT := 'This form will help you think about which parts of your programme you are doing well and if there are any areas that need to get better';
    form_admin_description TEXT := 'The "Self-assessment" form was developed by SmartStart, who have made the tool free to use for any organisation using ECD Connect.  The tool is not editable, but you can choose whether or not to have it available to users on {AppName}.  The self-assessment form helps practitioners to identify programme highlights & areas for improvement.';
    form_logo TEXT := 'https://ecdconnectstoragedev.blob.core.windows.net/content-image/638968036187153064_themeLogo.png';
    form_roleIds TEXT;
    form_pages TEXT;
    
    new_content_id INT;
    locale_id TEXT := '9688cd08-adef-408c-9d34-5d75ae5c44df';
    contentTypeId INT := (SELECT "Id" FROM "ContentType" WHERE "Name" = 'Form');
    ctFieldId1 INT := (SELECT "Id" FROM "ContentTypeField" WHERE "FieldName" = 'name' AND "ContentTypeId" = contentTypeId);
    ctFieldId2 INT := (SELECT "Id" FROM "ContentTypeField" WHERE "FieldName" = 'description' AND "ContentTypeId" = contentTypeId);
    ctFieldId3 INT := (SELECT "Id" FROM "ContentTypeField" WHERE "FieldName" = 'roleIds' AND "ContentTypeId" = contentTypeId);
    ctFieldId4 INT := (SELECT "Id" FROM "ContentTypeField" WHERE "FieldName" = 'isPublished' AND "ContentTypeId" = contentTypeId);
    ctFieldId5 INT := (SELECT "Id" FROM "ContentTypeField" WHERE "FieldName" = 'publishedDate' AND "ContentTypeId" = contentTypeId);
    ctFieldId6 INT := (SELECT "Id" FROM "ContentTypeField" WHERE "FieldName" = 'formPages' AND "ContentTypeId" = contentTypeId);
    ctFieldId7 INT := (SELECT "Id" FROM "ContentTypeField" WHERE "FieldName" = 'logoUrl' AND "ContentTypeId" = contentTypeId);
    ctFieldId8 INT := (SELECT "Id" FROM "ContentTypeField" WHERE "FieldName" = 'adminDescription' AND "ContentTypeId" = contentTypeId);

BEGIN

    FOREACH tenant_id IN ARRAY tenant_ids LOOP    
        RAISE NOTICE 'tenant_id: %', tenant_id;

        -- Collect role IDs
        form_roleIds := (
            SELECT string_agg("Id"::text, ',')
            FROM (
                SELECT DISTINCT "Id"
                FROM "AspNetRoles" anr
                WHERE anr."Name" IN ('Practitioner', 'Principal')
                  AND anr."TenantId" = tenant_id::uuid
                ORDER BY "Id"
            ) sub
        );
        RAISE NOTICE 'form_roleIds: %', form_roleIds;

        -- Collect form page content IDs
        form_pages := (
            SELECT string_agg("ContentId"::text, ',')
            FROM (
                SELECT DISTINCT cv."ContentId"
                FROM "ContentValue" cv
                INNER JOIN "Content" c ON c."Id" = cv."ContentId"
                WHERE c."ContentTypeId" = 41
                  AND cv."TenantId" = tenant_id::uuid
                ORDER BY "ContentId"
            ) sub
        );
        RAISE NOTICE 'form_pages: %', form_pages;

        -- Create new Content entry
        new_content_id := nextval('public."Content_Id_seq"');

        INSERT INTO public."Content"
            ("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
        VALUES
            (new_content_id, contentTypeId, TRUE, now(), now(), 'system', NULL, FALSE);

        -- Insert ContentValue records
        INSERT INTO public."ContentValue"
            ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
        VALUES
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId1, form_name, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, form_description, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId3, form_roleIds, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, 'false', tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId5, '', tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId6, form_pages, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId7, form_logo, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId8, form_admin_description, tenant_id::uuid, now(), now());

    END LOOP;
END $$;