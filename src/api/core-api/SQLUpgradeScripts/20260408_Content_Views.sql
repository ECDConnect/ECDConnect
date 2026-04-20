-- public."vwContentActivity" source

CREATE OR REPLACE VIEW "vwContentActivity"
AS SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    COALESCE(cv1."Value", ''::text) AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Image",
    COALESCE(cv3."Value", ''::text) AS "Type",
    COALESCE(cv4."Value", ''::text) AS "Materials",
    COALESCE(cv5."Value", ''::text) AS "Description",
    COALESCE(cv6."Value", ''::text) AS "SubCategoryIds",
    COALESCE(cv7."Value", ''::text) AS "Notes",
    COALESCE(cv8."Value", ''::text) AS "SubType",
    COALESCE(cv9."Value", ''::text) AS "AvailableLanguageIds",
    cv1."LocaleId"
   FROM "Content" c
     JOIN "ContentValue" cv1 ON c."Id" = cv1."ContentId" AND cv1."ContentTypeFieldId" = 66
     LEFT JOIN "ContentValue" cv2 ON c."Id" = cv2."ContentId" AND cv2."ContentTypeFieldId" = 67 AND cv1."LocaleId" = cv2."LocaleId"
     LEFT JOIN "ContentValue" cv3 ON c."Id" = cv3."ContentId" AND cv3."ContentTypeFieldId" = 64 AND cv1."LocaleId" = cv3."LocaleId"
     LEFT JOIN "ContentValue" cv4 ON c."Id" = cv4."ContentId" AND cv4."ContentTypeFieldId" = 62 AND cv1."LocaleId" = cv4."LocaleId"
     LEFT JOIN "ContentValue" cv5 ON c."Id" = cv5."ContentId" AND cv5."ContentTypeFieldId" = 65 AND cv1."LocaleId" = cv5."LocaleId"
     LEFT JOIN "ContentValue" cv6 ON c."Id" = cv6."ContentId" AND cv6."ContentTypeFieldId" = 60 AND cv1."LocaleId" = cv6."LocaleId"
     LEFT JOIN "ContentValue" cv7 ON c."Id" = cv7."ContentId" AND cv7."ContentTypeFieldId" = 61 AND cv1."LocaleId" = cv7."LocaleId"
     LEFT JOIN "ContentValue" cv8 ON c."Id" = cv8."ContentId" AND cv8."ContentTypeFieldId" = 63 AND cv1."LocaleId" = cv8."LocaleId"
     LEFT JOIN "ContentValue" cv9 ON c."Id" = cv9."ContentId" AND cv9."ContentTypeFieldId" = 59 AND cv1."LocaleId" = cv9."LocaleId"
  WHERE c."ContentTypeId" = 13;


-- public."vwContentActivityHasProgressSubCategory" source

CREATE OR REPLACE VIEW "vwContentActivityHasProgressSubCategory"
AS SELECT p."Id" AS "ActivityId",
    u."ChildId" AS "ProgressSubCategoryId"
   FROM "Content" p
     JOIN "ContentValue" pcv ON pcv."ContentId" = p."Id" AND pcv."ContentTypeFieldId" = 60 AND pcv."Value" <> ''::text AND pcv."Value" IS NOT NULL
     CROSS JOIN LATERAL ( SELECT val.val::integer AS "ChildId"
           FROM unnest(string_to_array(pcv."Value", ','::text)) val(val)
          WHERE TRIM(BOTH FROM val.val) <> ''::text) u
  WHERE p."ContentTypeId" = 13;


-- public."vwContentConsent" source

