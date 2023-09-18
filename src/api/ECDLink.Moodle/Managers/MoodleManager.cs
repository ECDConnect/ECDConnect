using ECDLink.Moodle.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection.Metadata;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace ECDLink.Moodle.Managers
{
    public class MoodleManager
    {
        private readonly IConfiguration _configuration;

        public MoodleManager(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private string GetConnectionString(MoodleConfig config)
        {
            string connectionString = ConfigurationExtensions.GetConnectionString(_configuration, "MoodleConnectionString");
            if (config.Database != null && !string.IsNullOrEmpty(config.Database.ConnectionString))
                connectionString = config.Database.ConnectionString;
            return connectionString;
        }

        public async Task<bool> CreateUserAsync(MoodleConfig config, MoodleUser user)
        {
            user.UserName = $"{user.IdNumber}@ecdconnect.co.za"; //string.Format(config.Site.UserNameFormatString, user);
            user.Password = config.Site.DefaultPassword;
            user.Email = $"{user.IdNumber}@ecdconnect.co.za";  //string.Format(config.Site.EmailFormatString, user);

            var cohorts = new List<string>();
            var allCohorts = config.UserTypes.First(x => x.UserType == "*").Cohorts;
            foreach (var cohort in allCohorts)
            {
                cohorts.Add(cohort);
            }

            await using var conn = new NpgsqlConnection(GetConnectionString(config));
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

        public async Task<string> CreateUserSessionAsync(MoodleConfig config, string userName)
        {
            await using var conn = new NpgsqlConnection(GetConnectionString(config));
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

        private static string HashPassword(string password)
        {
            byte[] salt;
            byte[] buffer2;
            if (password == null)
            {
                throw new ArgumentNullException();
            }
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, 0x10, 0x3e8))
            {
                salt = bytes.Salt;
                buffer2 = bytes.GetBytes(0x20);
            }
            byte[] dst = new byte[0x31];
            Buffer.BlockCopy(salt, 0, dst, 1, 0x10);
            Buffer.BlockCopy(buffer2, 0, dst, 0x11, 0x20);
            return Convert.ToBase64String(dst);
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
                        new NpgsqlParameter("Password", "$2y$10$NC4irSPAfnZHUN8HjWXD8e9.MotF0pGqZq6KDPtbfbUquHOQplQbq"), //HashPassword(user.Password)),
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
            await using var cmd = new NpgsqlCommand("SELECT id FROM public.mdl_cohort where name = (@cohortName)", conn)
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

    }
}