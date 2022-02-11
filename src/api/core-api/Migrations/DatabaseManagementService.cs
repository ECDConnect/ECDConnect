using ECDLink.ContentManagement.Configuration.Setup;
using ECDLink.DataAccessLayer.Configuration.Setup.Seed;
using ECDLink.DataAccessLayer.Context;
using ECDLink.Tenancy;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace EcdLink.Api.CoreApi.Migrations
{
    public class DatabaseManagementService : ITenantInitializeService
    {
        private readonly PostgresDataSeed _postgresSeed;
        private readonly AuthenticationDbContext _authDbContext;
        private readonly ContentManagementDbContext _contentManagementDbContext;
        private readonly ContentMangementSeedService _contentManagementSeed;

        public DatabaseManagementService(
            PostgresDataSeed postgresSeed,
            AuthenticationDbContext authDbContext,
            ContentManagementDbContext contentManagementDbContext,
            ContentMangementSeedService contentManagementSeed)
        {
            _postgresSeed = postgresSeed;
            _authDbContext = authDbContext;
            _contentManagementDbContext = contentManagementDbContext;
            _contentManagementSeed = contentManagementSeed;
        }

        public bool MigrateTenantInstance(TenantModel tenant)
        {
            try
            {
                BuildDbStructure(tenant);
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
            BuildDbStructure(tenant);
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

        private void BuildDbStructure(TenantModel tenant)
        {
            var authDbContextOptions = GetOptions<AuthenticationDbContext>(tenant.ConnectionString, "ECDLink.DataAccessLayer");
            var authDbContext = new AuthenticationDbContext(authDbContextOptions.Options);
            authDbContext.Database.Migrate();

            var contentManagementDbContextOptions = GetOptions<ContentManagementDbContext>(tenant.ConnectionString, "ECDLink.ContentManagement");
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

            opts.EnableSensitiveDataLogging();

            return opts;
        }
    }
}