CREATE OR REPLACE VIEW "vwContentConsent"
AS SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    cv1."Value" AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Section",
    COALESCE(cv3."Value", ''::text) AS "Description",
    COALESCE(cv4."Value", ''::text) AS "Type",
    COALESCE(cv5."Value", ''::text) AS "Image",
    cv1."LocaleId"
   FROM "Content" c
     JOIN "ContentValue" cv1 ON c."Id" = cv1."ContentId" AND cv1."ContentTypeFieldId" = 70
     LEFT JOIN "ContentValue" cv2 ON c."Id" = cv2."ContentId" AND cv2."ContentTypeFieldId" = 383 AND cv1."LocaleId" = cv2."LocaleId"
     LEFT JOIN "ContentValue" cv3 ON c."Id" = cv3."ContentId" AND cv3."ContentTypeFieldId" = 68 AND cv1."LocaleId" = cv3."LocaleId"
     LEFT JOIN "ContentValue" cv4 ON c."Id" = cv4."ContentId" AND cv4."ContentTypeFieldId" = 69 AND cv1."LocaleId" = cv4."LocaleId"
     LEFT JOIN "ContentValue" cv5 ON c."Id" = cv5."ContentId" AND cv5."ContentTypeFieldId" = 374 AND cv1."LocaleId" = cv5."LocaleId"
  WHERE c."ContentTypeId" = 14 AND c."TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid;


-- public."vwContentStoryBook" source

CREATE OR REPLACE VIEW "vwContentStoryBook"
AS SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    cv1."Value" AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Type",
    COALESCE(cv3."Value", ''::text) AS "Author",
    COALESCE(cv4."Value", ''::text) AS "Illustrator",
    COALESCE(cv5."Value", ''::text) AS "BookLocation",
    COALESCE(cv6."Value", ''::text) AS "Keywords",
    COALESCE(cv7."Value", ''::text) AS "StoryBookPartIds",
    COALESCE(cv8."Value", ''::text) AS "AvailableLanguageIds",
    cv1."LocaleId"
   FROM "Content" c
     JOIN "ContentValue" cv1 ON c."Id" = cv1."ContentId" AND cv1."ContentTypeFieldId" = 52
     LEFT JOIN "ContentValue" cv2 ON c."Id" = cv2."ContentId" AND cv2."ContentTypeFieldId" = 51 AND cv1."LocaleId" = cv2."LocaleId"
     LEFT JOIN "ContentValue" cv3 ON c."Id" = cv3."ContentId" AND cv3."ContentTypeFieldId" = 50 AND cv1."LocaleId" = cv3."LocaleId"
     LEFT JOIN "ContentValue" cv4 ON c."Id" = cv4."ContentId" AND cv4."ContentTypeFieldId" = 49 AND cv1."LocaleId" = cv4."LocaleId"
     LEFT JOIN "ContentValue" cv5 ON c."Id" = cv5."ContentId" AND cv5."ContentTypeFieldId" = 48 AND cv1."LocaleId" = cv5."LocaleId"
     LEFT JOIN "ContentValue" cv6 ON c."Id" = cv6."ContentId" AND cv6."ContentTypeFieldId" = 46 AND cv1."LocaleId" = cv6."LocaleId"
     LEFT JOIN "ContentValue" cv7 ON c."Id" = cv7."ContentId" AND cv7."ContentTypeFieldId" = 47 AND cv1."LocaleId" = cv7."LocaleId"
     LEFT JOIN "ContentValue" cv8 ON c."Id" = cv8."ContentId" AND cv8."ContentTypeFieldId" = 45 AND cv1."LocaleId" = cv8."LocaleId"
  WHERE c."ContentTypeId" = 10;


-- public."vwContentStoryBookHasPart" source

CREATE OR REPLACE VIEW "vwContentStoryBookHasPart"
AS SELECT p."Id" AS "StoryBookId",
    u."ChildId" AS "StoryBookPartId"
   FROM "Content" p
     JOIN "ContentValue" pcv ON pcv."ContentId" = p."Id" AND pcv."ContentTypeFieldId" = 47 AND pcv."Value" <> ''::text AND pcv."Value" IS NOT NULL
     CROSS JOIN LATERAL ( SELECT val.val::integer AS "ChildId"
           FROM unnest(string_to_array(pcv."Value", ','::text)) val(val)
          WHERE TRIM(BOTH FROM val.val) <> ''::text) u
  WHERE p."ContentTypeId" = 10;


