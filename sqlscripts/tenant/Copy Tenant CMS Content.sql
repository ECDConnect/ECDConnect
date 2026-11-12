-- Copy tenant-specific CMS content from one tenant onto another.
--
-- Global content (ContentValue.TenantId is null, and the content row has no
-- values for the source tenant) is shared by every tenant and is not copied.
-- Content the source tenant owns is cloned onto new Content rows. Dynamic
-- link fields (comma-separated content ids) are rewritten to those new ids.
-- Static links, such as Language ids, are left unchanged. Link ids that point
-- at content the source tenant does not own stay as they are.
--
-- Where a source content row also has global field values, the source value
-- wins and the global value fills any field the source does not have. The
-- copy is then fully owned by the target tenant.
--
-- Refuses to run when the target already has content values, so a second run
-- cannot duplicate the library.
--
-- Install once per database, then either call it yourself:
--
--   SELECT * FROM copy_tenant_cms_content(
--     '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid,  -- ECD Connect / OA
--     '<new tenant id>'::uuid);
--
-- or run an Add Tenant script. Those scripts call this function when the
-- target tenant has no CMS content yet.

CREATE OR REPLACE FUNCTION copy_tenant_cms_content(
    p_source_tenant uuid,
    p_target_tenant uuid
)
RETURNS TABLE (
    content_rows integer,
    content_values integer,
    link_values_rewritten integer,
    link_ids_remapped integer,
    link_ids_unmapped integer
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_content_rows integer := 0;
    v_content_values integer := 0;
    v_link_values_rewritten integer := 0;
    v_link_ids_remapped integer := 0;
    v_link_ids_unmapped integer := 0;
    v_content_seq regclass;
    v_value_seq regclass;
BEGIN
    IF p_source_tenant IS NULL OR p_target_tenant IS NULL THEN
        RAISE EXCEPTION 'Source and target tenant ids are required';
    END IF;

    IF p_source_tenant = p_target_tenant THEN
        RAISE EXCEPTION 'Source and target tenant are the same (%)', p_source_tenant;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM "ContentValue" WHERE "TenantId" = p_source_tenant
    ) THEN
        RAISE EXCEPTION 'Source tenant % has no CMS content values to copy', p_source_tenant;
    END IF;

    IF EXISTS (
        SELECT 1 FROM "ContentValue" WHERE "TenantId" = p_target_tenant
    ) THEN
        RAISE EXCEPTION 'Target tenant % already has CMS content values. Refusing to copy again because that would duplicate content.', p_target_tenant;
    END IF;

    -- Identity sequences can sit behind MAX(Id) after manual inserts.
    -- Move them forward only; never backwards.
    v_content_seq := pg_get_serial_sequence('"Content"', 'Id')::regclass;
    v_value_seq := pg_get_serial_sequence('"ContentValue"', 'Id')::regclass;

    PERFORM setval(
        v_content_seq,
        GREATEST(
            (SELECT COALESCE(MAX("Id"), 1) FROM "Content"),
            (SELECT last_value FROM "Content_Id_seq")
        )
    );
    PERFORM setval(
        v_value_seq,
        GREATEST(
            (SELECT COALESCE(MAX("Id"), 1) FROM "ContentValue"),
            (SELECT last_value FROM "ContentValue_Id_seq")
        )
    );

    CREATE TEMP TABLE cms_content_copy_map (
        old_id integer PRIMARY KEY,
        new_id integer NOT NULL UNIQUE
    ) ON COMMIT DROP;

    INSERT INTO cms_content_copy_map (old_id, new_id)
    SELECT c."Id", nextval(v_content_seq)
    FROM "Content" c
    WHERE EXISTS (
        SELECT 1
        FROM "ContentValue" cv
        WHERE cv."ContentId" = c."Id"
          AND cv."TenantId" = p_source_tenant
    )
    ORDER BY c."Id";

    INSERT INTO "Content" (
        "Id",
        "ContentTypeId",
        "IsActive",
        "InsertedDate",
        "UpdatedDate",
        "UpdatedBy",
        "TenantId",
        "IsReadOnly"
    )
    SELECT
        m.new_id,
        c."ContentTypeId",
        c."IsActive",
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'cms-tenant-copy',
        CASE WHEN c."TenantId" = p_source_tenant THEN p_target_tenant ELSE c."TenantId" END,
        c."IsReadOnly"
    FROM cms_content_copy_map m
    JOIN "Content" c ON c."Id" = m.old_id;

    GET DIAGNOSTICS v_content_rows = ROW_COUNT;

    INSERT INTO "ContentValue" (
        "ContentId",
        "LocaleId",
        "ContentTypeFieldId",
        "Value",
        "StatusId",
        "TenantId",
        "InsertedDate",
        "UpdatedDate"
    )
    SELECT
        m.new_id,
        picked."LocaleId",
        picked."ContentTypeFieldId",
        picked."Value",
        picked."StatusId",
        p_target_tenant,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    FROM cms_content_copy_map m
    JOIN LATERAL (
        SELECT DISTINCT ON ("ContentTypeFieldId", "LocaleId")
            "ContentTypeFieldId",
            "LocaleId",
            "Value",
            "StatusId"
        FROM "ContentValue" cv
        WHERE cv."ContentId" = m.old_id
          AND (cv."TenantId" = p_source_tenant OR cv."TenantId" IS NULL)
        ORDER BY
            "ContentTypeFieldId",
            "LocaleId",
            CASE WHEN cv."TenantId" = p_source_tenant THEN 0 ELSE 1 END,
            cv."Id" DESC
    ) picked ON true;

    GET DIAGNOSTICS v_content_values = ROW_COUNT;

    WITH tokens AS (
        SELECT
            cv."Id" AS value_id,
            cv."Value" AS old_value,
            part.ord,
            btrim(part.part) AS token,
            map.new_id
        FROM "ContentValue" cv
        JOIN cms_content_copy_map copied ON copied.new_id = cv."ContentId"
        JOIN "ContentTypeField" f ON f."Id" = cv."ContentTypeFieldId"
        JOIN "ContentFieldType" ft ON ft."Id" = f."FieldTypeId" AND ft."DataType" = 'link'
        CROSS JOIN LATERAL unnest(string_to_array(cv."Value", ',')) WITH ORDINALITY AS part(part, ord)
        LEFT JOIN cms_content_copy_map map
            ON map.old_id = CASE
                WHEN btrim(part.part) ~ '^[0-9]+$' THEN btrim(part.part)::integer
                ELSE NULL
            END
        WHERE cv."TenantId" = p_target_tenant
          AND cv."Value" IS NOT NULL
          AND btrim(cv."Value") <> ''
    ),
    rewritten AS (
        SELECT
            value_id,
            old_value,
            string_agg(COALESCE(new_id::text, token), ',' ORDER BY ord) AS new_value,
            COUNT(*) FILTER (WHERE new_id IS NOT NULL) AS remapped,
            COUNT(*) FILTER (
                WHERE new_id IS NULL AND token ~ '^[0-9]+$'
            ) AS unmapped
        FROM tokens
        GROUP BY value_id, old_value
    ),
    updated AS (
        UPDATE "ContentValue" cv
        SET "Value" = rewritten.new_value,
            "UpdatedDate" = CURRENT_TIMESTAMP
        FROM rewritten
        WHERE cv."Id" = rewritten.value_id
          AND cv."Value" IS DISTINCT FROM rewritten.new_value
        RETURNING rewritten.remapped, rewritten.unmapped
    )
    SELECT
        (SELECT COUNT(*) FROM updated),
        (SELECT COALESCE(SUM(remapped), 0) FROM rewritten),
        (SELECT COALESCE(SUM(unmapped), 0) FROM rewritten)
    INTO v_link_values_rewritten, v_link_ids_remapped, v_link_ids_unmapped;

    DROP TABLE cms_content_copy_map;

    RAISE NOTICE 'Copied % content rows and % values for tenant %. Rewrote % link values (% ids remapped, % ids left pointing at shared or missing content).',
        v_content_rows, v_content_values, p_target_tenant,
        v_link_values_rewritten, v_link_ids_remapped, v_link_ids_unmapped;

    content_rows := v_content_rows;
    content_values := v_content_values;
    link_values_rewritten := v_link_values_rewritten;
    link_ids_remapped := v_link_ids_remapped;
    link_ids_unmapped := v_link_ids_unmapped;
    RETURN NEXT;
END;
$$;
