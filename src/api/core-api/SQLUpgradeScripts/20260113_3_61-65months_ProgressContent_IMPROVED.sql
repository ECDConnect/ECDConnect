DO $$
DECLARE
    tenant_id public."Tenant"."Id"%TYPE;
    age_group_id text;
    name_field_id integer;
    value_field_id integer;
    age_field_id integer;
    skill_field_id integer;
    fixed_locale uuid := '9688cd08-adef-408c-9d34-5d75ae5c44df'::uuid;
    age_group_name constant text := '61-65 months (5 years)';

    questions jsonb := $q$[
        {"name": "Shares toys, crayons", "subcategory": "Social"},
        {"name": "Has a good self-image", "subcategory": "Personal & emotional"},
        {"name": "Has a lot of energy and enjoys preschool", "subcategory": "Personal & emotional"},
        {"name": "Communicates well with others", "subcategory": "Communication: speaking & listening"},
        {"name": "Participates in group activities", "subcategory": "Social"},
        {"name": "Loves to help in class", "subcategory": "Social"},
        {"name": "Has made friends easily", "subcategory": "Social"},
        {"name": "Speaks with confidence", "subcategory": "Communication: speaking & listening"},
        {"name": "Uses dominant hand with confidence", "subcategory": "Fine motor"},
        {"name": "Performs activities that uses the non-dominant side of the body", "subcategory": "Gross motor"},
        {"name": "Can identify left and right", "subcategory": "Fine motor"},
        {"name": "Shows a love for books", "subcategory": "Emergent reading & writing"},
        {"name": "Can hold a book and turn pages correctly", "subcategory": "Emergent reading & writing"},
        {"name": "Can follow a ball on a string swinging from left to right with eyes only - not moving his/ her head", "subcategory": "Fine motor"},
        {"name": "Likes to thread beads and buttons", "subcategory": "Fine motor"},
        {"name": "Easily tears paper into small pieces and crumbles a paper with one hand (left and right)", "subcategory": "Fine motor"},
        {"name": "Enjoys building and stacking blocks (plan and action)", "subcategory": "Fine motor"},
        {"name": "Uses a scissors during free cutting activities", "subcategory": "Fine motor"},
        {"name": "Can make a shape with my body", "subcategory": "Gross motor"},
        {"name": "Can jump and move under or over obstacles", "subcategory": "Gross motor"},
        {"name": "Plays eagerly with balls and ropes during outdoor play and physical education", "subcategory": "Gross motor"},
        {"name": "Can easily bounce a ball and catch the ball against his / her body or between their hands", "subcategory": "Gross motor"},
        {"name": "Can imitate sound heard - sounds around the house and school (bell, water running etc.)", "subcategory": "Communication: speaking & listening"},
        {"name": "Uses sense of smell", "subcategory": "Approaches to learning"},
        {"name": "Touches many objects and can identify rough and smooth", "subcategory": "Fine motor"},
        {"name": "Distinguishes aurally between different letter sounds especially at the beginning of own name", "subcategory": "Emergent reading & writing"},
        {"name": "Identifies similarities and differences in terms of colour, size or shape (one attribute only)", "subcategory": "Approaches to learning"},
        {"name": "Draws or paints pictures to convey messages related to a story that is told or read during creative art activities", "subcategory": "Emergent reading & writing"},
        {"name": "Listens attentively to simple questions, announcements and responds appropriately", "subcategory": "Communication: speaking & listening"},
        {"name": "Tells stories and retells stories of others in own words", "subcategory": "Communication: speaking & listening"},
        {"name": "Loves to participate in singing songs", "subcategory": "Communication: speaking & listening"},
        {"name": "When you introduce a topic, the child participates and engages in discussion", "subcategory": "Communication: speaking & listening"},
        {"name": "Exploring music, movement and voice focusing on tempo: fast and slow", "subcategory": "Approaches to learning"},
        {"name": "Identifies, names and points to parts of the body", "subcategory": "Communication: speaking & listening"},
        {"name": "Can complete an unfinished drawing of a body", "subcategory": "Approaches to learning"},
        {"name": "Locomotor: walk and run in different directions without bumping into each other, running on all fours, running around a marker", "subcategory": "Gross motor"},
        {"name": "Balance: balancing on a balancing beam / skipping rope/ masking tape, walking forwards and backwards", "subcategory": "Gross motor"},
        {"name": "Co-ordination: throwing and catching bean bags, jungle gym: climb a ladder", "subcategory": "Fine motor"},
        {"name": "Describes, sorts and compares 3D objects according to shape", "subcategory": "Number, shape, size, pattern"},
        {"name": "Able to collect and sort, draw, read and represent objects according to one attribute", "subcategory": "Number, shape, size, pattern"},
        {"name": "Orders recurring events in own daily life (e.g. Daily programme)", "subcategory": "Number, shape, size, pattern"},
        {"name": "Can say the numbers 1 through 5 in order without counting objects", "subcategory": "Number, shape, size, pattern"},
        {"name": "Knows the number symbol 1 and number name one", "subcategory": "Number, shape, size, pattern"},
        {"name": "Identifies pictures and dot cards that involve number 1", "subcategory": "Number, shape, size, pattern"},
        {"name": "Copies, extends and creates own patterns", "subcategory": "Number, shape, size, pattern"},
        {"name": "Recognises, identifies 3D objects, e.g. balls, boxes", "subcategory": "Number, shape, size, pattern"},
        {"name": "Knows on, in, out, up, down. Understands backwards, forwards, front, back", "subcategory": "Number, shape, size, pattern"}
    ]$q$;