-- public."vwContentStoryBookPart" source

CREATE OR REPLACE VIEW "vwContentStoryBookPart"
AS SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    COALESCE(cv1."Value", ''::text) AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Part",
    COALESCE(cv3."Value", ''::text) AS "PartText",
    COALESCE(cv4."Value", ''::text) AS "StoryBookPartQuestionIds",
    cv1."LocaleId"
   FROM "Content" c
     JOIN "ContentValue" cv1 ON c."Id" = cv1."ContentId" AND cv1."ContentTypeFieldId" = 56
     LEFT JOIN "ContentValue" cv2 ON c."Id" = cv2."ContentId" AND cv2."ContentTypeFieldId" = 55 AND cv1."LocaleId" = cv2."LocaleId"
     LEFT JOIN "ContentValue" cv3 ON c."Id" = cv3."ContentId" AND cv3."ContentTypeFieldId" = 54 AND cv1."LocaleId" = cv3."LocaleId"
     LEFT JOIN "ContentValue" cv4 ON c."Id" = cv4."ContentId" AND cv4."ContentTypeFieldId" = 53 AND cv1."LocaleId" = cv4."LocaleId"
  WHERE c."ContentTypeId" = 11;


-- public."vwContentStoryBookPartHasQuestion" source

CREATE OR REPLACE VIEW "vwContentStoryBookPartHasQuestion"
AS SELECT p."Id" AS "StoryBookPartId",
    u."ChildId" AS "StoryBookPartQuestionId"
   FROM "Content" p
     JOIN "ContentValue" pcv ON pcv."ContentId" = p."Id" AND pcv."ContentTypeFieldId" = 53 AND pcv."Value" <> ''::text AND pcv."Value" IS NOT NULL
     CROSS JOIN LATERAL ( SELECT val.val::integer AS "ChildId"
           FROM unnest(string_to_array(pcv."Value", ','::text)) val(val)
          WHERE TRIM(BOTH FROM val.val) <> ''::text) u
  WHERE p."ContentTypeId" = 11;


-- public."vwContentStoryBookPartQuestion" source

CREATE OR REPLACE VIEW "vwContentStoryBookPartQuestion"
AS SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    COALESCE(cv1."Value", ''::text) AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Question",
    cv1."LocaleId"
   FROM "Content" c
     JOIN "ContentValue" cv1 ON c."Id" = cv1."ContentId" AND cv1."ContentTypeFieldId" = 58
     LEFT JOIN "ContentValue" cv2 ON c."Id" = cv2."ContentId" AND cv2."ContentTypeFieldId" = 57 AND cv1."LocaleId" = cv2."LocaleId"
  WHERE c."ContentTypeId" = 12;


-- public."vwContentTheme" source

CREATE OR REPLACE VIEW "vwContentTheme"
AS SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    cv1."Value" AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Color",
    COALESCE(cv3."Value", ''::text) AS "ImageUrl",
    NULLIF(TRIM(BOTH FROM cv4."Value"), ''::text) AS "ThemeDays",
    cv1."LocaleId"
   FROM "Content" c
     JOIN "ContentValue" cv1 ON c."Id" = cv1."ContentId" AND cv1."ContentTypeFieldId" = 38
     LEFT JOIN "ContentValue" cv2 ON c."Id" = cv2."ContentId" AND cv2."ContentTypeFieldId" = 37 AND cv1."LocaleId" = cv2."LocaleId"
     LEFT JOIN "ContentValue" cv3 ON c."Id" = cv3."ContentId" AND cv3."ContentTypeFieldId" = 36 AND cv1."LocaleId" = cv3."LocaleId"
     LEFT JOIN "ContentValue" cv4 ON c."Id" = cv4."ContentId" AND cv4."ContentTypeFieldId" = 35 AND cv1."LocaleId" = cv4."LocaleId"
  WHERE c."ContentTypeId" = 8;


-- public."vwContentThemeDay" source

