using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Events;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic;
using ECDLink.DataAccessLayer.Services;
using ECDLink.PostgresTenancy.Repository;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace ECDLink.EGraphQL
{
    public static class DataAccessStartup
    {
        public static void ConfigureDataAccessServices(IServiceCollection services)
        {
            services.AddTransient(typeof(ITenancyRepository<>), typeof(TenantRepository<>));
            services.AddScoped(typeof(IGenericRepositoryFactory), typeof(GenericRepositoryFactory));
            services.AddScoped(typeof(RolePermissionRepository));
            services.AddScoped(typeof(NavigationPermissionRepository));
            services.AddScoped(typeof(AuditLogRepository));

            services.AddScoped(typeof(GenericRepository<>));
            services.AddScoped(typeof(GenericUserTypeRepository<>));
            services.AddScoped(typeof(ScopedGenericRepository<>));
            services.AddScoped<AttendanceTrackingRepository>();

            services.AddScoped<HierarchyEngine>();

            services.AddScoped<ILocaleService<Language>, LocaleService>();

            services.AddTransient<IDomainEventService, EventServiceWrapper>();
            services.AddTransient<ISystemSettingsService, SystemSettingsService>();

            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        }

        public static void AddDataAccessConfiguration(IApplicationBuilder app, IWebHostEnvironment env)
        {

        }
    }
}
