
--BEFORE RUNNING BELOW, NEED TO ADD ALL APPLICABLE TENANT IDS
--FormPage
INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),6, 'isScored', 1, true, '', 41, current_date, current_date, NULL, NULL, 'Is scored', true, true, true);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),7, 'isScoreResult', 1, true, '', 41, current_date, current_date, NULL, NULL, 'Show score result', true, true, true);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),8, 'canSkip', 1, true, '', 41, current_date, current_date, NULL, NULL, 'Can skip step', true, true, true);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),9, 'multiAnswers', 1, true, '', 41, current_date, current_date, NULL, NULL, 'Has multiple answer sets', true, true, true);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'),10, 'info', 1, true, '', 41, current_date, current_date, NULL, NULL, 'Info page', true, true, true);

INSERT INTO public."ContentTypeField"
("Id","FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES(nextval('public."ContentTypeField_Id_seq"'), 6, 'minValue', 1, true, '', 42, current_date, current_date, NULL, NULL, 'Minimum value', true, true, true);

--FormQuestion: DATA INSERTS
DO $$
DECLARE
    tenant_ids TEXT[] := ARRAY[
        '258a15e6-3736-45ea-875c-48d9377de4c8',
        'e8f571eb-1972-4e71-a20f-347c65d059bb'
    ];
    tenant_id TEXT;

    step_1 TEXT[] := ARRAY[
    'The venue has enough clean, safe water for children to drink.',
    'The venue has a safe, clean and hygienic place for children to go to the toilet.',
    'There is a tap, a tippy-tap, a water dispenser or similar for handwashing under clean running water with measures that allow for physical distancing as appropriate.',
    'Medicines and harmful substances are out of reach of children.',
    'Children cannot reach matches, lighters or paraffin.',
    'Children cannot reach or step on sharp objects or other dangerous objects.',
    'Children cannot reach hot cooker plates or pans on the cooker.'
    ];

    step_2 TEXT[] := ARRAY[
    'There is no open water (where children could fall and drown).',
    'There are no exposed electrical wires or electric sockets that children can reach.',
    'There is no smoking or open fires in the venue.',
    'There are no heights or steps from which children could fall.',
    'No dangerous animals can approach the venue.',
    'If children use an outdoor area, it is clean, with no litter or animal faeces.',
    'The venue is in an area that is known as a safe place in the community.',
    'There is at minimum a bucket of sand available in case of fires or the fire blanket or extinguisher.',
    'There is a basic first aid kit in case of accidents.',
    'There is an emergency plan displayed on the wall.'
    ];

    step_3 TEXT[] := ARRAY[
       'The venue offers children enough space to play freely (about one square metre per child).',
       'If children use an outdoor area, it is fenced with a lockable gate.',
       'There is a list of emergency numbers visible on the wall.',
       'The venue has good natural ventilation (windows or doors that can open).',
       'The programme does not exceed the maximum child number per programme type.'
    ];

    step_4 TEXT[] := ARRAY['Notes or next steps'];
    step_5_A TEXT[] := ARRAY['How many cms is the short side of the room?', 'How many cms is the long side of the room?'];
    step_5_B TEXT[] := ARRAY['How many assistants support this class?'];
    step_6 TEXT[] := ARRAY['Where is the preschool located?'];

    new_content_id INT;
    locale_id TEXT := '9688cd08-adef-408c-9d34-5d75ae5c44df';
    contentTypeId INT := (select "Id" from "ContentType" WHERE "Name" = 'FormQuestion');
    ctFieldId1 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'name' and "ContentTypeId" = contentTypeId);
    ctFieldId2 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'answerType' and "ContentTypeId" = contentTypeId);
    ctFieldId4 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'description' and "ContentTypeId" = contentTypeId);
    ctFieldId5 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'minValue' and "ContentTypeId" = contentTypeId);

    answerType1 TEXT := 'number';
    answerType2 TEXT := 'checkBox';
    answerType3 TEXT := 'text';
    answerType4 TEXT := 'Optional'; 
    answerType5 TEXT := 'map'; 
    question TEXT;


BEGIN
    FOREACH tenant_id IN ARRAY tenant_ids LOOP
        RAISE NOTICE 'tenant_id: %', tenant_id;

--         Steps 1 to 3 checkbox
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
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, answerType2, tenant_id::uuid, now(), now());
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
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, answerType3, tenant_id::uuid, now(), now()),
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, answerType4, tenant_id::uuid, now(), now());
        END LOOP;

        --Step 5 (input)
        FOREACH question IN ARRAY step_5_A LOOP
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
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, 'cms', tenant_id::uuid, now(), now()),
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId5, '99', tenant_id::uuid, now(), now());
        END LOOP;

         FOREACH question IN ARRAY step_5_B LOOP
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
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId5, '0', tenant_id::uuid, now(), now()),
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, 'Any classroom with more than 10 children must have an assistant.', tenant_id::uuid, now(), now());
        END LOOP;