CREATE OR REPLACE VIEW "vwContentThemeDay"
AS SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    cv1."Value" AS "Name",
    cv2."Value" AS "Day",
    NULLIF(cv3."Value", ''::text)::integer AS "SmallGroupActivityId",
    NULLIF(cv4."Value", ''::text)::integer AS "LargeGroupActivityId",
    NULLIF(cv5."Value", ''::text)::integer AS "StoryBookId",
    NULLIF(cv6."Value", ''::text)::integer AS "StoryActivityId",
    cv1."LocaleId",
    p."Id" AS "ThemeId"
   FROM "Content" p
     JOIN "ContentValue" pcv ON pcv."ContentId" = p."Id" AND pcv."ContentTypeFieldId" = 35 AND pcv."Value" <> ''::text AND pcv."Value" IS NOT NULL
     CROSS JOIN LATERAL ( SELECT val.val::integer AS "ChildId"
           FROM unnest(string_to_array(pcv."Value", ','::text)) val(val)
          WHERE TRIM(BOTH FROM val.val) <> ''::text) u
     JOIN "Content" c ON u."ChildId" = c."Id"
     JOIN "ContentValue" cv1 ON c."Id" = cv1."ContentId" AND cv1."ContentTypeFieldId" = 44 AND cv1."LocaleId" = pcv."LocaleId"
     LEFT JOIN "ContentValue" cv2 ON c."Id" = cv2."ContentId" AND cv2."ContentTypeFieldId" = 43 AND cv1."LocaleId" = cv2."LocaleId"
     LEFT JOIN "ContentValue" cv3 ON c."Id" = cv3."ContentId" AND cv3."ContentTypeFieldId" = 42 AND cv1."LocaleId" = cv3."LocaleId"
     LEFT JOIN "ContentValue" cv4 ON c."Id" = cv4."ContentId" AND cv4."ContentTypeFieldId" = 41 AND cv1."LocaleId" = cv4."LocaleId"
     LEFT JOIN "ContentValue" cv5 ON c."Id" = cv5."ContentId" AND cv5."ContentTypeFieldId" = 40 AND cv1."LocaleId" = cv5."LocaleId"
     LEFT JOIN "ContentValue" cv6 ON c."Id" = cv6."ContentId" AND cv6."ContentTypeFieldId" = 39 AND cv1."LocaleId" = cv6."LocaleId"
  WHERE c."ContentTypeId" = 9 AND p."ContentTypeId" = 8;




-- public."vwProgressTrackingSubCategory" source

CREATE OR REPLACE VIEW "vwProgressTrackingSubCategory"
AS SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    COALESCE(cv1."Value", ''::text) AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Description",
    COALESCE(cv3."Value", ''::text) AS "ImageUrl",
    COALESCE(cv4."Value", ''::text) AS "Skills",
    COALESCE(cv5."Value", ''::text) AS "ImageHexColor",
    cv1."LocaleId"
   FROM "Content" c
     JOIN "ContentValue" cv1 ON c."Id" = cv1."ContentId" AND cv1."ContentTypeFieldId" = 29
     LEFT JOIN "ContentValue" cv2 ON c."Id" = cv2."ContentId" AND cv2."ContentTypeFieldId" = 28 AND cv1."LocaleId" = cv2."LocaleId"
     LEFT JOIN "ContentValue" cv3 ON c."Id" = cv3."ContentId" AND cv3."ContentTypeFieldId" = 27 AND cv1."LocaleId" = cv3."LocaleId"
     LEFT JOIN "ContentValue" cv4 ON c."Id" = cv4."ContentId" AND cv4."ContentTypeFieldId" = 26 AND cv1."LocaleId" = cv4."LocaleId"
     LEFT JOIN "ContentValue" cv5 ON c."Id" = cv5."ContentId" AND cv5."ContentTypeFieldId" = 399 AND cv1."LocaleId" = cv5."LocaleId"
  WHERE c."ContentTypeId" = 5 AND c."TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid;