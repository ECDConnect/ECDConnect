using ECDLink.Moodle.Models;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
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

        public async Task<bool> CreateUserAsync(MoodleUser user, List<string> cohorts)
        {
            string connectionString = ConfigurationExtensions.GetConnectionString(_configuration, "MoodleConnectionString");

            await using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();

            // First see if record already exists
            await using var getUserIdCmd = new NpgsqlCommand("SELECT id FROM public.mdl_user where userName = (@userName)", conn)
            {
                Parameters = { new NpgsqlParameter("userName", user.UserName) }
            };
            await using var reader = await getUserIdCmd.ExecuteReaderAsync();

            long userId = -1;
            while (await reader.ReadAsync())
            {
                userId = reader.GetInt64(0);
            }
            reader.Close();

            // Add if new user
            if (userId == -1)
            {
                await using var cmd = new NpgsqlCommand("INSERT INTO public.mdl_user" +
                    "(confirmed, mnethostid, username, password, idnumber, firstname, lastname, email, phone1)" +
                    "VALUES((@Confirmed),(@Mnethostid),(@UserName),(@Password),(@IdNumber),(@Firstname),(@Lastname),(@Email),(@Phone1));",
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
                    }
                };
                await cmd.ExecuteNonQueryAsync();
            }

            foreach (var cohortName in cohorts)
            {
                // get cohort id
                await using var getCohortId = new NpgsqlCommand("SELECT id FROM public.mdl_cohort where name = (@cohortName)", conn)
                {
                    Parameters = { new NpgsqlParameter("cohortName", cohortName) }
                };
                await using var cohortReader = await getCohortId.ExecuteReaderAsync();

                long cohortId = -1;
                while (await cohortReader.ReadAsync())
                {
                    cohortId = cohortReader.GetInt64(0);
                }
                reader.Close();

                // get cohort member id
                await using var getCohortMemberId = new NpgsqlCommand("SELECT id FROM public.mdl_cohort_members where cohortid = (@cohortId) and userid = (@userId)", conn)
                {
                    Parameters = {
                    new NpgsqlParameter("cohortId", cohortId),
                    new NpgsqlParameter("userId", userId)
                }

                };
                await using var cohortMemberReader = await getCohortMemberId.ExecuteReaderAsync();

                long cohortMemberId = -1;
                while (await cohortMemberReader.ReadAsync())
                {
                    cohortMemberId = cohortMemberReader.GetInt64(0);
                }
                reader.Close();

                // Add the cohort member record if not existed
                if (cohortMemberId == -1)
                {
                    DateTimeOffset dto = new DateTimeOffset(DateTime.Now);
                    var unixTimeStamp = dto.ToUnixTimeSeconds();

                    await using var cmd = new NpgsqlCommand("INSERT INTO public.mdl_cohort_members" +
                        "(cohortid, userid, timeadded)" +
                        "VALUES((@cohortId),(@userId),(@unixTimeStamp))" +
                        "RETURNING id",
                        conn)
                    {
                        Parameters =
                    {
                        new NpgsqlParameter("cohortId", cohortId),
                        new NpgsqlParameter("userId", userId),
                        new NpgsqlParameter("unixTimeStamp", unixTimeStamp),
                    }
                    };

                    await cmd.ExecuteNonQueryAsync();
                }
            }

            conn.Close();

            return true;
        }

        public async Task<string> CreateUserSessionAsync(string userName)
        {
            string connectionString = ConfigurationExtensions.GetConnectionString(_configuration, "MoodleConnectionString");

            await using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();

            // get user id for user name
            await using var getUserIdCmd = new NpgsqlCommand("SELECT id FROM public.mdl_user where userName = (@userName)", conn)
            {
                Parameters = { new NpgsqlParameter("userName", userName) }
            };
            await using var reader = await getUserIdCmd.ExecuteReaderAsync();

            long userId = -1;
            while (await reader.ReadAsync())
            {
                userId = reader.GetInt64(0);
            }
            reader.Close();

            // get session id for user id
            await using var getSessionIdCmd = new NpgsqlCommand("SELECT sid FROM public.mdl_sessions where userid = (@userId)", conn)
            {
                Parameters = { new NpgsqlParameter("userId", userId) }
            };
            await using var sessionReader = await getSessionIdCmd.ExecuteReaderAsync();

            string dbSessionId = "";
            while (await reader.ReadAsync())
            {
                dbSessionId = sessionReader.GetString(0);
            }
            reader.Close();


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

            // TODO return error if user is not found
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

    }
}