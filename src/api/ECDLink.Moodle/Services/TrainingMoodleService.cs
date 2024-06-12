using ECDLink.Core.Services.Interfaces;
using ECDLink.Moodle.Models;
using ECDLink.Tenancy.Context;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using Newtonsoft.Json;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Entities.Training;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Entities;
using Microsoft.Extensions.Logging;

namespace EcdLink.Api.CoreApi.Services.Training
{
    public class TrainingService : ITrainingService
    {
        private readonly IConfiguration _configuration;
        private readonly MoodleConfig _config;
        private readonly IGenericRepositoryFactory _repoFactory;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly Guid _adminUserId;
        private readonly ApplicationUserManager _userManager;
        private readonly ILogger<TrainingService> _logger;

        public TrainingService(IConfiguration configuration, IGenericRepositoryFactory repoFactory, HierarchyEngine hierarchyEngine, ApplicationUserManager userManager, ILogger<TrainingService> logger)
        {
            _configuration = configuration;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _adminUserId = _hierarchyEngine.GetAdminUserId().GetValueOrDefault();
            _userManager = userManager;
            _logger = logger;

            string moodleConfigVar = TenantExecutionContext.Tenant.MoodleConfig;
            if (!string.IsNullOrEmpty(moodleConfigVar))
            {
                _config = JsonConvert.DeserializeObject<MoodleConfig>(moodleConfigVar);
            }
        }

        public bool Enabled
        {
            get
            {
                return !string.IsNullOrEmpty(TenantExecutionContext.Tenant.MoodleUrl) && _config != null;
            }
        }

        public async Task<bool> CreateUserAsync(ApplicationIdentityUser _user)
        {
            var user = new MoodleUser()
            {
                UserName = _user.Id.ToString(),
                Password = _config.Site.DefaultPassword,
                IdNumber = _user.IdNumber,
                Firstname = _user.FirstName,
                Lastname = _user.Surname,
                Email = $"{_user.Id.ToString()}@ecdconnect.co.za",
                Phone1 = string.IsNullOrEmpty(_user.PhoneNumber) ? "" : _user.PhoneNumber
            };

            var cohorts = new List<string>();
            var allCohorts = _config.UserTypes.First(x => x.UserType == "*").Cohorts;
            foreach (var cohort in allCohorts)
            {
                cohorts.Add(cohort);
            }

            if (cohorts.Count == 0)
            {
                return false;
            }

            await using var conn = new NpgsqlConnection(GetConnectionString());
            await conn.OpenAsync();

            // First see if record already exists
            long userId = await GetMoodleUserId(conn, user.UserName);

            DateTimeOffset dto = new DateTimeOffset(DateTime.Now);
            long timestamp = dto.ToUnixTimeSeconds();

            // Add if new user
            if (userId == -1)
            {
                userId = await InsertMoodleUserId(conn, user);
            }

            foreach (var cohortName in cohorts)
            {
                // get cohort id
                long cohortId = await GetMoodleCohortId(conn, cohortName);
                if (cohortId == -1) continue;

                long cohortMemberId = await GetMoodleCohortMemberId(conn, cohortId, userId, timestamp);

                // Add the cohort member record if not existed
                if (cohortMemberId == -1)
                {
                    await InsertMoodleCohortMemberId(conn, userId, cohortId, timestamp);
                }
            }

            if (cohorts.Count > 0)
            {
                await EnrolUserToCohortCourses(conn, userId, timestamp);
            }

            conn.Close();

            return true;
        }

