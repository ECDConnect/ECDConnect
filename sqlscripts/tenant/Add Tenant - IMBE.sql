--select uuid_generate_v4();

begin;

do $$
declare
	tenantId 				uuid := '3d50402b-95de-43da-b719-ce50d9d1bcdb'::uuid;
	tenantOrgName			text := 'IMBE Enterprise Incubator';
	tenantAppName			text := 'IMBE';
	tenantSiteAddress		text := 'imbe.ecdconnect.co.za';
	tenantAdminSiteAddress	text := 'portal-imbe.ecdconnect.co.za';
	tenantOrgEmail			text := 'support@imbe.org.za';
	moodleCohort			text := 'imbe';
	userSuperAdmin1UserName	text := 'IMBESuperAdmin1';
	userSuperAdmin1Email	text := 'lwazi@imbe.org.za';
	userSuperAdmin2UserName text := 'IMBESuperAdmin2';
	userSuperAdmin2Email	text := 'nokukhanya@imbe.org.za';

	-- modules
	enableModuleCoach		bool := true;
	coachRoleName			text := 'Coach';
	enableModuleClassroomActivities bool := true;
	enableModuleProgress	bool := true;
	enableModuleAttendance	bool := true;
	enableModuleCalendar	bool := true;
	enableModuleTraining	bool := true;
	enableModuleBusiness	bool := true;

	-- sms
	smsProvider							text := 'BulkSMS';	-- BulkSms | iTouch | SMSPortal
	smsProviderBulkSMSTokenID			text := '9C8BBE9996DE4836A6A1601312A82A98-01-A';
	smsProviderBulkSMSTokenSecret		text := '23rMopL0RlovPj9Scd84YvAMSIYvo';
	smsProviderBulkSMSTokenBasicAuth	text := 'OUM4QkJFOTk5NkRFNDgzNkE2QTE2MDEzMTJBODJBOTgtMDEtQToyM3JNb3BMMFJsb3ZQajlTY2Q4NFl2QU1TSVl2bw==';
	smsProviderITouchUsername			text := '';	
	smsProviderITouchPassword			text := '';
	smsProviderSMSPortalAPIKey			text := '';
	smsProviderSMSPortalAPISecret		text := '';
	
-- these shouldn't change
	backendAddress			text := 'api-ecd.ecdconnect.co.za';
	moodleSiteAddress		text := 'https://moodle.ecdconnect.co.za';
	moodleConfig			text := '{"userTypes":[{"userType":"*","cohorts":["ecd-connect-ui","ecd-connect","%s"]}],"database":{"type":"postgres","connectionString":"Server=ecdlink-pgsql-dev-za.postgres.database.azure.com;Database=ecdmoodle;Port=5432;User Id=ecdlinkadmin@ecdlink-pgsql-dev-za;Password=3DeL4Tc@dqQM7d6E;Ssl Mode=VerifyFull;"},"site":{"address":"https://moodle.ecdconnect.co.za","defaultPassword":"Test@1234","userNameFormatString":"{0:UserName}@ecdconnect.co.za","emailFormatString":"{0:UserName}@ecdconnect.co.za"}}';
	tenantBlobAddress		text := 'https://storage.ecdconnect.co.za';
	oaTenantId				uuid := '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid;

-- other
	hierarchyAdministratorId	uuid := null;
	hierarchyPractitionerId	uuid := null;
	hierarchyCoachId		uuid := null;
	hierarchyPrincipalId	uuid := null;
	hierarchyFranchisorId	uuid := null;
	hierarchyChildId		uuid := null;
	userSuperAdmin1Id		uuid := null;
	userSuperAdmin2Id		uuid := null;

