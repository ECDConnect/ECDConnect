using ECDConnect.WorkerService;
using ECDConnect.WorkerService.Integration;
using ECDConnect.WorkerService.Utils;
using EcdLink.Api.CoreApi.Managers.Integration;
using EcdLink.Api.CoreApi.Managers.Users;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Services;
using ECDLink.Abstractrions.Services;
using ECDLink.AutomatedJobs.Services.Interfaces;
using ECDLink.AzureStorage.Blob;
using ECDLink.Core.Caching;
using ECDLink.Core.Extensions;
using ECDLink.Core.Models;
using ECDLink.Core.Services;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Services;
using ECDLink.PostgresTenancy.Context;
using ECDLink.PostgresTenancy.Entities;
using ECDLink.PostgresTenancy.Repository;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Security.Providers;
using ECDLink.Security.Providers.Tokens;
using ECDLink.SmartStart.Services;
using ECDLink.Tenancy;
using ECDLink.Tenancy.Cache;
using ECDLink.Tenancy.EntityFramework.Extensions;
using ECDLink.Tenancy.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;


//IHost host = Host.CreateDefaultBuilder(args)
//    .ConfigureServices(services =>
//    {
//        IConfigurationRoot configuration = new ConfigurationBuilder()
//        .AddJsonFile("appsettings.json")
//        .Build();

//        services.AddDbContextFactory<AuthenticationDbContext>((serviceProvider, options) =>
//        {
//            options.UseNpgsqlTenancy(configuration);
//        });

//        //services.AddDbContext<AuthenticationDbContext>(options =>
//        //options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
//        //services.AddSingleton<IConfiguration>(Configuration);
//        //string connectionString = ConfigurationExtensions.GetConnectionString(configuration, "ConnectionStrings");
//        //var conf = config.GetSection<FranchisorConfiguration>(TenancyConstants.Configuration.TenantSettings);
//        services.AddScoped(typeof(IGenericRepositoryFactory), typeof(GenericRepositoryFactory));
//        //services.AddTransient<ITenancyRepository, TenantRepository>();
//        //services.AddTransient<ICacheService<ITenantCache>, TenantMemoryCacheWrapper>();
//        //jservices.AddScoped<TenantService>();
//        //services.AddScoped<ITenantService, TenantCache>();
//        //services.AddScoped<EntityFrameworkTenancy>();
//        //services.AddScoped<HierarchyEngine>();
//        //services.AddScoped<TenantService>();
//        //services.AddScoped<ITenantService, TenantCache>();
//        //services.AddScoped<ICacheService<ITenantCache>, TenantMemoryCacheWrapper>();

//        //services.AddHostedService<Worker>();
//        services.AddHostedService<SmartLinkIntegrationDataSyncJob>();
//    })
//    .Build();

IConfigurationRoot config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .AddEnvironmentVariables()
    .Build();

TenantSettings? settings = config.GetRequiredSection("TenantSettings").Get<TenantSettings>();

HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<ScopedBackgroundService>();
builder.Services.AddScoped<IScopedProcessingService, IntegrationDataSyncProcessingService>();
builder.Services.AddTransient<IIntegrationService, SmartStartIntegrationService>();

builder.Services.AddTransient<ICacheService<ITenantCache>, TenantMemoryCacheWrapper>();

builder.Services.AddScoped<TenantService>();
//builder.Services.AddTransient<PostgresTenantSeedService>();
builder.Services.AddTransient<ITenancyRepository, TenantRepository>();


builder.Services.AddTransient<ISystemSettingsService, SystemSettingsService>();
builder.Services.AddMemoryCache();

builder.Services.AddScoped<HierarchyEngine>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<UserManager<ApplicationUser>>();
builder.Services.AddScoped<AttendanceTrackingRepository>();
builder.Services.AddScoped<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddScoped(typeof(IGenericRepositoryFactory), typeof(GenericRepositoryFactory));

builder.Services.AddTransient<PersonnelService>();
builder.Services.AddTransient<IntegrationAPIManager>();
builder.Services.AddTransient<IntegrationLogManager>();
builder.Services.AddTransient<IntegrationHelperManager>();
builder.Services.AddTransient<VisitManager>();
builder.Services.AddTransient<VisitDataManager>();
builder.Services.AddTransient<VisitDataStatusManager>();
builder.Services.AddTransient<UserLicenseManager>();
builder.Services.AddTransient<VisitDataStatusManager_Practitioner>();
builder.Services.AddTransient<VisitBackReferralManager>();
builder.Services.AddTransient<ISchedulerService, ECDLink.AutomatedJobs.Services.SchedulerService>();
builder.Services.AddTransient<IncomeExpenseService>();
builder.Services.AddTransient<AttendanceService>();
builder.Services.AddTransient<IIntegrationService, SmartStartIntegrationService>();
builder.Services.AddTransient<AttendanceService>();
builder.Services.AddTransient<IHolidayService<Holiday>, HolidayService>();
builder.Services.AddTransient<IPointsEngineService, PointsEngineService>();
builder.Services.AddTransient<CustomEmailConfirmationTokenProvider<ApplicationUser>>();
builder.Services.AddTransient<CustomOpenAccessTokenProvider<ApplicationUser>>();
builder.Services.AddTransient(typeof(ISystemSetting<>), typeof(SystemSetting<>));
builder.Services.AddIdentityCore<TenancyIdentityUser>()
    .AddEntityFrameworkStores<PostgresTenancyContext>();
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(config =>
{
    config.Tokens.ProviderMap.Add(
        ProviderKeys.Tokens.EMAIL,
        new TokenProviderDescriptor(typeof(CustomEmailConfirmationTokenProvider<ApplicationUser>))
    );

    config.Tokens.EmailConfirmationTokenProvider = ProviderKeys.Tokens.EMAIL;

    config.Tokens.ProviderMap.Add(
        ProviderKeys.Tokens.OPEN_ACCESS,
        new TokenProviderDescriptor(typeof(CustomOpenAccessTokenProvider<ApplicationUser>))
    );
}).AddEntityFrameworkStores<AuthenticationDbContext>()
              .AddDefaultTokenProviders();

builder.Services.AddDbContextFactory<AuthenticationDbContext>((serviceProvider, options) =>
{
    options.UseNpgsqlTenancy(config);
});
builder.Services.AddScoped<AuthenticationDbContext>(p =>
                p.GetRequiredService<IDbContextFactory<AuthenticationDbContext>>()
                .CreateDbContext());
var franchisor = config.GetSection<FranchisorConfiguration>(TenancyConstants.Configuration.TenantSettings);
builder.Services.AddDbContext<PostgresTenancyContext>(options =>
{
    options.UseNpgsql(franchisor.ConnectionString, b => b.MigrationsAssembly("ECDLink.PostgresTenancy"));
});


IHost host = builder.Build();
host.Run();



