BEGIN;

DO $$
DECLARE
	-- UDATE VARIABLES - BEGIN -----------------------------------------------
    p_username      text := 'lukubenil@gmail.com';
    p_new_tenant_id uuid := '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid;
    p_execute_mode  text := LOWER('dryrun');		-- dryrun or execute
	-- UDATE VARIABLES - END -------------------------------------------------
    
    v_user_id           uuid;
	v_admin_user_id		uuid;
    v_current_tenant_id uuid;
    v_affected          integer;
BEGIN
    -- Validate mode
    IF p_execute_mode NOT IN ('dryrun', 'execute') THEN
        RAISE EXCEPTION 'Invalid execute_mode "%". Use either ''dryrun'' or ''execute''.', p_execute_mode;
    END IF;

    RAISE NOTICE '================================================';
    RAISE NOTICE 'USER TENANT MOVE SCRIPT';
    RAISE NOTICE 'Mode          : %', 
        CASE WHEN p_execute_mode = 'dryrun' 
             THEN 'DRY RUN (no changes will be made)' 
             ELSE 'EXECUTE - CHANGES WILL BE SAVED' 
        END;
    RAISE NOTICE 'Username      : %', p_username;
    RAISE NOTICE 'New TenantId  : %', p_new_tenant_id;
    RAISE NOTICE '================================================';

    -- Find the user
    SELECT "Id", "TenantId"
      INTO v_user_id, v_current_tenant_id
      FROM public."AspNetUsers"
     WHERE "UserName" = p_username;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'ERROR: User with UserName "%" not found in AspNetUsers table!', p_username;
    END IF;

	SELECT "UserId" INTO v_admin_user_id
		FROM "UserHierarchy" uh WHERE uh."TenantId" = v_current_tenant_id and uh."Hierarchy" = '0.1' AND uh."UserType" = 'Administrator';

    RAISE NOTICE 'User found:';
    RAISE NOTICE '   User Id           : %', v_user_id;
    RAISE NOTICE '   Current TenantId  : %', v_current_tenant_id;
    RAISE NOTICE '   Will be changed to: %', p_new_tenant_id;

	RAISE NOTICE 'Records to be updated:';

	SELECT COUNT(*) INTO v_affected FROM "Absentees" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   Absentees: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "AspNetUserClaims" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   AspNetUserClaims: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "AspNetUserLogins" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   AspNetUserLogins: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "AspNetUserRoles" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   AspNetUserRoles: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "AspNetUserTokens" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   AspNetUserTokens: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "AspNetUsers" a WHERE a."Id" = v_user_id;  RAISE NOTICE '   AspNetUsers: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "Attendance" a WHERE a."UserId" IN (SELECT c."UserId" 
			FROM "Child" c WHERE c."UserId" IN (SELECT "UserId" FROM "UserHierarchy" WHERE "ParentId" = v_user_id));
		RAISE NOTICE '   Attendance: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "AuditLog" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   AuditLog: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "CalendarEvent" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   CalendarEvent: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "CalendarEventParticipant" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   CalendarEventParticipant: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "Caregiver" c WHERE c."Id" IN (SELECT c."CaregiverId" 
			FROM "Child" c WHERE c."UserId" IN (SELECT "UserId" FROM "UserHierarchy" WHERE "ParentId" = v_user_id));
		RAISE NOTICE '   Caregiver: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "Child" c WHERE c."UserId" IN (SELECT "UserId" FROM "UserHierarchy" WHERE "ParentId" = v_user_id);
		RAISE NOTICE '   Child: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "ChildProgressReport" cpr WHERE cpr."ChildId" IN (SELECT c."Id" 
			FROM "Child" c WHERE c."UserId" IN (SELECT "UserId" FROM "UserHierarchy" WHERE "ParentId" = v_user_id));
		RAISE NOTICE '   ChildProgressReport: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "ChildProgressReportPeriod" cprp  WHERE cprp."ClassroomId" IN (SELECT c."Id" FROM "Classroom" c WHERE c."UserId" = v_user_id);
		RAISE NOTICE '   ChildProgressReportPeriod: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "ClassProgramme" cp WHERE cp."ClassroomGroupId" IN (SELECT "Id" FROM "ClassroomGroup" cg WHERE cg."UserId" = v_user_id);
		RAISE NOTICE '   ClassProgramme: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "ClassReassignmentHistory" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   ClassReassignmentHistory: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "Classroom" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   Classroom: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "ClassroomGroup" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   ClassroomGroup: %', v_affected;

	--Coach
	--CoachContact
	--CoachFeedback

	SELECT COUNT(*) INTO v_affected FROM "CommunityProfile" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   CommunityProfile: %', v_affected;

	--CommunityProfileConnection

	SELECT COUNT(*) INTO v_affected 
		FROM "CommunityProfileSkill" cps WHERE cps."CommunityProfileId" IN (SELECT "Id" FROM "CommunityProfile" cp WHERE cp."UserId" = v_user_id);
		RAISE NOTICE '   CommunityProfile: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "Document" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   Document: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "Invite" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   Invite: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "JWTUserTokens" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   JWTUserTokens: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "JobNotification" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   JobNotification: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "Learner" l WHERE l."UserId" IN (SELECT c."UserId" 
			FROM "Child" c WHERE c."UserId" IN (SELECT "UserId" FROM "UserHierarchy" WHERE "ParentId" = v_user_id));
		RAISE NOTICE '   Learner: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "Note" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   Note: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "PQARating" p WHERE p."VisitId" IN (SELECT v."Id"
			FROM "Visit" v WHERE v."PractitionerId" IN (SELECT p."Id" FROM "Practitioner" p WHERE p."UserId" = v_user_id));
		RAISE NOTICE '   JobNotification: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "PQASectionRating" pr WHERE pr."PQARatingId" IN (SELECT p."Id"
			FROM "PQARating" p WHERE p."VisitId" IN (SELECT v."Id"
				FROM "Visit" v WHERE v."PractitionerId" IN (SELECT p."Id" FROM "Practitioner" p WHERE p."UserId" = v_user_id)));
		RAISE NOTICE '   PQASectionRating: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "PointsUserSummary" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   PointsUserSummary: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "Practitioner" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   Practitioner: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "PractitionerRemovalHistory" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   PractitionerRemovalHistory: %', v_affected;

	SELECT COUNT(DISTINCT p."Id") INTO v_affected
		FROM "Programme" p 
			WHERE (p."ClassroomGroupId" IN (SELECT "Id" FROM "ClassroomGroup" cg WHERE cg."UserId" = v_user_id)
					OR p."ClassroomId" IN (SELECT "Id" FROM "Classroom" c WHERE c."UserId" = v_user_id))
				AND p."IsActive";
		RAISE NOTICE '   Programme: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "ProgrammeDay" pd WHERE pd."ProgrammeId" IN (SELECT p."Id"
			FROM "Programme" p 
				WHERE (p."ClassroomGroupId" IN (SELECT "Id" FROM "ClassroomGroup" cg WHERE cg."UserId" = v_user_id)
						OR p."ClassroomId" IN (SELECT "Id" FROM "Classroom" c WHERE c."UserId" = v_user_id)
					AND p."IsActive"
					))
			AND pd."IsActive";
		RAISE NOTICE '   ProgrammeDay: %', v_affected;
	-- when updating ProgrammeDay need to reset content

	SELECT COUNT(*) INTO v_affected FROM "ShortUrl" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   ShortUrl: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "SiteAddress" sa WHERE sa."Id" IN (
			SELECT p."SiteAddressId"  FROM "Practitioner" p WHERE p."UserId" = v_user_id
			UNION SELECT c."SiteAddressId"  FROM "Classroom" c WHERE c."UserId" = v_user_id);
		RAISE NOTICE '   SiteAddress: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "StatementsExpenses" se WHERE se."StatementsIncomeStatementId" IN (SELECT sis."Id"
			FROM "StatementsIncomeStatement" sis WHERE sis."UserId" = v_user_id);
		RAISE NOTICE '   StatementsExpenses: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "StatementsIncome" si WHERE si."StatementsIncomeStatementId" IN (SELECT sis."Id"
			FROM "StatementsIncomeStatement" sis WHERE sis."UserId" = v_user_id);
		RAISE NOTICE '   StatementsIncome: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "StatementsIncomeStatement" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   StatementsIncomeStatement: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "StatementsStartupSupport" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   StatementsStartupSupport: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "SystemLog" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   SystemLog: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "UserConsent" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   UserConsent: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "UserGrants" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   UserGrants: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "UserHelp" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   UserHelp: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "UserHierarchy" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   UserHierarchy: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "UserLanguages" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   UserLanguages: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "UserPermission" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   UserPermission: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "UserResourceLikes" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   UserResourceLikes: %', v_affected;

	SELECT COUNT(*) INTO v_affected FROM "UserTrainingCourse" a WHERE a."UserId" = v_user_id;  RAISE NOTICE '   UserTrainingCourse: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "Visit" v WHERE v."PractitionerId" IN (SELECT p."Id" FROM "Practitioner" p WHERE p."UserId" = v_user_id);
		RAISE NOTICE '   Visit: %', v_affected;

	SELECT COUNT(*) INTO v_affected
		FROM "VisitData" vd WHERE vd."VisitId" IN (SELECT v."Id"
			FROM "Visit" v WHERE v."PractitionerId" IN (SELECT p."Id" FROM "Practitioner" p WHERE p."UserId" = 'fec1518b-84f5-4ffa-990f-03f72cb56a8f'));
		RAISE NOTICE '   VisitData: %', v_affected;

    IF p_execute_mode = 'dryrun' THEN
        RAISE NOTICE '';
        RAISE NOTICE '✅ DRY RUN COMPLETE — No changes were made to the database.';
        RAISE NOTICE 'To apply the change:';
        RAISE NOTICE '   1. Change execute_mode to ''execute''';
        RAISE NOTICE '   2. Run the script again';
        RETURN;
    END IF;

    -- ========================
    -- EXECUTE MODE
    -- ========================
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  APPLYING CHANGES...';

    UPDATE public."AspNetUsers"
       SET "TenantId" = p_new_tenant_id
     WHERE "Id" = v_user_id;

    GET DIAGNOSTICS v_affected = ROW_COUNT;

    IF v_affected = 1 THEN
        RAISE NOTICE '✅ SUCCESS: User "%" has been moved to TenantId %', p_username, p_new_tenant_id;
        
        RAISE NOTICE '';
        RAISE NOTICE 'FINAL STATE AFTER UPDATE:';
        SELECT "UserName", "Id" AS "UserId", "TenantId" 
          FROM public."AspNetUsers" 
         WHERE "Id" = v_user_id;
    ELSE
        RAISE EXCEPTION 'Error: % rows were affected (expected 1).', v_affected;
    END IF;

	UPDATE "Absentees" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "AspNetUserClaims" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;
	
	UPDATE "AspNetUserLogins" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "AspNetUserRoles" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;
	
	UPDATE "AspNetUserTokens" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "Attendance" SET "TenantId" = p_new_tenant_id
		WHERE "UserId" IN (SELECT c."UserId" FROM "Child" c WHERE c."UserId" IN (SELECT "UserId" FROM "UserHierarchy" WHERE "ParentId" = v_user_id));

	UPDATE "AuditLog" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "CalendarEvent" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "CalendarEventParticipant" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "Caregiver" SET "TenantId" = p_new_tenant_id
	 	WHERE "Id" IN (SELECT c."CaregiverId" FROM "Child" c WHERE c."UserId" IN (SELECT "UserId" FROM "UserHierarchy" WHERE "ParentId" = v_user_id));

	UPDATE "Child" SET "TenantId" = p_new_tenant_id
		WHERE "UserId" IN (SELECT "UserId" FROM "UserHierarchy" WHERE "ParentId" = v_user_id);

	UPDATE "ChildProgressReport" SET "TenantId" = p_new_tenant_id
		WHERE "ChildId" IN (SELECT c."Id" 
			FROM "Child" c WHERE c."UserId" IN (SELECT "UserId" FROM "UserHierarchy" WHERE "ParentId" = v_user_id));

	UPDATE "ChildProgressReportPeriod" SET "TenantId" = p_new_tenant_id
		WHERE "ClassroomId" IN (SELECT c."Id" FROM "Classroom" c WHERE c."UserId" = v_user_id);

	UPDATE "ClassProgramme" SET "TenantId" = p_new_tenant_id
		WHERE "ClassroomGroupId" IN (SELECT "Id" FROM "ClassroomGroup" cg WHERE cg."UserId" = v_user_id);

	UPDATE "ClassReassignmentHistory" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "Classroom" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "ClassroomGroup" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	--Coach
	--CoachContact
	--CoachFeedback

	UPDATE "CommunityProfile" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	--CommunityProfileConnection

	UPDATE "CommunityProfileSkill" SET "TenantId" = p_new_tenant_id
		WHERE "CommunityProfileId" IN (SELECT "Id" FROM "CommunityProfile" cp WHERE cp."UserId" = v_user_id);

	UPDATE "Document" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "Invite" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "JWTUserTokens" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "JobNotification" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "Learner" SET "TenantId" = p_new_tenant_id
		WHERE "UserId" IN (SELECT c."UserId" 
			FROM "Child" c WHERE c."UserId" IN (SELECT "UserId" FROM "UserHierarchy" WHERE "ParentId" = v_user_id));

	UPDATE "Note" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "PQARating" SET "TenantId" = p_new_tenant_id
		WHERE "VisitId" IN (SELECT v."Id"
			FROM "Visit" v WHERE v."PractitionerId" IN (SELECT p."Id" FROM "Practitioner" p WHERE p."UserId" = v_user_id));

	UPDATE "PQASectionRating" SET "TenantId" = p_new_tenant_id
		WHERE "PQARatingId" IN (SELECT p."Id"
			FROM "PQARating" p WHERE p."VisitId" IN (SELECT v."Id"
				FROM "Visit" v WHERE v."PractitionerId" IN (SELECT p."Id" FROM "Practitioner" p WHERE p."UserId" = v_user_id)));

	UPDATE "PointsUserSummary" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "Practitioner" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "PractitionerRemovalHistory" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