        /*
        public async Task<string> CreateUserSessionAsync(string userName)
        {
            await using var conn = new NpgsqlConnection(GetConnectionString());
            await conn.OpenAsync();

            long userId = await GetMoodleUserId(conn, userName);
            if (userId == -1) return "";

            string dbSessionId = await GetMoodleSessionId(conn, userId);

            var sessionId = Guid.NewGuid().ToString();
            if (userId >= 0 && dbSessionId == "")
            {
                DateTimeOffset dto = new DateTimeOffset(DateTime.Now);
                var unixTimeStamp = dto.ToUnixTimeSeconds();

                await using var cmd = new NpgsqlCommand("INSERT INTO public.mdl_sessions" +
                    "(sid, userid, timecreated, timemodified)" +
                    "VALUES((@sessionId),(@userId),(@unixTimeStamp),(@unixTimeStamp))" +
                    "RETURNING sid",
                    conn)
                {
                    Parameters =
                    {
                        new NpgsqlParameter("sessionId", sessionId),
                        new NpgsqlParameter("userId", userId),
                        new NpgsqlParameter("unixTimeStamp", unixTimeStamp),
                    }
                };

                await cmd.ExecuteNonQueryAsync();
            }
            else
            {
                sessionId = dbSessionId;
            }

            conn.Close();

            return sessionId;
        }
        */

        private string GetConnectionString()
        {
            string connectionString = ConfigurationExtensions.GetConnectionString(_configuration, "MoodleConnectionString");
            if (_config.Database != null && !string.IsNullOrEmpty(_config.Database.ConnectionString))
                connectionString = _config.Database.ConnectionString;
            return connectionString;
        }

        private async Task<long> GetMoodleUserId(NpgsqlConnection conn, string name)
        {
            await using var cmd = new NpgsqlCommand("SELECT id FROM public.mdl_user where userName = (@userName)", conn)
            {
                Parameters = { new NpgsqlParameter("userName", name) }
            };
            await using var reader = await cmd.ExecuteReaderAsync();

            long userId = -1;
            while (await reader.ReadAsync())
            {
                userId = reader.GetInt64(0);
            }
            reader.Close();
            return userId;
        }

        private async Task<long> InsertMoodleUserId(NpgsqlConnection conn, MoodleUser user)
        {
            DateTimeOffset dto = new DateTimeOffset(DateTime.Now);
            var unixTimeStamp = dto.ToUnixTimeSeconds();

            await using var cmd = new NpgsqlCommand("INSERT INTO public.mdl_user" +
                "(confirmed, mnethostid, username, password, idnumber, firstname, lastname, email, phone1, country, timezone, description, timecreated, timemodified, imagealt, lastnamephonetic, firstnamephonetic, middlename, alternatename, moodlenetprofile)" +
                "VALUES((@Confirmed),(@Mnethostid),(@UserName),(@Password),(@IdNumber),(@Firstname),(@Lastname),(@Email),(@Phone1),(@Country),(@Timezone),(''),(@TimeCreated),(@TimeModified),(''),(''),(''),(''),(''),(''));",
                conn)
            {
                Parameters =
                    {
                        new NpgsqlParameter("Confirmed", user.Confirmed),
                        new NpgsqlParameter("Mnethostid", user.Mnethostid),
                        new NpgsqlParameter("UserName", user.UserName),
                        new NpgsqlParameter("Password", "$2y$10$NC4irSPAfnZHUN8HjWXD8e9.MotF0pGqZq6KDPtbfbUquHOQplQbq"),
                        new NpgsqlParameter("IdNumber", user.IdNumber),
                        new NpgsqlParameter("Firstname", user.Firstname),
                        new NpgsqlParameter("Lastname", user.Lastname),
                        new NpgsqlParameter("Email", user.Email),
                        new NpgsqlParameter("Phone1", user.Phone1),
                        new NpgsqlParameter("Country", user.Country),
                        new NpgsqlParameter("Timezone", user.Timezone),
                        new NpgsqlParameter("TimeCreated", unixTimeStamp),
                        new NpgsqlParameter("TimeModified", unixTimeStamp)
                    }
            };
            await cmd.ExecuteNonQueryAsync();

            long userId = await GetMoodleUserId(conn, user.UserName);
            return userId;
        }