begin
	<<the_block>>
	begin
		moodleConfig := format(moodleConfig, moodleCohort);

		if exists(select * from "Tenant" where "Id" = tenantId) then
			raise notice 'Updating tenant: %s', tenantId::text;
		
			update "Tenant" set
				"ApplicationName"	= tenantAppName,
				"SiteAddress"		= tenantSiteAddress,
				"OrganisationName"	= tenantOrgName,
				"UpdatedDate"		= current_timestamp,
				"AdminSiteAddress"	= tenantAdminSiteAddress,
				"OrganisationEmail"	= tenantOrgEmail
			where "Id" = tenantId;
		else
			raise notice 'Adding tenant: %s', tenantId::text;
			
			insert into "Tenant"
				("ApplicationName", "SiteAddress", "OrganisationName", "TenantTypeId", "InsertedDate", "UpdatedDate", "UpdatedBy", "Id", "ThemePath", "AdminSiteAddress", 
				"TestSiteAddress", "AdminTestSiteAddress", "MoodleUrl", "MoodleConfig", 
				"GoogleAnalyticsTag", "GoogleTagManager", "OrganisationEmail", "DefaultSystemSettings", "BlobStorageAddress")
			values(tenantAppName, tenantSiteAddress, tenantOrgName, 4, current_timestamp, current_timestamp, NULL, tenantId, NULL, tenantAdminSiteAddress, 
				'none', 'none', moodleSiteAddress, moodleConfig, 
				'G-533M2PK77Y', 'GTM-5VPCT46J', tenantOrgEmail, NULL, tenantBlobAddress);
		end if;

		raise notice 'Modules: enabling';
		if enableModuleCoach 				and not exists(select * from "TenantHasModule" where "TenantId" = tenantId and "ModuleId" = '72653e65-40a2-4c57-a251-0e35797b107f'::uuid) then insert into "TenantHasModule"("TenantId","ModuleId") values (tenantId, '72653e65-40a2-4c57-a251-0e35797b107f'::uuid); end if;
		if enableModuleClassroomActivities	and not exists(select * from "TenantHasModule" where "TenantId" = tenantId and "ModuleId" = '1b78f12d-e8b5-4396-a809-47744cff7688'::uuid) then insert into "TenantHasModule"("TenantId","ModuleId") values (tenantId, '1b78f12d-e8b5-4396-a809-47744cff7688'::uuid); end if;
		if enableModuleProgress				and not exists(select * from "TenantHasModule" where "TenantId" = tenantId and "ModuleId" = 'f64dadd6-a118-4624-b780-5d102a69bb58'::uuid) then insert into "TenantHasModule"("TenantId","ModuleId") values (tenantId, 'f64dadd6-a118-4624-b780-5d102a69bb58'::uuid); end if;
		if enableModuleAttendance			and not exists(select * from "TenantHasModule" where "TenantId" = tenantId and "ModuleId" = '5153ef6e-f0cf-44a4-a893-b7ef33c1cb62'::uuid) then insert into "TenantHasModule"("TenantId","ModuleId") values (tenantId, '5153ef6e-f0cf-44a4-a893-b7ef33c1cb62'::uuid); end if;
		if enableModuleCalendar				and not exists(select * from "TenantHasModule" where "TenantId" = tenantId and "ModuleId" = '1b26bda2-0519-4a88-aa52-72b5e82aa4e9'::uuid) then insert into "TenantHasModule"("TenantId","ModuleId") values (tenantId, '1b26bda2-0519-4a88-aa52-72b5e82aa4e9'::uuid); end if;
		if enableModuleTraining				and not exists(select * from "TenantHasModule" where "TenantId" = tenantId and "ModuleId" = 'e790f271-b14e-42e9-8f91-665e139aff49'::uuid) then insert into "TenantHasModule"("TenantId","ModuleId") values (tenantId, 'e790f271-b14e-42e9-8f91-665e139aff49'::uuid); end if;
		if enableModuleBusiness				and not exists(select * from "TenantHasModule" where "TenantId" = tenantId and "ModuleId" = '5f71e5fb-9c89-4559-8c9d-878de2d0a3de'::uuid) then insert into "TenantHasModule"("TenantId","ModuleId") values (tenantId, '5f71e5fb-9c89-4559-8c9d-878de2d0a3de'::uuid); end if;

		if not exists(select * from "AspNetRoles" anr where "TenantId" = tenantId) then
			raise notice 'Roles: inserting';
			insert into "AspNetRoles"
				("Id", "Name", "NormalizedName", "ConcurrencyStamp", "TenantId", "SystemName", "TenantName")
			values
				(uuid_generate_v4(), 'Administrator',	'ADMINISTRATOR',	uuid_generate_v4(), tenantId, 'Administrator',	'Administrator'),
				(uuid_generate_v4(), 'Child', 			'CHILD', 			uuid_generate_v4(), tenantId, 'Child', 			'Child'),
				(uuid_generate_v4(), 'Coach', 			'COACH', 			uuid_generate_v4(), tenantId, 'Coach', 			coachRoleName),
				(uuid_generate_v4(), 'Franchisor', 		'FRANCHISOR', 		uuid_generate_v4(), tenantId, 'Franchisor', 	'Franchisor'),
				(uuid_generate_v4(), 'Practitioner', 	'PRACTITIONER', 	uuid_generate_v4(), tenantId, 'Practitioner', 	'Practitioner'),
				(uuid_generate_v4(), 'Principal', 		'PRINCIPAL', 		uuid_generate_v4(), tenantId, 'Principal', 		'Principal'),
				(uuid_generate_v4(), 'Super Admin', 	'SUPER ADMIN', 		uuid_generate_v4(), tenantId, 'Super Admin', 	'Super Admin');
		else
			raise notice 'Roles: exists already';
		end if;
	
		if not exists (select * from "RolePermission" rp where rp."TenantId" = tenantId) then
			raise notice 'RolePermission: inserting';

			insert into "RolePermission"("RoleId", "PermissionId", "TenantId")
			select anr."Id" "RoleId", p."Id" "PermissionId",  tenantId
			from "RolePermissionWhiteLabelTemplate" t
			join "AspNetRoles" anr on t."RoleName" = anr."Name" and anr."TenantId" = tenantId
			join "Permission" p on t."PermissionName" = p."Name" and p."TenantId" is null;
		else
			raise notice 'RolePermission: exists already';
		end if;
	
		if not exists (select * from "Hierarchy" where "TenantId" = tenantId) then
			raise notice 'Hierarchy: inserting';

			hierarchyAdministratorId := uuid_generate_v4();
			hierarchyPractitionerId	 := uuid_generate_v4();
			hierarchyCoachId		 := uuid_generate_v4();
			hierarchyPrincipalId	 := uuid_generate_v4();
			hierarchyFranchisorId	 := uuid_generate_v4();
			hierarchyChildId		 := uuid_generate_v4();

			insert into "Hierarchy"
				("Id", "Type", "SystemType", "ParentId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
			values
				(hierarchyAdministratorId,	'Administrator','ECDLink.DataAccessLayer.Entities.ApplicationUser', 	'00000000-0000-0000-0000-000000000000'::uuid,	true, current_timestamp, current_timestamp, NULL, tenantId),
				(hierarchyPractitionerId,	'Practitioner',	'ECDLink.DataAccessLayer.Entities.Users.Practitioner', 	hierarchyAdministratorid, 						true, current_timestamp, current_timestamp, NULL, tenantId),
				(hierarchyCoachId, 			'Coach',		'ECDLink.DataAccessLayer.Entities.Users.Coach', 		hierarchyAdministratorid, 						true, current_timestamp, current_timestamp, NULL, tenantId),
				(hierarchyPrincipalId, 		'Principal',	'ECDLink.DataAccessLayer.Entities.Users.Principal', 	hierarchyAdministratorid, 						true, current_timestamp, current_timestamp, NULL, tenantId),
				(hierarchyFranchisorId, 	'Franchisor',	'ECDLink.DataAccessLayer.Entities.Users.Franchisor', 	hierarchyAdministratorid, 						true, current_timestamp, current_timestamp, NULL, tenantId),
				(hierarchyChildId, 			'Child',		'ECDLink.DataAccessLayer.Entities.Users.Child', 		hierarchyPractitionerId, 						true, current_timestamp, current_timestamp, NULL, tenantId);		
		else
			raise notice 'Hierarchy: exists already';
		end if;
	
		if not exists (select * from "SystemSetting" ss where "TenantId" = tenantId) then 
			raise notice 'SystemSetting: inserting';

			insert into "SystemSetting"
			("Id", "Grouping", "FullPath", "Name", "Value", "IsSystemValue", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
			select uuid_generate_v4(), "Grouping", "FullPath", "Name", "Value", true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null, "TenantId"
			from
			(
			          select null "TenantId", '' "Grouping",							'' "FullPath",													'' "Name",						'' "Value"
				union select tenantId, 'General.AbsenteeCutoffDelay', 				'General.AbsenteeCutoffDelay', 									'AbsenteeCutoffDelay', 			'24'
				union select tenantId, 'General.Analytics.Google', 					'General.Analytics.Google.DashboardGoogleReport', 				'DashboardGoogleReport', 		''
				union select tenantId, 'General.Analytics.Google', 					'General.Analytics.Google.GoogleAnalyticsTag', 					'GoogleAnalyticsTag',			''
				union select tenantId, 'General.Analytics.Google', 					'General.Analytics.Google.GoogleTagManager', 					'GoogleTagManager',				''
				union select tenantId, 'General.Analytics.Grafana', 				'General.Analytics.Grafana.GeneralDashboard', 					'GeneralDashboard',				'https://dashboard.ecdconnect.co.za/d/jYvjqbrSk/wl-general'
				union select tenantId, 'General.Azure', 							'General.Azure.BlobStorageConnection', 							'BlobStorageConnection', 		'DefaultEndpointsProtocol=https;AccountName=ecdconnectstoragesa;AccountKey=yO/4KL4za40ZUWqFfx2LVAHY24dnSXBFK0CAkl7HFe4u1RXHFdSZPjV8+GGy9uHrJUL7rLgzYCB9+AStsA+3cg==;EndpointSuffix=core.windows.net'
				union select tenantId, 'General.Callback.Invitations', 				'General.Callback.Invitations.AdminSignup', 					'AdminSignup', 					concat('https://',tenantAdminSiteAddress,'/register/')
				union select tenantId, 'General.Callback.Invitations', 				'General.Callback.Invitations.PreSchoolInvitation', 			'PreSchoolInvitation', 			concat('https://',tenantSiteAddress,'/sign-up')
				union select tenantId, 'General.Callback.Invitations', 				'General.Callback.Invitations.PrincipalSignup', 				'PrincipalSignup', 				concat('https://',tenantSiteAddress,'/sign-up')
				union select tenantId, 'General.Callback.Invitations', 				'General.Callback.Invitations.Signup', 							'Signup', 						concat('https://',tenantSiteAddress,'/sign-up')
				union select tenantId, 'General.Callback.Security', 	 			'General.Callback.Security.ForgotPassword', 					'ForgotPassword', 				concat('https://',tenantSiteAddress,'/new-password')
				union select tenantId, 'General.Callback.Security', 	 			'General.Callback.Security.ForgotPasswordPortal', 				'ForgotPasswordPortal', 		concat('https://',tenantSiteAddress,'/reset')
				union select tenantId, 'General.Callback.Security', 	 			'General.Callback.Security.Login', 								'Login', 						concat('https://',tenantSiteAddress,'/')
				union select tenantId, 'General.Children', 			 				'General.Children.ChildExpiryTime', 							'ChildExpiryTime', 				'30'
				union select tenantId, 'General.Children', 			 				'General.Children.ChildInitialObservationPeriod', 				'ChildInitialObservationPeriod','30'
				union select tenantId, 'General.IncomeStatementSubmitEnd', 			'General.IncomeStatementSubmitEnd', 							'IncomeStatementSubmitEnd', 	'8'
				union select tenantId, 'General.IncomeStatementSubmitStart', 		'General.IncomeStatementSubmitStart', 							'IncomeStatementSubmitStart', 	'25'
				union select tenantId, 'General.IntegrationDelay', 					'General.IntegrationDelay', 									'IntegrationDelay', 			'24'
				union select tenantId, 'General.InvitationCutoffDelay', 			'General.InvitationCutoffDelay', 								'InvitationCutoffDelay', 		'24'
				union select tenantId, 'General.Proxies.Holiday.RapidApi', 			'General.Proxies.Holiday.RapidApi.BaseUrl', 					'BaseUrl', 						'https://public-holiday.p.rapidapi.com'
				union select tenantId, 'General.Proxies.Holiday.RapidApi',  		'General.Proxies.Holiday.RapidApi.Host', 						'Host', 						'public-holiday.p.rapidapi.com'
				union select tenantId, 'General.Proxies.Holiday.RapidApi', 			'General.Proxies.Holiday.RapidApi.Key', 						'Key', 							'009dc003f1msh944339ef459b1acp15b130jsnf7d7698b0526'
				union select tenantId, 'General.Proxies.Holiday.RapidApi', 			'General.Proxies.Holiday.RapidApi.Name', 						'Name', 						'RapidApi'
				union select tenantId, 'General.Proxies.Integration.SmartLinkApi', 	'General.Proxies.Integration.SmartLinkApi.BaseUrl', 			'BaseUrl', 						''
				union select tenantId, 'General.Proxies.Integration.SmartLinkApi', 	'General.Proxies.Integration.SmartLinkApi.Key', 				'Key', 							''
				union select tenantId, 'General.Proxies.Integration.SmartLinkApi', 	'General.Proxies.Integration.SmartLinkApi.MaskDataEmail', 		'MaskDataEmail', 				''
				union select tenantId, 'General.Proxies.Integration.SmartLinkApi', 	'General.Proxies.Integration.SmartLinkApi.MaskDataIdNumber', 	'MaskDataIdNumber', 			''
				union select tenantId, 'General.Proxies.Integration.SmartLinkApi', 	'General.Proxies.Integration.SmartLinkApi.MaskDataMode', 		'MaskDataMode', 				''
				union select tenantId, 'General.Proxies.Integration.SmartLinkApi', 	'General.Proxies.Integration.SmartLinkApi.MaskDataNumber', 		'MaskDataNumber', 				''
				union select tenantId, 'General.Proxies.Integration.SmartLinkApi', 	'General.Proxies.Integration.SmartLinkApi.Mode', 				'Mode', 						'None'
				union select tenantId, 'General.Proxies.UrlShortner', 				'General.Proxies.UrlShortner.RedirectUrl', 						'RedirectUrl', 					concat('https://',backendAddress)
				union select tenantId, 'General.Reporting', 						'General.Reporting.ChildProgressReportMonths', 					'ChildProgressReportMonths', 	'6, 12'
				union select tenantId, 'General.SyncDelay', 						'General.SyncDelay', 											'SyncDelay', 					'30'
				union select tenantId, 'Notifications.EmailProviders.Smtp', 		'Notifications.EmailProviders.Smtp.FromEmail', 					'FromEmail', 					tenantOrgEmail
				union select tenantId, 'Notifications.EmailProviders.Smtp', 		'Notifications.EmailProviders.Smtp.FromEmailDisplayName', 		'FromEmailDisplayName', 		tenantAppName
				union select tenantId, 'Notifications.EmailProviders.Smtp', 		'Notifications.EmailProviders.Smtp.Password', 					'Password', 					'ck7N6H45D2R78@3q^4NJf'
				union select tenantId, 'Notifications.EmailProviders.Smtp', 		'Notifications.EmailProviders.Smtp.RetryCount', 				'RetryCount', 					'2'
				union select tenantId, 'Notifications.EmailProviders.Smtp', 		'Notifications.EmailProviders.Smtp.RetryWaitMiliseconds', 		'RetryWaitMiliseconds', 		'300'
				union select tenantId, 'Notifications.EmailProviders.Smtp', 		'Notifications.EmailProviders.Smtp.SmtpServerAddress', 			'SmtpServerAddress', 			'za-smtp-outbound-1.mimecast.co.za'
				union select tenantId, 'Notifications.EmailProviders.Smtp', 		'Notifications.EmailProviders.Smtp.SmtpServerPort', 			'SmtpServerPort', 				'587'
				union select tenantId, 'Notifications.EmailProviders.Smtp', 		'Notifications.EmailProviders.Smtp.SmtpServerSecondaryAddress', 'SmtpServerSecondaryAddress', 	'za-smtp-outbound-2.mimecast.co.za'
				union select tenantId, 'Notifications.EmailProviders.Smtp', 		'Notifications.EmailProviders.Smtp.SmtpServerSecondaryPort', 	'SmtpServerSecondaryPort', 		'0'
				union select tenantId, 'Notifications.EmailProviders.Smtp', 		'Notifications.EmailProviders.Smtp.SmtpServerUseTLS', 			'SmtpServerUseTLS',				'true'
				union select tenantId, 'Notifications.EmailProviders.Smtp', 		'Notifications.EmailProviders.Smtp.Username', 					'Username', 					'no-reply@ecdconnect.co.za'
				union select tenantId, 'Notifications.SMSProviders.BulkSms', 		'Notifications.SMSProviders.BulkSms.BaseUrl', 					'BaseUrl', 						'https://api.bulksms.com/v1/'
				union select tenantId, 'Notifications.SMSProviders.BulkSms', 		'Notifications.SMSProviders.BulkSms.BasicAuthToken', 			'BasicAuthToken', 				smsProviderBulkSMSTokenBasicAuth
				union select tenantId, 'Notifications.SMSProviders.BulkSms', 		'Notifications.SMSProviders.BulkSms.Name', 						'Name', 						''
				union select tenantId, 'Notifications.SMSProviders.BulkSms', 		'Notifications.SMSProviders.BulkSms.TokenId', 					'TokenId', 						smsProviderBulkSMSTokenID
				union select tenantId, 'Notifications.SMSProviders.BulkSms', 		'Notifications.SMSProviders.BulkSms.TokenSecret', 				'TokenSecret', 					smsProviderBulkSMSTokenSecret
				union select tenantId, 'Notifications.SMSProviders.iTouch', 		'Notifications.SMSProviders.iTouch.BaseUrl', 					'BaseUrl', 						'https://iweb.itouch.co.za'
				union select tenantId, 'Notifications.SMSProviders.iTouch', 		'Notifications.SMSProviders.iTouch.Password', 					'Password', 					smsProviderITouchUsername
				union select tenantId, 'Notifications.SMSProviders.iTouch', 		'Notifications.SMSProviders.iTouch.Username', 					'Username', 					smsProviderITouchPassword
				union select tenantId, 'Notifications.SMSProviders.SMSPortal', 		'Notifications.SMSProviders.SMSPortal.ApiKey', 					'ApiKey', 						smsProviderSMSPortalAPIKey
				union select tenantId, 'Notifications.SMSProviders.SMSPortal', 		'Notifications.SMSProviders.SMSPortal.ApiSecret', 				'ApiSecret', 					smsProviderSMSPortalAPISecret
				union select tenantId, 'Notifications.SMSProviders.SMSPortal', 		'Notifications.SMSProviders.SMSPortal.BaseUrl', 				'BaseUrl', 						'https://rest.smsportal.com'
				union select tenantId, 'Notifications.SMSProviders.Sms', 			'Notifications.SMSProviders.Sms.Provider', 						'Provider', 					concat('Notifications.SMSProviders.',smsProvider)
				union select tenantId, 'Security.Jwts', 							'Security.Jwts.LongJwtLifespan', 								'LongJwtLifespan', 				'800'
				union select tenantId, 'Security.Jwts', 							'Security.Jwts.ShortJwtLifespan', 								'ShortJwtLifespan', 			'60'
				union select tenantId, 'Security.Tokens', 							'Security.Tokens.InvitationLinkExpiry', 						'InvitationLinkExpiry', 		'24'
				union select tenantId, 'Security.Tokens', 							'Security.Tokens.OpenAccessInvitationExpiry',					'OpenAccessInvitationExpiry', 	'800'
			) v 
			where v."TenantId" is not null;
		else 
			raise notice 'SystemSetting: exists already';
		end if;
	
-- creating super admins
		if not exists (select * from "AspNetUsers" where "UserName" like '%SuperAdmin%' and "TenantId" = tenantId) then 
			raise notice 'Users: inserting';
		
			userSuperAdmin1Id := uuid_generate_v4();
			userSuperAdmin2Id := uuid_generate_v4();
		
			INSERT INTO "AspNetUsers"
			("Id", "RaceId", "GenderId", "UserName", "NormalizedUserName", "Email", "NormalizedEmail", "EmailConfirmed", "PhoneNumber", "PhoneNumberConfirmed", "TwoFactorEnabled", 
			"LockoutEnd", "LockoutEnabled", "AccessFailedCount", "PasswordHash", "SecurityStamp", "ConcurrencyStamp", 
			"IsSouthAfricanCitizen", "IdNumber", "VerifiedByHomeAffairs", "DateOfBirth", "FirstName", "Surname", "FullName", "ContactPreference", "ProfileImageUrl", "IsActive", 
			"LastSeen", "NickFirstName", "NickSurname", "NickFullName", "TenantId", "EmergencyContactPhoneNumber", "EmergencyContactFirstName", "EmergencyContactSurname", "LanguageId", 
			"PendingEmail", "PendingPhoneNumber", "WhatsAppNumber", "PreferredCommunicationLanguage", "NextOfKinFirstName", "NextOfKinSurname", "NextOfKinContactNumber", "IsImported", 
			"EmergencyContactFullName", "ReasonForLeaving", "ReasonForLeavingComments", "InsertedDate", "UpdatedDate", "ResetData", "RegisterType")
			values
			(userSuperAdmin1Id, NULL, NULL, userSuperAdmin1UserName, UPPER(userSuperAdmin1UserName), userSuperAdmin1Email, UPPER(userSuperAdmin1Email), true, NULL, false, false, 
			NULL, true, 0, 'AQAAAAIAAYagAAAAEKfqrFHTSXdvvw1+hULaH19dEc6HQq5GJnynylbZt/74S5BoD+NRgGOKtCjay22YFg==', 'COT6OQQLVH3EU6O24XYZ7UTQRVWL3NUK', 'abbf661f-2381-4984-a891-4b2e64c6835c', 
			true, NULL, true, '2024-01-01 22:00:00', 'Super', 'Admin1', 'Super Admin1', 'email', NULL, true, 
			'1900-01-01 00:00:00', NULL, NULL, NULL, tenantId, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 
			current_timestamp, current_timestamp, false, 'UserName');	
	
			INSERT INTO "AspNetUsers"
			("Id", "RaceId", "GenderId", "UserName", "NormalizedUserName", "Email", "NormalizedEmail", "EmailConfirmed", "PhoneNumber", "PhoneNumberConfirmed", "TwoFactorEnabled", 
			"LockoutEnd", "LockoutEnabled", "AccessFailedCount", "PasswordHash", "SecurityStamp", "ConcurrencyStamp", 
			"IsSouthAfricanCitizen", "IdNumber", "VerifiedByHomeAffairs", "DateOfBirth", "FirstName", "Surname", "FullName", "ContactPreference", "ProfileImageUrl", "IsActive", 
			"LastSeen", "NickFirstName", "NickSurname", "NickFullName", "TenantId", "EmergencyContactPhoneNumber", "EmergencyContactFirstName", "EmergencyContactSurname", "LanguageId", 
			"PendingEmail", "PendingPhoneNumber", "WhatsAppNumber", "PreferredCommunicationLanguage", "NextOfKinFirstName", "NextOfKinSurname", "NextOfKinContactNumber", "IsImported", 
			"EmergencyContactFullName", "ReasonForLeaving", "ReasonForLeavingComments", "InsertedDate", "UpdatedDate", "ResetData", "RegisterType")
			values
			(userSuperAdmin2Id, NULL, NULL, userSuperAdmin2UserName, UPPER(userSuperAdmin2UserName), userSuperAdmin2Email, UPPER(userSuperAdmin2Email), true, NULL, false, false, 
			NULL, true, 0, 'AQAAAAIAAYagAAAAEKfqrFHTSXdvvw1+hULaH19dEc6HQq5GJnynylbZt/74S5BoD+NRgGOKtCjay22YFg==', 'COT6OQQLVH3EU6O24XYZ7UTQRVWL3NUK', 'abbf661f-2381-4984-a891-4b2e64c6835c', 
			true, NULL, true, '2024-01-01 22:00:00', 'Super', 'Admin2', 'Super Admin2', 'email', NULL, true, 
			'1900-01-01 00:00:00', NULL, NULL, NULL, tenantId, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 
			current_timestamp, current_timestamp, false, 'UserName');	
		else
			raise notice 'Users: exist already';
			userSuperAdmin1Id := (select "Id" from "AspNetUsers" where "TenantId" = tenantId and "UserName" = userSuperAdmin1UserName);
			userSuperAdmin2Id := (select "Id" from "AspNetUsers" where "TenantId" = tenantId and "UserName" = userSuperAdmin2UserName);
		end if;
	
-- assigning roles
		raise notice 'Users: assigning/updating roles';

		insert into "AspNetUserRoles"("UserId", "RoleId", "TenantId")	
		select u."UserId", anr."Id", anr."TenantId"
		from (select userSuperAdmin1Id "UserId" union select userSuperAdmin2Id) u
		join "AspNetRoles" anr on anr."TenantId" = tenantId and anr."Name" = 'Super Admin'
		left join "AspNetUserRoles" anur on anur."UserId" = u."UserId" and anr."Id" = anur."RoleId" 
		where anur."UserId" is null;
	
-- updating user hierarchy
		raise notice 'Users: insert UserHierarchy';
		
		insert into "UserHierarchy"
			("Id", "ParentId", "UserId", "UserType", "NamedTypePath", "Hierarchy", "Key", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
		select uuid_generate_v4(), u."UserId", u."UserId", 'Administrator', 'System.Administrator', '0.1.', 1, true, current_timestamp, current_timestamp, null, tenantId
		from (select userSuperAdmin1Id "UserId" union select userSuperAdmin2Id) u
		left join "UserHierarchy" uh on uh."UserId" = u."UserId"
		where uh."Id" is null;
	
	end;
end $$;

-- rollback;
commit;
