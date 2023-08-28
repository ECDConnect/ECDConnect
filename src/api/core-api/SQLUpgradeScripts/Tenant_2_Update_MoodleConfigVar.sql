do $$
begin
	if current_database() = 'ECDConnectDev' then
		update "Tenant"
		set "MoodleConfigVar" = '{"userTypes":[{"userType":"*","cohorts":[]}],"database":{"type":"postgres","connectionString":"Server=ecdlink-pgsql-dev-za.postgres.database.azure.com;Database=moodle;Port=5432;User Id=ecdlinkadmin@ecdlink-pgsql-dev-za;Password=3DeL4Tc@dqQM7d6E;Ssl Mode=VerifyFull;"},"site":{"address":"https://moodle.ecdlink.co.za","defaultPassword":"Test@1234","userNameFormatString":"{0:IdNumber}","emailFormatString":"{0:IdNumber}@ecdconnect.co.za"}}',
			"MoodleUrlVar" = 'https://moodle.ecdlink.co.za'
		where "ApplicationName" not in ('GrowGreat', 'Funda');
		update "Tenant"
		set "MoodleConfigVar" = '{"userTypes":[{"userType":"*","cohorts":["UI  Smart Start PR","Smart Start"]}],"database":{"type":"postgres","connectionString":"Server=ecdlink-pgsql-dev-za.postgres.database.azure.com;Database=moodle;Port=5432;User Id=ecdlinkadmin@ecdlink-pgsql-dev-za;Password=3DeL4Tc@dqQM7d6E;Ssl Mode=VerifyFull;"},"site":{"address":"https://moodle.ecdlink.co.za","defaultPassword":"Test@1234","userNameFormatString":"{0:IdNumber}@ecdconnect.co.za","emailFormatString":"{0:IdNumber}@ecdconnect.co.za"}}',
			"MoodleUrlVar" = 'https://moodle.ecdlink.co.za'
		where "ApplicationName" in ('Funda');
		update "Tenant"
		set "MoodleConfigVar" = '{"userTypes":[{"userType":"*","cohorts":["UI Grow Great PR","Grow Great"]}],"database":{"type":"postgres","connectionString":"Server=ecdlink-pgsql-dev-za.postgres.database.azure.com;Database=moodle;Port=5432;User Id=ecdlinkadmin@ecdlink-pgsql-dev-za;Password=3DeL4Tc@dqQM7d6E;Ssl Mode=VerifyFull;"},"site":{"address":"https://moodle.ecdlink.co.za","defaultPassword":"Test@1234","userNameFormatString":"{0:IdNumber}@ecdconnect.co.za","emailFormatString":"{0:IdNumber}@ecdconnect.co.za"}}',
			"MoodleUrlVar" = 'https://moodle.ecdlink.co.za'
		where "ApplicationName" in ('GrowGreat');
	end if;
	if current_database() = 'ECDConnectQA' then
		update "Tenant"
		set "MoodleConfigVar" = '{"userTypes":[{"userType":"*","cohorts":[]}],"database":{"type":"postgres","connectionString":"Server=ecdlink-pgsql-dev-za.postgres.database.azure.com;Database=moodle;Port=5432;User Id=ecdlinkadmin@ecdlink-pgsql-dev-za;Password=3DeL4Tc@dqQM7d6E;Ssl Mode=VerifyFull;"},"site":{"address":"https://moodle.ecdlink.co.za","defaultPassword":"Test@1234","userNameFormatString":"{0:IdNumber}","emailFormatString":"{0:IdNumber}@ecdconnect.co.za"}}',
			"MoodleUrlVar" = 'https://moodle.ecdlink.co.za'
		where "ApplicationName" not in ('GrowGreat', 'Funda');
		update "Tenant"
		set "MoodleConfigVar" = '{"userTypes":[{"userType":"*","cohorts":["UI  Smart Start PR","Smart Start"]}],"database":{"type":"postgres","connectionString":"Server=ecdlink-pgsql-dev-za.postgres.database.azure.com;Database=moodle;Port=5432;User Id=ecdlinkadmin@ecdlink-pgsql-dev-za;Password=3DeL4Tc@dqQM7d6E;Ssl Mode=VerifyFull;"},"site":{"address":"https://moodle.ecdlink.co.za","defaultPassword":"Test@1234","userNameFormatString":"{0:IdNumber}@ecdconnect.co.za","emailFormatString":"{0:IdNumber}@ecdconnect.co.za"}}',
			"MoodleUrlVar" = 'https://moodle.ecdlink.co.za'
		where "ApplicationName" in ('Funda');
		update "Tenant"
		set "MoodleConfigVar" = '{"userTypes":[{"userType":"*","cohorts":["UI Grow Great PR","Grow Great"]}],"database":{"type":"postgres","connectionString":"Server=ecdlink-pgsql-dev-za.postgres.database.azure.com;Database=moodle;Port=5432;User Id=ecdlinkadmin@ecdlink-pgsql-dev-za;Password=3DeL4Tc@dqQM7d6E;Ssl Mode=VerifyFull;"},"site":{"address":"https://moodle.ecdlink.co.za","defaultPassword":"Test@1234","userNameFormatString":"{0:IdNumber}@ecdconnect.co.za","emailFormatString":"{0:IdNumber}@ecdconnect.co.za"}}',
			"MoodleUrlVar" = 'https://moodle.ecdlink.co.za'
		where "ApplicationName" in ('GrowGreat');
	end if;
	if current_database() = 'ecdconnect' then
		update "Tenant"
		set "MoodleConfigVar" = '{"userTypes":[{"userType":"*","cohorts":[]}],"database":{"type":"postgres","connectionString":"Server=ecdlink-pgsql-dev-za.postgres.database.azure.com;Database=moodle;Port=5432;User Id=ecdlinkadmin@ecdlink-pgsql-dev-za;Password=3DeL4Tc@dqQM7d6E;Ssl Mode=VerifyFull;"},"site":{"address":"https://moodle.ecdlink.co.za","defaultPassword":"Test@1234","userNameFormatString":"{0:IdNumber}","emailFormatString":"{0:IdNumber}@ecdconnect.co.za"}}',
			"MoodleUrlVar" = 'https://moodle.ecdlink.co.za'
		where "ApplicationName" not in ('GrowGreat', 'Funda');
		update "Tenant"
		set "MoodleConfigVar" = '{"userTypes":[{"userType":"*","cohorts":["UI  Smart Start PR","Smart Start"]}],"database":{"type":"postgres","connectionString":"Server=ecdlink-pgsql-dev-za.postgres.database.azure.com;Database=moodle;Port=5432;User Id=ecdlinkadmin@ecdlink-pgsql-dev-za;Password=3DeL4Tc@dqQM7d6E;Ssl Mode=VerifyFull;"},"site":{"address":"https://moodle.ecdlink.co.za","defaultPassword":"Test@1234","userNameFormatString":"{0:IdNumber}@ecdconnect.co.za","emailFormatString":"{0:IdNumber}@ecdconnect.co.za"}}',
			"MoodleUrlVar" = 'https://moodle.ecdlink.co.za'
		where "ApplicationName" in ('Funda');
		update "Tenant"
		set "MoodleConfigVar" = '{"userTypes":[{"userType":"*","cohorts":["UI Grow Great PR","Grow Great"]}],"database":{"type":"postgres","connectionString":"Server=ecdlink-pgsql-dev-za.postgres.database.azure.com;Database=moodle;Port=5432;User Id=ecdlinkadmin@ecdlink-pgsql-dev-za;Password=3DeL4Tc@dqQM7d6E;Ssl Mode=VerifyFull;"},"site":{"address":"https://moodle.ecdlink.co.za","defaultPassword":"Test@1234","userNameFormatString":"{0:IdNumber}@ecdconnect.co.za","emailFormatString":"{0:IdNumber}@ecdconnect.co.za"}}',
			"MoodleUrlVar" = 'https://moodle.ecdlink.co.za'
		where "ApplicationName" in ('GrowGreat');
	end if;
end $$

