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
        private readonly ITrainingNotificationService _trainingNotificationService;

        public TrainingMoodleService(IConfiguration configuration, 
            AuthenticationDbContext dbContext,
            IGenericRepositoryFactory repoFactory, 
            HierarchyEngine hierarchyEngine, 
            ApplicationUserManager userManager, 
            ILogger<TrainingMoodleService> logger,
            [Service] IPointsService pointsService,
            [Service] ITrainingNotificationService trainingNotificationService)
        {
            _configuration = configuration;
            _dbContext = dbContext;
            _repoFactory = repoFactory;
            _adminUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();
            _userManager = userManager;
            _logger = logger;
            _pointsService = pointsService;
            _trainingNotificationService = trainingNotificationService;

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

                await BackfillExternalCourseIdsAsync();

                var userMap = new ConcurrentDictionary<string, Guid?>();

                var fromActivityDate = await GetLastActivityDateAsync();
                _logger.LogInformation("Fetching Moodle course progress since {FromActivityDate}", fromActivityDate);

                var records = await FetchCourseProgressAsync(cohorts, fromActivityDate);
                long rows = await ProcessCourseRecordsAsync(records, userMap);

                _logger.LogInformation("Upserted {Rows} user training course records.", rows);

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

        // Repairs records inserted before ExternalCourseId existed by matching them to their Moodle course
        // by CourseName, so the upsert below (keyed on UserId + ExternalCourseId) finds them instead of
        // inserting a duplicate row the first time that course has new activity. Runs on every sync; once a
        // tenant's legacy rows are all backfilled it's a single no-op query.
        private async Task<long> BackfillExternalCourseIdsAsync()
        {
            if (!Enabled)
            {
                _logger.LogInformation("Moodle course sync disabled; skipping ExternalCourseId backfill.");
                return 0;
            }

            var legacyRecords = await _dbContext.UserTrainingCourses
                .Where(x => x.TenantId == TenantExecutionContext.Tenant.Id && x.IsActive && x.ExternalCourseId == null)
                .ToListAsync();

            if (legacyRecords.Count == 0)
            {
                _logger.LogInformation("No UserTrainingCourse records require an ExternalCourseId backfill for {Tenant}.", TenantExecutionContext.Tenant.Id);
                return 0;
            }

            var courseNames = legacyRecords.Select(x => x.CourseName).Distinct().ToArray();

            var courseIdsByName = new Dictionary<string, string>();
            await using (var conn = new NpgsqlConnection(GetConnectionString()))
            {
                await conn.OpenAsync();
                await using var cmd = new NpgsqlCommand(
                    "SELECT id, fullname FROM public.mdl_course WHERE fullname = ANY(@names)", conn)
                {
                    Parameters = { new NpgsqlParameter("names", courseNames) }
                };
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var id = reader.GetInt64(0).ToString();
                    var fullname = reader.GetString(1);
                    if (!courseIdsByName.TryAdd(fullname, id))
                    {
                        _logger.LogWarning("Multiple Moodle courses share the fullname '{CourseName}'; using the first match ({CourseId}) for the backfill.", fullname, courseIdsByName[fullname]);
                    }
                }
            }

            var unmatched = courseNames.Except(courseIdsByName.Keys).ToList();
            if (unmatched.Count > 0)
            {
                _logger.LogWarning("No matching Moodle course found for {Count} course name(s), left un-backfilled: {CourseNames}", unmatched.Count, string.Join(", ", unmatched));
            }

            // Rows already touched by the new upsert logic (e.g. a re-sync that ran before this backfill) so we
            // don't collide with them and blow up the (UserId, ExternalCourseId) uniqueness the sync relies on.
            var alreadyBackfilled = await _dbContext.UserTrainingCourses
                .Where(x => x.TenantId == TenantExecutionContext.Tenant.Id && x.IsActive && x.ExternalCourseId != null)
                .Select(x => new { x.UserId, x.ExternalCourseId })
                .ToListAsync();
            var takenKeys = alreadyBackfilled.Select(x => (x.UserId, x.ExternalCourseId)).ToHashSet();

            long updated = 0;
            long skippedCollisions = 0;
            foreach (var record in legacyRecords)
            {
                if (!courseIdsByName.TryGetValue(record.CourseName, out var externalCourseId))
                    continue;

                if (!takenKeys.Add((record.UserId, externalCourseId)))
                {
                    skippedCollisions++;
                    _logger.LogWarning(
                        "Skipping ExternalCourseId backfill for UserTrainingCourse {Id}: user {UserId} already has an active record for Moodle course {ExternalCourseId} ('{CourseName}'). Resolve this pair manually.",
                        record.Id, record.UserId, externalCourseId, record.CourseName);
                    continue;
                }

                record.ExternalCourseId = externalCourseId;
                record.UpdatedBy = _adminUserId.ToString();
                record.UpdatedDate = DateTime.Now;
                updated++;
            }

            if (updated > 0)
            {
                await _dbContext.SaveChangesAsync();
            }

            _logger.LogInformation(
                "Backfilled ExternalCourseId for {Updated} of {Total} UserTrainingCourse records for {Tenant} ({Skipped} skipped due to collisions, {Unmatched} unmatched course names).",
                updated, legacyRecords.Count, TenantExecutionContext.Tenant.Id, skippedCollisions, unmatched.Count);

            return updated;
        }

        private readonly record struct CourseProgressRecord(
            string Username,
            string Course,
            string ExternalCourseId,
            DateTime? StartedDate,
            DateTime? LastActivityDate,
            DateTime? CompletedDate,
            decimal ProgressPercentage,
            string Status);

        private async Task<DateTime> GetLastActivityDateAsync()
        {
            var lastActivity = await _dbContext.UserTrainingCourses
                .Where(x => x.TenantId == TenantExecutionContext.Tenant.Id && x.IsActive)
                .OrderByDescending(x => x.LastActivityDate)
                .Select(x => x.LastActivityDate)
                .FirstOrDefaultAsync();

            return lastActivity == null || lastActivity == DateTime.MinValue
                ? new DateTime(2023, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                : lastActivity.Value;
        }

        // Pulls per-user course progress (not just completions) so in-progress courses are tracked too.
        // A user/course only appears once they have some module completion activity or a course completion record,
        // to avoid creating rows for courses a user is merely enrolled in but hasn't touched.
        private async Task<List<CourseProgressRecord>> FetchCourseProgressAsync(string[] cohorts, DateTime fromDate)
        {
            var records = new List<CourseProgressRecord>();
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
, module_activity AS
(
	SELECT mcmc.userid, c.id ""course"",
		COUNT(DISTINCT mcmc.id) FILTER (WHERE mcmc.completionstate <> 0) modules_touched,
		MIN(to_timestamp(mcmc.timemodified)) FILTER (WHERE mcmc.completionstate <> 0) first_activity,
		MAX(to_timestamp(mcmc.timemodified)) last_activity
	FROM courses c
	JOIN mdl_course_modules mcm ON c.id = mcm.course
	JOIN mdl_course_modules_completion mcmc ON mcm.id = mcmc.coursemoduleid
	WHERE mcmc.timemodified > 0
	GROUP BY mcmc.userid, c.id
)
, full_completions AS
(
	SELECT mcmc.userid, c.id ""course"", MAX(to_timestamp(mcmc.timemodified)) completed_at
	FROM courses c
	JOIN mdl_course_modules mcm ON c.id = mcm.course
	JOIN mdl_course_modules_completion mcmc ON mcm.id = mcmc.coursemoduleid
	WHERE mcmc.completionstate = 1
	GROUP BY mcmc.userid, c.id, c.modules
	HAVING c.modules = COUNT(DISTINCT mcmc.id)
)
, completions AS
(
	SELECT mcc.userid, mcc.course, to_timestamp(mcc.timecompleted) completed_at
	FROM mdl_course_completions mcc
	JOIN courses c ON mcc.course = c.id
	WHERE mcc.timecompleted IS NOT NULL
	UNION
	SELECT fc.userid, fc.course, fc.completed_at
	FROM full_completions fc
	LEFT JOIN mdl_course_completions mcc ON mcc.userid = fc.userid AND mcc.course = fc.course AND mcc.timecompleted IS NOT NULL
	WHERE mcc.userid IS NULL
)
, activity_or_completion AS
(
	SELECT userid, course FROM module_activity
	UNION
	SELECT userid, course FROM completions
)
SELECT
	mu.username,
	c.fullname AS course,
	c.id::text AS external_course_id,
	COALESCE(ma.first_activity, comp.completed_at) AS started_date,
	GREATEST(ma.last_activity, comp.completed_at) AS last_activity_date,
	comp.completed_at AS completed_date,
	CASE
		WHEN c.modules > 0 THEN ROUND(LEAST(COALESCE(ma.modules_touched, 0), c.modules)::numeric / c.modules * 100, 2)
		WHEN comp.completed_at IS NOT NULL THEN 100
		ELSE 0
	END AS progress_percentage,
	CASE WHEN comp.completed_at IS NOT NULL THEN 'Completed' ELSE 'InProgress' END AS status
FROM activity_or_completion aoc
JOIN courses c ON c.id = aoc.course
JOIN mdl_user mu ON mu.id = aoc.userid
LEFT JOIN module_activity ma ON ma.userid = aoc.userid AND ma.course = aoc.course
LEFT JOIN completions comp ON comp.userid = aoc.userid AND comp.course = aoc.course
WHERE GREATEST(ma.last_activity, comp.completed_at) > @fromDate
ORDER BY mu.username, c.fullname;
    ";

            await using var cmd = new NpgsqlCommand(query, conn)
            {
                Parameters = {
                new NpgsqlParameter("cohorts", cohorts),
                new NpgsqlParameter("fromDate", fromDate)
            }
            };

            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                records.Add(new CourseProgressRecord(
                    Username: reader.GetString(0),
                    Course: reader.GetString(1),
                    ExternalCourseId: reader.IsDBNull(2) ? null : reader.GetString(2),
                    StartedDate: reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    LastActivityDate: reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                    CompletedDate: reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    ProgressPercentage: reader.GetDecimal(6),
                    Status: reader.GetString(7)));
            }

            return records;
        }

        private async Task<long> ProcessCourseRecordsAsync(
               List<CourseProgressRecord> records,
               ConcurrentDictionary<string, Guid?> userMap)
        {
            var resolved = new List<(Guid UserId, CourseProgressRecord Record)>();
            foreach (var record in records)
            {
                var userId = await GetUserIdAsync(record.Username, userMap);
                if (!userId.HasValue)
                {
                    _logger.LogWarning("No user ID found for username {Username}. Skipping record.", record.Username);
                    continue;
                }
                resolved.Add((userId.Value, record));
            }

            if (resolved.Count == 0)
                return 0;

            var userIds = resolved.Select(x => x.UserId).Distinct().ToList();
            var externalCourseIds = resolved.Select(x => x.Record.ExternalCourseId).Distinct().ToList();

            var existing = await _dbContext.UserTrainingCourses
                .Where(x => x.TenantId == TenantExecutionContext.Tenant.Id
                    && x.IsActive
                    && userIds.Contains(x.UserId)
                    && externalCourseIds.Contains(x.ExternalCourseId))
                .ToListAsync();

            var existingLookup = existing.ToDictionary(x => (x.UserId, x.ExternalCourseId));

            long rows = 0;
            var newlyCompleted = new List<UserTrainingCourse>();

            foreach (var (userId, record) in resolved)
            {
                var key = (userId, record.ExternalCourseId);
                if (!existingLookup.TryGetValue(key, out var course))
                {
                    course = new UserTrainingCourse
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        TenantId = TenantExecutionContext.Tenant.Id,
                        InsertedDate = DateTime.Now,
                        IsActive = true
                    };
                    _dbContext.UserTrainingCourses.Add(course);
                    existingLookup[key] = course;
                }

                var wasCompleted = course.CompletedDate.HasValue;

                course.CourseName = record.Course;
                course.ExternalCourseId = record.ExternalCourseId;
                course.StartedDate ??= record.StartedDate;
                course.ProgressPercentage = record.ProgressPercentage;
                course.LastActivityDate = record.LastActivityDate;
                course.Status = record.Status;
                course.CompletedDate = record.CompletedDate;
                course.UpdatedBy = _adminUserId.ToString();
                course.UpdatedDate = DateTime.Now;

                rows++;

                if (!wasCompleted && course.CompletedDate.HasValue)
                {
                    newlyCompleted.Add(course);
                }
            }

            await _dbContext.SaveChangesAsync();

            if (newlyCompleted.Count > 0)
            {
                await SendCourseCompletedNotificationsAsync(newlyCompleted);
            }

            return rows;
        }

        private async Task SendCourseCompletedNotificationsAsync(
            List<UserTrainingCourse> completedCourses)
        {
            foreach (var completedCourse in completedCourses)
            {
                try
                {
                    await _trainingNotificationService.SendCourseCompletedNotificationAsync(
                        completedCourse.UserId,
                        completedCourse.CourseName,
                        completedCourse.CompletedDate.Value);
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex,
                        "Failed to send course completed notification for user {UserId} and course {CourseName}.",
                        completedCourse.UserId,
                        completedCourse.CourseName);
                }
            }
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