        private async Task<long> GetMoodleCohortId(NpgsqlConnection conn, string name)
        {
            await using var cmd = new NpgsqlCommand("SELECT id FROM public.mdl_cohort where name = (@cohortName) or idnumber = (@cohortName)", conn)
            {
                Parameters = { new NpgsqlParameter("cohortName", name) }
            };
            await using var reader = await cmd.ExecuteReaderAsync();

            long cohortId = -1;
            while (await reader.ReadAsync())
            {
                cohortId = reader.GetInt64(0);
            }
            reader.Close();

            return cohortId;
        }

        private async Task InsertMoodleCohortMemberId(NpgsqlConnection conn, long userId, long cohortId, long timestamp = 0)
        {
            if (timestamp == 0)
            {
                DateTimeOffset dto = new DateTimeOffset(DateTime.Now);
                timestamp = dto.ToUnixTimeSeconds();
            }

            await using var cmd = new NpgsqlCommand("INSERT INTO public.mdl_cohort_members" +
                "(cohortid, userid, timeadded)" +
                "VALUES((@cohortId),(@userId),(@unixTimeStamp))",
                conn)
            {
                Parameters =
                        {
                            new NpgsqlParameter("cohortId", cohortId),
                            new NpgsqlParameter("userId", userId),
                            new NpgsqlParameter("unixTimeStamp", timestamp),
                        }
            };

            await cmd.ExecuteNonQueryAsync();
        }

        private async Task<long> GetMoodleCohortMemberId(NpgsqlConnection conn, long cohortId, long userId, long timestamp = 0)
        {
            if (timestamp == 0)
            {
                DateTimeOffset dto = new DateTimeOffset(DateTime.Now);
                timestamp = dto.ToUnixTimeSeconds();
            }

            await using var cmd = new NpgsqlCommand("SELECT id FROM public.mdl_cohort_members where cohortid = (@cohortId) and userid = (@userId)", conn)
            {
                Parameters = {
                    new NpgsqlParameter("cohortId", cohortId),
                    new NpgsqlParameter("userId", userId)
                }

            };
            await using var reader = await cmd.ExecuteReaderAsync();

            long cohortMemberId = -1;
            while (await reader.ReadAsync())
            {
                cohortMemberId = reader.GetInt64(0);
            }
            reader.Close();

            return cohortMemberId;
        }

        private async Task EnrolUserToCohortCourses(NpgsqlConnection conn, long userId, long timestamp = 0)
        {
            if (timestamp == 0)
            {
                DateTimeOffset dto = new DateTimeOffset(DateTime.Now);
                timestamp = dto.ToUnixTimeSeconds();
            }

            await using var cmd = new NpgsqlCommand(@"
insert into public.mdl_user_enrolments
(status, enrolid, userid, timestart, timeend, modifierid, timecreated, timemodified)
select 0, me.id, mcm.userid, 0, 0, 2, @timestamp, @timestamp
from public.mdl_user mu
join public.mdl_cohort_members mcm on mcm.userid = mu.id
join public.mdl_enrol me on me.enrol = 'cohort' and mcm.cohortid = me.customint1
left join public.mdl_user_enrolments mue on mue.enrolid = me.id and mue.userid = mcm.userid
where mu.id = @userId
    and mue.id  is null;
                ",
            conn)
            {
                Parameters =
                    {
                        new NpgsqlParameter("userId", userId),
                        new NpgsqlParameter("timestamp", timestamp),
                    }
            };

            await cmd.ExecuteNonQueryAsync();
        }

        private async Task<string> GetMoodleSessionId(NpgsqlConnection conn, long userId)
        {
            await using var cmd = new NpgsqlCommand("SELECT sid FROM public.mdl_sessions where userid = (@userId)", conn)
            {
                Parameters = { new NpgsqlParameter("userId", userId) }
            };
            await using var reader = await cmd.ExecuteReaderAsync();

            string dbSessionId = "";
            while (await reader.ReadAsync())
            {
                dbSessionId = reader.GetString(0);
            }
            reader.Close();

            return dbSessionId;
        }