--         Step 6 (text)
        FOREACH question IN ARRAY step_6 LOOP
            new_content_id := nextval('public."Content_Id_seq"');
            INSERT INTO public."Content"
                ("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
            VALUES
                (new_content_id, contentTypeId, TRUE, now(), now(), 'system', null, FALSE);

            INSERT INTO public."ContentValue"
                ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
            VALUES
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId1, question, tenant_id::uuid, now(), now()),
                 (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, answerType4, tenant_id::uuid, now(), now()),
                (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, answerType5, tenant_id::uuid, now(), now());
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

	page_1_name TEXT := 'Health, sanitation and safety';
	page_2_name TEXT := 'Structure, space and area';
	page_3_name TEXT := 'Space and emergency planning';
	page_4_name TEXT := 'Next steps';
	page_5_name TEXT := 'Calculate capacity for each classroom';
    page_6_name TEXT := 'Confirm venue address';

    page_5_info TEXT := '<h3>How to measure the classroom</h3><p>Clear the space so that it is laid out as it will be when the programme is running. Now use your measuring tape to measure it.</p>';

	page_1_description TEXT := '';
	page_2_description TEXT := '';
	page_3_description TEXT := '';
	page_4_description TEXT := '';
	page_5_description TEXT := '';
    page_6_description TEXT := '';

	page_1_step TEXT := '1';
    page_2_step TEXT := '2';
    page_3_step TEXT := '3';
	page_4_step TEXT := '4';
	page_5_step TEXT := '5';
    page_6_step TEXT := '6';

	page_1_questions TEXT;
    page_2_questions TEXT;
    page_3_questions TEXT;
	page_4_questions TEXT;
	page_5_questions TEXT;
    page_6_questions TEXT;

    questions_1 TEXT[] := ARRAY[
     'The venue has enough clean, safe water for children to drink.',
    'The venue has a safe, clean and hygienic place for children to go to the toilet.',
    'There is a tap, a tippy-tap, a water dispenser or similar for handwashing under clean running water with measures that allow for physical distancing as appropriate.',
    'Medicines and harmful substances are out of reach of children.',
    'Children cannot reach matches, lighters or paraffin.',
    'Children cannot reach or step on sharp objects or other dangerous objects.',
    'Children cannot reach hot cooker plates or pans on the cooker.'
    ];

    questions_2 TEXT[] := ARRAY[
   'There is no open water (where children could fall and drown).',
    'There are no exposed electrical wires or electric sockets that children can reach.',
    'There is no smoking or open fires in the venue.',
    'There are no heights or steps from which children could fall.',
    'No dangerous animals can approach the venue.',
    'If children use an outdoor area, it is clean, with no litter or animal faeces.',
    'The venue is in an area that is known as a safe place in the community.',
    'There is at minimum a bucket of sand available in case of fires or the fire blanket or extinguisher.',
    'There is a basic first aid kit in case of accidents.',
    'There is an emergency plan displayed on the wall.'
    ];

    questions_3 TEXT[] := ARRAY[
        'The venue offers children enough space to play freely (about one square metre per child).',
       'If children use an outdoor area, it is fenced with a lockable gate.',
       'There is a list of emergency numbers visible on the wall.',
       'The venue has good natural ventilation (windows or doors that can open).',
       'The programme does not exceed the maximum child number per programme type.'
    ];

    questions_4 TEXT[] := ARRAY['Notes or next steps'];
    questions_5 TEXT[] := ARRAY['How many cms is the short side of the room?',
    'How many cms is the long side of the room?', 'How many assistants support this class?'];
    questions_6 TEXT[] := ARRAY['Where is the preschool located?'];

    new_content_id INT;
    locale_id TEXT := '9688cd08-adef-408c-9d34-5d75ae5c44df';
    contentTypeId INT := (select "Id" from "ContentType" WHERE "Name" = 'FormPage');
    ctFieldId1 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'name' and "ContentTypeId" = contentTypeId);
    ctFieldId2 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'description' and "ContentTypeId" = contentTypeId);
    ctFieldId3 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'stepNr' and "ContentTypeId" = contentTypeId);
    ctFieldId4 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'formQuestions' and "ContentTypeId" = contentTypeId);

    ctFieldId5 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'isScored' and "ContentTypeId" = contentTypeId);
    ctFieldId6 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'isScoreResult' and "ContentTypeId" = contentTypeId);
    ctFieldId7 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'canSkip' and "ContentTypeId" = contentTypeId);
    ctFieldId8 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'multiAnswers' and "ContentTypeId" = contentTypeId);
    ctFieldId9 INT := (select "Id" from "ContentTypeField" WHERE "FieldName" = 'info' and "ContentTypeId" = contentTypeId);


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
			(nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, page_1_questions, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId5, 'true', tenant_id::uuid, now(), now());
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
			(nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, page_2_questions, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId5, 'true', tenant_id::uuid, now(), now());
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
			(nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, page_3_questions, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId5, 'true', tenant_id::uuid, now(), now());
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
			(nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, page_4_questions, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId7, 'true', tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId6, 'true', tenant_id::uuid, now(), now());
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
			(nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, page_5_questions, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId7, 'true', tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId8, 'Add classroom', tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId9, page_5_info, tenant_id::uuid, now(), now());
		---------
		new_content_id := nextval('public."Content_Id_seq"');
		page_6_questions := (
					    SELECT string_agg("ContentId"::text, ',')
					    FROM (
					        SELECT DISTINCT "ContentId"
					        FROM "ContentValue" cv
					        WHERE cv."Value" = ANY(questions_6)
					          AND cv."TenantId" = tenant_id::uuid
					        ORDER BY "ContentId"
					    ) sub
					);
		RAISE NOTICE 'page_6_questions: %', page_6_questions;
		INSERT INTO public."Content"
                ("Id", "ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
        VALUES
            (new_content_id, contentTypeId, TRUE, now(), now(), 'system', null, FALSE);

        INSERT INTO public."ContentValue"
            ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
        VALUES
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId1, page_6_name, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId2, page_6_description, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId3, page_6_step, tenant_id::uuid, now(), now()),
			(nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId4, page_6_questions, tenant_id::uuid, now(), now()),
          	(nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId8, 'true', tenant_id::uuid, now(), now());
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

    form_name TEXT := 'Health and safety check';
    form_description TEXT := 'Use this checklist to see if the venue meets the basic standards for health and safety.';
    form_admin_description TEXT := 'The "Health and safety check" was developed by SmartStart, who have made the tool free to use for any organisation using ECD Connect. The tool is not editable, but you can choose whether or not to have it available to users on {AppName}. The checklist helps ensure that venues where ECD programmes take place meet basic health and safety standards.';
    form_provider TEXT := 'SmartStart';
    form_pdf TEXT := 'https://ecdconnectstoragesa.blob.core.windows.net/content-image/Health & Safety Checklist Preview - Principal.pdf';
    form_roleIds TEXT;
    form_pages TEXT;
    form_logo TEXT := 'https://ecdconnectstoragesa.blob.core.windows.net/content-image/638968036187153064_themeLogo.png';
    
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
    ctFieldId9 INT := (SELECT "Id" FROM "ContentTypeField" WHERE "FieldName" = 'provider' AND "ContentTypeId" = contentTypeId);
    ctFieldId10 INT := (SELECT "Id" FROM "ContentTypeField" WHERE "FieldName" = 'pdfUrl' AND "ContentTypeId" = contentTypeId);

