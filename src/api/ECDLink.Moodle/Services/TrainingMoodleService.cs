using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Training;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Moodle.Models;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Npgsql;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Moodle.Services
{
    public class TrainingMoodleService : ITrainingService
    {
        private readonly IConfiguration _configuration;
        private readonly MoodleConfig _config;
        private readonly AuthenticationDbContext _dbContext;
        private readonly IGenericRepositoryFactory _repoFactory;
        private readonly Guid _adminUserId;
        private readonly ApplicationUserManager _userManager;
        private readonly ILogger<TrainingMoodleService> _logger;
        private readonly IPointsService _pointsService;

        public TrainingMoodleService(IConfiguration configuration, 
            AuthenticationDbContext dbContext,
            IGenericRepositoryFactory repoFactory, 
            HierarchyEngine hierarchyEngine, 
            ApplicationUserManager userManager, 
            ILogger<TrainingMoodleService> logger,
            [Service] IPointsService pointsService)
        {
            _configuration = configuration;
            _dbContext = dbContext;
            _repoFactory = repoFactory;
            _adminUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();
            _userManager = userManager;
            _logger = logger;
            _pointsService = pointsService;

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

        public async Task<bool> CreateUserAsync(Guid userId)
        {
            if (!Enabled) 
                return false;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return false;

            var moodleUser = new MoodleUser()
            {
                UserName = user.Id.ToString(),
                Password = _config.Site.DefaultPassword,
                IdNumber = user.IdNumber ?? "",
                Firstname = string.IsNullOrEmpty(user.FirstName) ? " " : user.FirstName,
                Lastname = string.IsNullOrEmpty(user.Surname) ? " " : user.Surname,
                Email = string.Format(_config.Site.EmailFormatString, user.Id, user.FirstName, user.Surname),
                Phone1 = user.PhoneNumber ?? ""
            };

            var roles = await _userManager.GetRolesAsync(user);

            var cohorts = _config.UserTypes.Where(x => x.UserType == "*" || roles.Contains(x.UserType)).SelectMany(x => x.Cohorts).Distinct().ToList();

            if (cohorts.Count == 0)
            {
                return false;
            }

            await using var conn = new NpgsqlConnection(GetConnectionString());
            await conn.OpenAsync();

            // First see if record already exists
            long moodleUserId = await GetMoodleUserId(conn, moodleUser.UserName);

            DateTimeOffset dto = new(DateTime.Now);
            long timestamp = dto.ToUnixTimeSeconds();

            // Add if new user
            if (moodleUserId == -1)
            {
                moodleUserId = await InsertMoodleUserId(conn, moodleUser);
            }

            foreach (var cohortName in cohorts)
            {
                // get cohort id
                long cohortId = await GetMoodleCohortId(conn, cohortName);
                if (cohortId == -1) continue;

                long cohortMemberId = await GetMoodleCohortMemberId(conn, cohortId, moodleUserId);

                // Add the cohort member record if not existed
                if (cohortMemberId == -1)
                {
                    await InsertMoodleCohortMemberId(conn, moodleUserId, cohortId, timestamp);
                }
            }

            if (cohorts.Count > 0)
            {
                await EnrolUserToCohortCourses(conn, moodleUserId, timestamp);
            }

            await conn.CloseAsync();

            return true;
        }

        private string GetConnectionString()
        {
            string connectionString = ConfigurationExtensions.GetConnectionString(_configuration, "MoodleConnectionString");
            if (_config.Database != null && !string.IsNullOrEmpty(_config.Database.ConnectionString))
                connectionString = _config.Database.ConnectionString;
            return connectionString;
        }

        private static async Task<long> GetMoodleUserId(NpgsqlConnection conn, string name)
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
            await reader.CloseAsync();
            return userId;
        }

        private static async Task<long> InsertMoodleUserId(NpgsqlConnection conn, MoodleUser user)
        {
            DateTimeOffset dto = new(DateTime.Now);
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

        private static async Task<long> GetMoodleCohortId(NpgsqlConnection conn, string name)
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
            await reader.CloseAsync();

            return cohortId;
        }

        private static async Task InsertMoodleCohortMemberId(NpgsqlConnection conn, long userId, long cohortId, long timestamp = 0)
        {
            if (timestamp == 0)
            {
                DateTimeOffset dto = new(DateTime.Now);
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

        private static async Task<long> GetMoodleCohortMemberId(NpgsqlConnection conn, long cohortId, long userId)
        {
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
            await reader.CloseAsync();

            return cohortMemberId;
        }

        private static async Task EnrolUserToCohortCourses(NpgsqlConnection conn, long userId, long timestamp = 0)
        {
            if (timestamp == 0)
            {
                DateTimeOffset dto = new(DateTime.Now);
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

        public async Task SyncCompletedCourses()
        {
            if (!Enabled)
            {
                _logger.LogInformation("Moodle Course sync disabled.");
                return;
            }

            if (TenantExecutionContext.Tenant.TenantType == ECDLink.Tenancy.Enums.TenantType.CHWConnect)
            {
                _logger.LogInformation("Moodle Course sync skipped for CHWConnect tenant.");
                return;
            }

            try
            {
                var cohorts = _config.UserTypes.SelectMany(x => x.Cohorts).Where(x => !x.EndsWith("-ui")).Distinct().ToArray();
                if (cohorts.Length == 0)
                {
                    _logger.LogInformation("No cohorts found for {Tenant}", TenantExecutionContext.Tenant.Id);
                    return;
                }

                var userMap = new ConcurrentDictionary<string, Guid?>();

                var fromCompletedDate = await GetLastCompletedDateAsync();
                _logger.LogInformation("Fetching Moodle completed courses since {FromCompletedDate}", fromCompletedDate);

                var records = await FetchCompletedCoursesAsync(cohorts, fromCompletedDate);
                long rows = await ProcessCourseRecordsAsync(records, userMap);

                _logger.LogInformation("Inserted {Rows} user training course records.", rows);

                var pointsCalculated = 0;
                foreach (var userId in userMap.Values)
                {
                    if (!userId.HasValue) continue;
                    await _pointsService.CalculateCompleteOnlineTrainingCourse(userId.Value);
                    pointsCalculated++;
                }
                _logger.LogInformation("Calculated points for {PointsCalculated} users.", pointsCalculated);
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex, ex.Message);
            }
        }

        public async Task<IEnumerable<object>> GetUserCompletedCourses(Guid userId)
        {
            var userTrainingCourseRepo = _repoFactory.CreateGenericRepository<UserTrainingCourse>(userContext: _adminUserId);
            var list = await userTrainingCourseRepo
                .GetAll()
                .Where(x => x.UserId == userId)
                .ToListAsync();
            return list;
        }

        private async Task<DateTime> GetLastCompletedDateAsync()
        {
            var lastCompleted = await _dbContext.UserTrainingCourses
                .Where(x => x.TenantId == TenantExecutionContext.Tenant.Id && x.IsActive)
                .OrderByDescending(x => x.CompletedDate)
                .Select(x => x.CompletedDate)
                .FirstOrDefaultAsync();

            return lastCompleted == DateTime.MinValue
                ? new DateTime(2023, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                : lastCompleted;
        }

        private async Task<List<(string Username, string Course, DateTime CompletedDate)>> FetchCompletedCoursesAsync(string[] cohorts, DateTime fromCompleted)
        {
            var records = new List<(string, string, DateTime)>();
            await using var conn = new NpgsqlConnection(GetConnectionString());
            await conn.OpenAsync();

            string query = @"
;WITH courses AS 
(
	SELECT c.id, c.fullname, COALESCE(COUNT(DISTINCT mcm.id),0) modules
	FROM mdl_course c
	JOIN mdl_enrol me ON c.id = me.courseid
	JOIN mdl_cohort mc ON me.customint1 = mc.id
	LEFT JOIN mdl_course_modules mcm ON c.id = mcm.course AND mcm.visible = 1
	WHERE (mc.idnumber = ANY(@cohorts) OR mc.name = ANY(@cohorts))
        AND mc.idnumber NOT ILIKE '%-ui'
	GROUP BY c.id, c.fullname
)
, completions1 AS 
(
	SELECT mcc.userid, mcc.course, to_timestamp(timecompleted) ""timecompleted"" 
	FROM mdl_course_completions mcc 
	JOIN courses c ON mcc.course = c.id
	WHERE mcc.timecompleted IS NOT NULL 
        AND to_timestamp(mcc.timecompleted) > @fromCompleted
)
, completions2 AS
(
	SELECT mcmc.userid, c.id ""course"", c.modules, to_timestamp(max(mcmc.timemodified)) ""timecompleted"" 
	FROM courses c
	JOIN mdl_course_modules mcm ON c.id = mcm.course
	JOIN mdl_course_modules_completion mcmc ON mcm.id = mcmc.coursemoduleid
	WHERE mcmc.completionstate = 1
        AND to_timestamp(mcmc.timemodified) > @fromCompleted
	GROUP BY mcmc.userid, c.id, c.modules
	HAVING c.modules = COUNT(DISTINCT mcmc.id)
)
, completions AS
(
	SELECT c1.userid, c1.course, c1.timecompleted, 'real' completion_type
	FROM completions1 c1
	UNION
	SELECT c2.userid, c2.course, c2.timecompleted, 'calc' completion_type
	FROM completions2 c2
	LEFT JOIN completions1 c1 ON c2.userid = c1.userid AND c2.course = c1.course
	WHERE c1.userid IS NULL
)
SELECT mu.username, mc.fullname AS course, MAX(c.timecompleted) timecompleted, MAX(c.completion_type) completion_type
FROM completions c
JOIN mdl_user mu ON c.userid = mu.id 
JOIN mdl_course mc ON c.course = mc.id
GROUP BY mu.username, mc.fullname 
ORDER BY ""username"", ""course"";
    ";

            await using var cmd = new NpgsqlCommand(query, conn)
            {
                Parameters = {
                new NpgsqlParameter("cohorts", cohorts),
                new NpgsqlParameter("fromCompleted", fromCompleted)
            }
            };

            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var username = reader.GetString(0);
                var course = reader.GetString(1);
                var timeCompleted = reader.GetDateTime(2);
                records.Add((username, course, timeCompleted));
            }

            return records;
        }

        private async Task<long> ProcessCourseRecordsAsync(
               List<(string Username, string Course, DateTime CompletedDate)> records,
               ConcurrentDictionary<string, Guid?> userMap)
        {
            long rows = 0;
            var batch = new List<UserTrainingCourse>();

            foreach (var (username, course, completedDate) in records)
            {
                var userId = await GetUserIdAsync(username, userMap);
                if (!userId.HasValue)
                {
                    _logger.LogWarning("No user ID found for username {Username}. Skipping record.", username);
                    continue;
                }

                var userTrainingCourse = new UserTrainingCourse
                {
                    Id = Guid.NewGuid(),
                    UserId = userId.Value,
                    CourseName = course,
                    CompletedDate = completedDate,
                    UpdatedBy = _adminUserId.ToString(),
                    TenantId = TenantExecutionContext.Tenant.Id,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    IsActive = true
                };

                batch.Add(userTrainingCourse);
                rows++;

                // Batch insert every 100 records to balance memory and performance
                if (batch.Count >= 100)
                {
                    _dbContext.UserTrainingCourses.AddRange(batch);
                    await _dbContext.SaveChangesAsync();
                    batch.Clear();
                }
            }

            // Insert remaining records
            if (batch.Count > 0)
            {
                _dbContext.UserTrainingCourses.AddRange(batch);
                await _dbContext.SaveChangesAsync();
            }

            return rows;
        }

        private async Task<Guid?> GetUserIdAsync(string username, ConcurrentDictionary<string, Guid?> userMap)
        {
            if (string.IsNullOrEmpty(username))
            {
                return null;
            }

            if (userMap.TryGetValue(username, out Guid? userId))
            {
                return userId;
            }

            var isId = Guid.TryParse(username, out Guid parsedId);
            userId = await (from u in _dbContext.Users
                        where u.TenantId == TenantExecutionContext.Tenant.Id
                            && ((isId && u.Id == parsedId) || (!isId && u.UserName == username))
                        select new Guid?(u.Id)
                       ).FirstOrDefaultAsync();

            userMap.TryAdd(username, userId);
            return userId;
        }
    }
}