--	UPDATE "Programme" SET "TenantId" = p_new_tenant_id 
--		WHERE ("ClassroomGroupId" IN (SELECT "Id" FROM "ClassroomGroup" cg WHERE cg."UserId" = v_user_id)
--				OR "ClassroomId" IN (SELECT "Id" FROM "Classroom" c WHERE c."UserId" = v_user_id))
--			AND "IsActive";

--	UPDATE "ProgrammeDay" SET "TenantId" = p_new_tenant_id 
--		WHERE "ProgrammeId" IN (SELECT p."Id"
--			FROM "Programme" p 
--				WHERE (p."ClassroomGroupId" IN (SELECT "Id" FROM "ClassroomGroup" cg WHERE cg."UserId" = v_user_id)
--						OR p."ClassroomId" IN (SELECT "Id" FROM "Classroom" c WHERE c."UserId" = v_user_id)
--					AND p."IsActive"
--					))
--			AND "IsActive";

	UPDATE "ShortUrl" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "SiteAddress" SET "TenantId" = p_new_tenant_id
		WHERE "Id" IN (
			SELECT p."SiteAddressId"  FROM "Practitioner" p WHERE p."UserId" = v_user_id
			UNION SELECT c."SiteAddressId"  FROM "Classroom" c WHERE c."UserId" = v_user_id);

	UPDATE "StatementsExpenses" SET "TenantId" = p_new_tenant_id
		WHERE "StatementsIncomeStatementId" IN (SELECT sis."Id"
			FROM "StatementsIncomeStatement" sis WHERE sis."UserId" = v_user_id);

	UPDATE "StatementsIncome" SET "TenantId" = p_new_tenant_id 
		WHERE "StatementsIncomeStatementId" IN (SELECT sis."Id"
			FROM "StatementsIncomeStatement" sis WHERE sis."UserId" = v_user_id);

	UPDATE "StatementsIncomeStatement" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "StatementsStartupSupport" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "SystemLog" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "UserConsent" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "UserGrants" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "UserHelp" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "UserHierarchy" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "UserLanguages" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "UserPermission" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "UserResourceLikes" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "UserTrainingCourse" SET "TenantId" = p_new_tenant_id WHERE "UserId" = v_user_id;

	UPDATE "Visit" SET "TenantId" = p_new_tenant_id 
		WHERE v."PractitionerId" IN (SELECT p."Id" FROM "Practitioner" p WHERE p."UserId" = v_user_id);

	UPDATE "VisitData" SET "TenantId" = p_new_tenant_id
		WHERE "VisitId" IN (SELECT v."Id"
			FROM "Visit" v WHERE v."PractitionerId" IN (SELECT p."Id" FROM "Practitioner" p WHERE p."UserId" = 'fec1518b-84f5-4ffa-990f-03f72cb56a8f'));

END $$;


ROLLBACK;
--COMMIT;