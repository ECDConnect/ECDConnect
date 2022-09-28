using System;
using System.Security.Cryptography;
using System.Threading.Tasks;
using ECDLink.Moodle.Controllers;
using ECDLink.Moodle.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace ECDLink.Moodle.Managers
{
    public class MoodleManager
    {
        private readonly IConfiguration _configuration;

        public MoodleManager(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> CreateUserAsync(MoodleUser user)
        {
            string connectionString = ConfigurationExtensions.GetConnectionString(_configuration, "MoodleConnectionString");

            await using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();

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
                    new NpgsqlParameter("Password", HashPassword(user.Password)),
                    new NpgsqlParameter("IdNumber", user.IdNumber),
                    new NpgsqlParameter("Firstname", user.Firstname),
                    new NpgsqlParameter("Lastname", user.Lastname),
                    new NpgsqlParameter("Email", user.Email),
                    new NpgsqlParameter("Phone1", user.Phone1),
                }
            };

            await cmd.ExecuteNonQueryAsync();

            conn.Close();

            return true;
        }

        public async Task<string> CreateUserSessionAsync(string userName)
        {
            string connectionString = ConfigurationExtensions.GetConnectionString(_configuration, "MoodleConnectionString");

            await using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();

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

            var sessionId = Guid.NewGuid().ToString();
            if (userId >= 0)
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