        public async Task SyncCompletedCourses()
        {
            if (!Enabled) return;

            try
            {
                var userMap = new Dictionary<string, Guid?>();

                var userTrainingCourseRepo = _repoFactory.CreateGenericRepository<UserTrainingCourse>(userContext: _adminUserId);

                DateTime lastInserted = userTrainingCourseRepo.GetAll().OrderByDescending(x => x.CompletedDate).Select(x => x.CompletedDate).FirstOrDefault();
                var fromCompletedDate = lastInserted == DateTime.MinValue ? new DateTime(2023, 1, 1) : lastInserted;
                long fromCompleted = new DateTimeOffset(fromCompletedDate).ToUnixTimeSeconds();
                _logger.LogInformation("Fetching moodle completed course info from '{0}' {1}", fromCompletedDate, fromCompleted);

                var cohorts = _config.UserTypes.First(x => x.UserType == "*").Cohorts;
                if (cohorts.Length == 0) return;
                var inCohorts = "'" + string.Join("','", cohorts) + "'";

                await using var conn = new NpgsqlConnection(GetConnectionString());
                await conn.OpenAsync();

                await using var cmd = new NpgsqlCommand($@"
select mc.name cohort, mu.username, mu.email, course.fullname course, compl.timeenrolled, compl.timestarted, compl.timecompleted
from mdl_course_completions compl
join mdl_course course on compl.course = course.id
join mdl_user mu on compl.userid = mu.id 
join mdl_cohort_members mcm on mu.id = mcm.userid 
join mdl_cohort mc on mcm.cohortid = mc.id 
where (mc.idnumber in ({inCohorts}) or mc.name in ({inCohorts}))
    and compl.timecompleted > (@fromCompleted)
	and compl.timecompleted is not null
"
                    , conn)
                    {
                        Parameters = { new NpgsqlParameter("fromCompleted", fromCompleted) }
                    };
                ;
                await using var reader = await cmd.ExecuteReaderAsync();

                long rows = 0;
                while (await reader.ReadAsync())
                {
                    var cohort = reader.GetString(0);
                    var username = reader.GetString(1);
                    var email = reader.GetString(2);
                    var course = reader.GetString(3);
                    DateTime? timeCompleted = reader.IsDBNull(6) ? null : reader.GetDateTime(6);

                    if (!timeCompleted.HasValue) timeCompleted = DateTime.Now;

                    Guid? userId = userMap.GetValueOrDefault(username);
                    if (!userId.HasValue)
                    {
                        Guid testUserId;
                        ApplicationUser user = null;
                        if (Guid.TryParse(username, out testUserId))
                        {
                            user = await _userManager.FindByIdAsync(userId);
                        }
                        else
                        {
                            user = await _userManager.FindByNameAsync(username);
                        }
                        if (user != null) userId = user.Id;
                        if (!userId.HasValue) userId = _adminUserId;
                        userMap.Add(username, userId);
                    }

                    if (userId.HasValue)
                    {
                        var userTrainingCourse = new UserTrainingCourse()
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId.Value,
                            CourseName = course,
                            CompletedDate = timeCompleted.Value,
                            UpdatedBy = _adminUserId.ToString()
                        };
                        userTrainingCourseRepo.Insert(userTrainingCourse);
                        rows++;
                    }
                }
                reader.Close();

                await conn.CloseAsync();

                _logger.LogInformation("Records inserted {0}", rows);
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex, ex.Message);
            }
            finally
            {
            }

            return;
        }

        public async Task<IEnumerable<object>> GetUserCompletedCourses(Guid userId)
        {
            var userTrainingCourseRepo = _repoFactory.CreateGenericRepository<UserTrainingCourse>(userContext: _adminUserId);
            var list = userTrainingCourseRepo
                .GetAll()
                .Where(x => x.UserId == userId)
                .ToList();
            return list;
        }
    }
}