BEGIN
    -- Get field IDs once (they should be the same across tenants)
    SELECT "Id" INTO name_field_id  FROM "ContentTypeField" WHERE "ContentTypeId" = 7 AND "FieldName" = 'name';
    SELECT "Id" INTO value_field_id FROM "ContentTypeField" WHERE "ContentTypeId" = 7 AND "FieldName" = 'value';
    SELECT "Id" INTO age_field_id   FROM "ContentTypeField" WHERE "ContentTypeId" = 7 AND "FieldName" = 'ageGroups';
    SELECT "Id" INTO skill_field_id FROM "ContentTypeField" WHERE "ContentTypeId" = 37 AND "FieldName" = 'skills';

    FOR tenant_id IN 
        SELECT DISTINCT "Id" FROM public."Tenant"
    LOOP
        -- Get the age group Content ID for this tenant
        SELECT cv."ContentId"::text INTO age_group_id
        FROM "ContentValue" cv
        JOIN "ContentTypeField" ctf ON cv."ContentTypeFieldId" = ctf."Id"
        WHERE ctf."ContentTypeId" = 37
          AND ctf."FieldName" = 'name'
          AND cv."Value" = age_group_name
          AND cv."TenantId" = tenant_id;

        IF age_group_id IS NULL THEN
            RAISE NOTICE 'Age group "61-65 months (5 years)" not found for tenant % - skipping', tenant_id;
            CONTINUE;
        END IF;

      -- =====================================================================
        -- Step 1: Prepare source data from JSON
        -- =====================================================================
        WITH source AS (
            SELECT
                q.name,
                q.subcategory,
                row_number() OVER () AS insert_order
            FROM jsonb_to_recordset(questions) AS q(name text, subcategory text)
        ),

        -- =====================================================================
        -- Step 2: Create the new Content rows (skills/questions)
        -- =====================================================================
        new_content AS (
            INSERT INTO public."Content"
                ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
            SELECT
                7, true, CURRENT_DATE, CURRENT_DATE, '', null, false
            FROM source
            RETURNING "Id"
        ),

        -- =====================================================================
        -- Step 3: Combine new IDs with original name/subcategory/order
        -- =====================================================================
        new_skills_with_info AS (
            SELECT
                nc."Id" AS skill_id,
                s.name,
                s.subcategory,
                s.insert_order
            FROM new_content nc
            JOIN source s ON true   
            ORDER BY s.insert_order
        ),

        -- =====================================================================
        -- Step 4: Insert all the ContentValue rows (name, value, age group)
        -- =====================================================================
        inserted_values AS (
            -- name
            INSERT INTO public."ContentValue"
                ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
            SELECT skill_id, fixed_locale, name_field_id, name, tenant_id, CURRENT_DATE, CURRENT_DATE
            FROM new_skills_with_info

            UNION ALL

            -- value (same as name)
            SELECT skill_id, fixed_locale, value_field_id, name, tenant_id, CURRENT_DATE, CURRENT_DATE
            FROM new_skills_with_info

            UNION ALL

            -- ageGroups
            SELECT skill_id, fixed_locale, age_field_id, age_group_id, tenant_id, CURRENT_DATE, CURRENT_DATE
            FROM new_skills_with_info
        ),

        -- =====================================================================
        -- Step 5: Build ONE ordered comma-separated list of ALL new skill IDs
        -- =====================================================================
        ordered_new_ids AS (
            SELECT string_agg(skill_id::text, ',' ORDER BY insert_order) AS all_new_skill_ids
            FROM new_skills_with_info
        ),

        -- =====================================================================
        -- Step 6: Update subcategory skill lists – only once per subcategory
        --          with duplicate protection
        -- =====================================================================
        update_subcategories AS (
            INSERT INTO public."ContentValue"
                ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
            SELECT
                cvs."ContentId",
                fixed_locale,
                26,   -- skills field
                CASE
                    -- Already contains this exact list → no change
                    WHEN cvs."Value" LIKE '%,' || ord.all_new_skill_ids || ',%' THEN cvs."Value"
                    -- Already ends with it → no change
                    WHEN cvs."Value" LIKE '%,' || ord.all_new_skill_ids THEN cvs."Value"
                    -- Safe append
                    ELSE COALESCE(NULLIF(cvs."Value", ''), '') ||
                         CASE WHEN cvs."Value" IS NOT NULL AND cvs."Value" <> '' THEN ',' ELSE '' END ||
                         ord.all_new_skill_ids
                END AS new_value,
                tenant_id,
                CURRENT_DATE,
                CURRENT_DATE
            FROM "ContentValue" cvs
            CROSS JOIN ordered_new_ids ord
            INNER JOIN "ContentValue" cvn 
                ON cvn."ContentId" = cvs."ContentId"
            WHERE cvn."ContentTypeFieldId" = 29                     -- subcategory name
              AND cvs."ContentTypeFieldId" = 26                     -- skills list
              AND cvs."LocaleId" = fixed_locale
              AND cvs."TenantId" = tenant_id
              AND cvn."TenantId" = tenant_id
              -- Only update subcategories that actually received new skills this run
              AND EXISTS (
                  SELECT 1 
                  FROM new_skills_with_info nsi 
                  WHERE nsi.subcategory = cvn."Value"
              )
            ON CONFLICT ("Id") DO UPDATE SET
                "Value" = EXCLUDED."Value",
                "UpdatedDate" = CURRENT_DATE
        )

        -- =====================================================================
        -- Step 7: Optional – update the age group's master ordered skill list
        -- =====================================================================
        INSERT INTO public."ContentValue"
            ("ContentId", "LocaleId", "ContentTypeFieldId", "Value", "TenantId", "InsertedDate", "UpdatedDate")
        SELECT
            age_group_id::integer,
            fixed_locale,
            skill_field_id,
            ord.all_new_skill_ids,
            tenant_id,
            CURRENT_DATE,
            CURRENT_DATE
        FROM ordered_new_ids ord
        ON CONFLICT ("Id") DO UPDATE SET
            "Value" = EXCLUDED."Value",
            "UpdatedDate" = CURRENT_DATE;

    END LOOP;

    RAISE NOTICE 'Script completed.';
