using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Configuration.Setup.Seed;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Events;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic;
using ECDLink.DataAccessLayer.Services;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace ECDLink.EGraphQL
{
    public static class DataAccessStartup
    {
        public static void ConfigureDataAccessServices(IServiceCollection services, IConfiguration config, bool isDevelop = false)
        {
            services.AddScoped(typeof(IGenericRepositoryFactory), typeof(GenericRepositoryFactory));
            services.AddScoped(typeof(RolePermissionRepository));
            services.AddScoped(typeof(NavigationPermissionRepository));
            services.AddScoped(typeof(AuditLogRepository));

            services.AddScoped(typeof(GenericRepository<>));
            services.AddScoped(typeof(GenericUserTypeRepository<>));
            services.AddScoped(typeof(ScopedGenericRepository<>));
            services.AddScoped<AttendanceTrackingRepository>();

            services.AddScoped<HierarchyEngine>();
            services.AddScoped<PostgresDataSeed>();

            services.AddScoped<ILocaleService<Language>, LocaleService>();

            services.AddTransient<IDomainEventService, EventServiceWrapper>();
            services.AddTransient<ISystemSettingsService, SystemSettingsService>();

            services.AddMediatR(Assembly.GetExecutingAssembly());

            //if (!isDevelop)
            //{
            //  Audit.Core.Configuration.Setup()
            //  .UseAzureTableStorage(_ => _
            //      .ConnectionString(config.GetConnectionString("AzureStorage"))
            //      .TableName("Events")
            //      .EntityBuilder(e => e
            //          .PartitionKey(ev => $"Events{ev.StartDate:yyyyMM}")
            //          .RowKey(ev => Guid.NewGuid().ToString())
            //          .Columns(c => c.FromObject(ev => new { Date = ev.StartDate, AuditEventJson = ev.ToJson() }))));
            //}

            //var service = services.BuildServiceProvider().GetService<AzureContentDefinition>();

            //service.CreateContentLinkTable();
        }

        public static void AddDataAccessConfiguration(IApplicationBuilder app, IWebHostEnvironment env)
        {

        }
    }
}