BEGIN
    FOREACH tenant_id IN ARRAY tenant_ids LOOP    
        RAISE NOTICE 'tenant_id: %', tenant_id;

        -- Collect role IDs
        form_roleIds := (
            SELECT string_agg("Id"::text, ',')
            FROM (
                SELECT DISTINCT "Id"
                FROM "AspNetRoles"
                WHERE "Name" IN ('Principal')
                  AND "TenantId" = tenant_id::uuid
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
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId8, form_admin_description, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId9, form_provider, tenant_id::uuid, now(), now()),
            (nextval('public."ContentValue_Id_seq"'), new_content_id, locale_id::uuid, ctFieldId10, form_pdf, tenant_id::uuid, now(), now());
    END LOOP;
END $$;


-- Adding visit type record for each tenant
DO $$
DECLARE
    tenant_ids TEXT[] := ARRAY[
        '258a15e6-3736-45ea-875c-48d9377de4c8',
        'e8f571eb-1972-4e71-a20f-347c65d059bb'
    ];
    tenant_id TEXT;

    typeName TEXT := 'health_and_safety_check';
    typeNormalizedName TEXT := 'Health and Safety Check';
    typeDescription TEXT := 'Health and Safety Check';
    typeType TEXT := 'form';

    new_content_id INT;
BEGIN
    FOREACH tenant_id IN ARRAY tenant_ids LOOP

        INSERT INTO public."VisitType"
        ("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Order", "Type", "TenantId")
        VALUES(gen_random_uuid() , typeName, typeNormalizedName, typeDescription, true, current_date, current_date, '', 1, typeType, tenant_id::uuid);
        
    END LOOP;
END $$;