END $$;

select cvs."Id", cvs."Value" , cvn."Value" 
from "ContentValue" cvn
inner join "ContentValue" cvs on cvn."ContentId" = cvs."ContentId" 
inner join "Content" c on cvn."ContentId" = c."Id" 
where cvn."ContentTypeFieldId" = 29 and cvs."ContentTypeFieldId" = 26 and cvs."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df'
and cvn."LocaleId" = '9688cd08-adef-408c-9d34-5d75ae5c44df' and c."IsActive" ;
--	and cvn."Value" = 'Number, shape, size, pattern' ;

SELECT * FROM "Content" 
WHERE "InsertedDate" >= CURRENT_DATE - INTERVAL '5 minutes'
  AND "TenantId" IN (SELECT "Id" FROM "Tenant" LIMIT 3)   -- optional limit
ORDER BY "InsertedDate" DESC
LIMIT 50;

-- Look at ContentValue too
SELECT cv.*, ctf."FieldName", c."ContentTypeId"
FROM "ContentValue" cv
JOIN "ContentTypeField" ctf ON cv."ContentTypeFieldId" = ctf."Id"
JOIN "Content" c ON cv."ContentId" = c."Id"
WHERE cv."InsertedDate" >= CURRENT_DATE - INTERVAL '5 minutes'
ORDER BY cv."InsertedDate" DESC
LIMIT 100;

-- When you're done checking → throw everything away
ROLLBACK;