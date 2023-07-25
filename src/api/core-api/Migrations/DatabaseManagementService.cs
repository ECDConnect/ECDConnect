using ECDLink.ContentManagement.Configuration.Setup;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Configuration.Setup.Seed;
using ECDLink.DataAccessLayer.Context;
using ECDLink.Tenancy;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Migrations
{
    public class DatabaseManagementService : ITenantInitializeService
    {
        private readonly PostgresDataSeed _postgresSeed;
        private readonly AuthenticationDbContext _authDbContext;
        private readonly ContentManagementDbContext _contentManagementDbContext;
        private readonly ContentMangementSeedService _contentManagementSeed;
        private readonly ILogger<DatabaseManagementService> _logger;
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public DatabaseManagementService(
            PostgresDataSeed postgresSeed,
            AuthenticationDbContext authDbContext,
            ContentManagementDbContext contentManagementDbContext,
            ContentMangementSeedService contentManagementSeed,
            ILogger<DatabaseManagementService> logger,
            IWebHostEnvironment webHostEnvironment)
        {
            _postgresSeed = postgresSeed;
            _authDbContext = authDbContext;
            _contentManagementDbContext = contentManagementDbContext;
            _contentManagementSeed = contentManagementSeed;
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
        }

        public bool MigrateTenantInstance(TenantModel tenant)
        {
            try
            {
                BuildDbStructure();
            }
            catch (Exception e)
            {
                // Unable to migrate
                return false;
            }

            return true;
        }

        public bool CreateTenantInstance(TenantModel tenant)
        {
            BuildDbStructure();
            try
            {
                _authDbContext.Database.Migrate();
                _postgresSeed.Seed();

                _contentManagementDbContext.Database.Migrate();
                _contentManagementSeed.SeedFields();
                _contentManagementSeed.SeedContent();
            }
            catch (Exception e)
            {
                _authDbContext.Database.EnsureDeleted();
                _contentManagementDbContext.Database.EnsureDeleted();

                // Handle cannot create database
                return false;
            }

            return true;
        }

        public async Task<bool> SeedTenantWithTestData()
        {
            try
            {
                var hasUsers = _authDbContext.Users.AnyAsync().Result;
                if (hasUsers)
                {
                    _logger.LogInformation("Are users already seeded?");
                    return await Task.Run<bool>(() => true);
                }
                _logger.LogInformation("Seeding database.");
                _postgresSeed.Seed();
                _logger.LogInformation("Seeding content information database");
                _contentManagementDbContext.Database.Migrate();
                _contentManagementSeed.SeedFields();
                _contentManagementSeed.SeedContent();
            }
            catch (Exception e)
            {
                _logger.LogWarning("Unable to seed tenant test data");
                return await Task.Run<bool>(() => false);
            }
            return await Task.Run<bool>(() => true);
        }

        private void BuildDbStructure()
        {
            var franchisor = _config.GetSection<FranchisorConfiguration>(TenancyConstants.Configuration.TenantSettings);
            var authDbContextOptions = GetOptions<AuthenticationDbContext>(franchisor.ConnectionString, "ECDLink.DataAccessLayer");
            var authDbContext = new AuthenticationDbContext(authDbContextOptions.Options);
            authDbContext.Database.Migrate();

            var contentManagementDbContextOptions = GetOptions<ContentManagementDbContext>(franchisor.ConnectionString, "ECDLink.ContentManagement");
            var contentManagementDbContext = new ContentManagementDbContext(contentManagementDbContextOptions.Options);
            contentManagementDbContext.Database.Migrate();
        }

        private DbContextOptionsBuilder<T> GetOptions<T>(string connection, string Migration)
            where T : DbContext
        {
            var opts = new DbContextOptionsBuilder<T>();

            opts.UseNpgsql(connection, s =>
            {
                s.EnableRetryOnFailure();
                s.MigrationsAssembly(Migration);
            });

            if (_webHostEnvironment.IsDevelopment())
                opts.EnableSensitiveDataLogging();

            return opts;
        }
    }
}
