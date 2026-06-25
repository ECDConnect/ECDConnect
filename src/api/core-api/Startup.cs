using DinkToPdf;
using DinkToPdf.Contracts;
using EcdLink.Api.CoreApi.Documents;
using EcdLink.Api.CoreApi.GraphApi.AccessValidators;
using EcdLink.Api.CoreApi.Managers;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Managers.Users;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using EcdLink.Api.CoreApi.Services;
using EcdLink.Api.CoreApi.Services.Interfaces;
using EcdLink.Api.CoreApi.Services.Notifications;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.AzureStorage;
using ECDLink.ContentManagement;
using ECDLink.Core;
using ECDLink.Core.Services;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Diagnostics;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Development;
using ECDLink.EGraphQL;
using ECDLink.FileStorage;
using ECDLink.Moodle;
using ECDLink.Notifications;
using ECDLink.PDFGenerator;
using ECDLink.PostgresTenancy.Repository;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Security;
using ECDLink.Security.AccessModifiers.OpenAccess;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Extensions;
using ECDLink.UrlShortner;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading.RateLimiting;

namespace EcdLink.Api.CoreApi
{
    using EcdLink.Api.CoreApi.Configuration;
    using EcdLink.Api.CoreApi.GraphApi.Models;
    using EcdLink.Api.CoreApi.Middleware;
    using Microsoft.ApplicationInsights;
    using Microsoft.ApplicationInsights.Extensibility;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Cors.Infrastructure;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.HttpOverrides;
    using Microsoft.AspNetCore.ResponseCompression;
    using Microsoft.Extensions.Options;
    using System;
    using System.IO;
    using System.Net.Http;

    public partial class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Environment = env;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            ConfigureAuthContext(services, Configuration);
            SetIdentityUser(services, Configuration);
            ConfigureTenancy(services);

            services.AddHttpContextAccessor();

            ConfigureRateLimiting(services, Configuration);

            ConfigureCorsPolicy(services, Configuration);

            CoreStartup.ConfigureCoreServices(services, Configuration);

            var storageType = GetStorageType();
            if (storageType == "AzureBlob")
                AzureStorageStartup.ConfigureAzureStorageServices(services, Configuration);
            else if (storageType == "FileSystem")
                FileStorageStartup.ConfigureFileStorageServices(services, Configuration);

            DataAccessStartup.ConfigureDataAccessServices(services);

            UrlShortnerStartup.ConfigureUrlShortnerServices(services, Configuration);

            SecurityStartup.ConfigureSecurityServices(services, Configuration);

            GraphStartup.ConfigureGraphQlServices(services, Environment.IsDevelopment());

            ContentManagementStartup.ConfigureContentManagement(services, Configuration);

            NotificationsStartup.ConfigureNotificationServices(services, Configuration);

            PdfGeneratorStartup.ConfigurePdfGeneratorServices(services, Configuration);

            MoodleStartup.ConfigureMoodleServices(services, Configuration);

            // if (Environment.IsDevelopment())
            // {
            DevStartup.ConfigureLocalDevServices(services, Configuration, Environment);
            // }

            services.AddTransient<IOpenAccessValidator<ChildOpenAccessValidator>, ChildOpenAccessValidator>();
            services.AddTransient<IOpenAccessValidator<PrincipalOpenAccessValidator>, PrincipalOpenAccessValidator>();

            services.AddTransient<ITokenManager<ApplicationUser, InvitationTokenManager>, InvitationTokenManager>();
            services.AddTransient<ITokenManager<ApplicationUser, OpenAccessTokenManager>, OpenAccessTokenManager>();
            services.AddTransient<ITokenManager<ApplicationUser, SecurityCodeTokenManager>, SecurityCodeTokenManager>();

            services.AddTransient<SecurityManager>();
            services.AddTransient<IPasswordManager<ApplicationUser>, PasswordManager>();
            services.AddTransient<IAuthenticationManager<ApplicationUser>, SecurityManager>();

            services.AddTransient<IJWTService, JWTService>();
            services.AddTransient<IJWTRepository, JWTRepository>();
            services.AddTransient<SecurityNotificationManager>();
            services.AddTransient<InvitationNotificationManager>();
            services.AddTransient<CaregiverManager>();
            services.AddTransient<InvitationManager>();
            services.AddTransient<VisitManager>();
            services.AddTransient<VisitDataManager>();
            services.AddTransient<VisitDataStatusManager>();
            services.AddTransient<VisitDataStatusManager_Practitioner>();

            services.AddTransient<PersonnelService>();
            services.AddTransient<IPersonnelService, PersonnelService>();
            services.AddTransient<IIncomeExpenseService, IncomeExpenseService>();
            services.AddTransient<AttendanceService>();
            services.AddTransient<IClaimsManager, ClaimsManager>();
            services.AddTransient<IAuthorizationManager, AuthorizationManager>();
            //services.AddTransient<IUserInterceptHandler, UserInterceptHandler>();
            services.AddTransient<IChildrenAnonymiseService, ChildrenAnonymiseService>();
            services.AddTransient<UserAnonymiseService, UserAnonymiseService>();
            services.AddTransient<IDocumentManagementService, DocumentManagementService>();
            services.AddTransient<IReassignmentService, ReassignmentService>();
            services.AddTransient<IAutomatedProcessService, AutomatedProcessService>();
            services.AddTransient<IPointsService, PointsEngineService>();
            services.AddTransient<ITrainingNotificationService, TrainingNotificationService>();
            services.AddTransient<IChildService, ChildService>();
            services.AddTransient<DocumentManager>();
            services.AddTransient<MonthlyAttendanceReport>();
            services.AddTransient<ChildAttendanceReport>();
            services.AddTransient<INotificationService, NotificationService>();
            services.AddTransient<INotificationTasksService, NotificationTasksService>();
            services.AddTransient<IClassroomService, ClassroomService>();
            services.AddTransient<ICommunityService, CommunityService>();
            services.AddTransient<IJourneyService, JourneyService>();
            services.AddTransient<IChildProgressReportService, ChildProgressReportService>();
            services.AddTransient<IAbsenteeService, AbsenteeService>();
            services.AddTransient<IPointsEngineService, PointsEngineService>();

            // Notification tasks (All will be run daily)
            foreach (var notificationTask in Assembly.GetExecutingAssembly().GetTypes()
                 .Where(x => x.GetInterfaces().Contains(typeof(INotificationTask))))
            {
                services.Add(new ServiceDescriptor(typeof(INotificationTask), notificationTask, ServiceLifetime.Transient));
            }

            services.AddSingleton<IConverter, SynchronizedConverter>(serviceProvider =>
            {
                return new SynchronizedConverter(new PdfTools());
            });

            services.AddControllers();

            if (TelemetryEnabled())
            {
                services.AddApplicationInsightsTelemetry();
                services.AddSingleton<TelemetryClient>();
                services.AddSingleton<ITelemetryService, Telemetry.TelemetryService>(serviceProvider =>
                {
                    return new Telemetry.TelemetryService(serviceProvider.GetService<TelemetryClient>());
                });
                services.AddSingleton<ITelemetryInitializer, Telemetry.TelemetryInitializer>();
            }
            else
            {
                services.AddSingleton<ITelemetryService, Telemetry.TelemetryService>(serviceProvider =>
                {
                    return new Telemetry.TelemetryService(null);
                });
            }

            ECDLink.AutomatedJobs.AutomatedJobsStartup.ConfigureServices(services, Configuration);

            services.AddHsts(options =>
            {
                options.MaxAge = TimeSpan.FromDays(365);
                options.IncludeSubDomains = true;
                options.Preload = true;
            });

            ConfigureCompression(services, Configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider, Microsoft.Extensions.Logging.ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                DiagnosticListener.AllListeners.Subscribe(new DiagnosticObserver());

                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            ConfigureResponseHeaders(app);

            // SSRF + long-path protection (blocks the 127.0.0.1 attack immediately)
            ConfigureLongPathProtection(app);

            var compressionSettings = app.ApplicationServices.GetRequiredService<IOptions<ResponseCompressionSettings>>().Value;
            if (compressionSettings.Enabled)
            {
                app.UseResponseCompression();
            }
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
            app.UseRateLimiter();
            app.UseCors("CorsPolicy");
            app.UseCookiePolicy();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseTenancy();
            app.UseUserActivity();
            if (TelemetryEnabled()) app.UseMiddleware<CoreApi.Telemetry.TelemetryMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action}/{id?}");
            });

            SecurityStartup.AddSecurityConfiguration(app);

            GraphStartup.AddGraphConfiguration(app, env);

            MoodleStartup.AddMoodleConfiguration(app, env);
        }

        private void ConfigureResponseHeaders(IApplicationBuilder app)
        {
            var headers = Configuration.GetSection("ResponseHeaders")
                .GetChildren()
                .ToDictionary(x => x.Key, x => x.Value);
            if (headers.Count > 0)
            {
                app.Use(async (context, next) =>
                {
                    foreach (var header in headers)
                    {
                        context.Response.Headers[header.Key] = header.Value;
                    }
                    await next();
                });
            }
        }

        private void ConfigureLongPathProtection(IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                if (context.Request.Method == "POST")
                {
                    var path = context.Request.Path.Value?.ToLowerInvariant() ?? "";

                    // Adjust these if your create endpoint is /api/shorten, /create, /new, etc.
                    if (path == "/" ||
                        path.Contains("shorten") ||
                        path.Contains("create") ||
                        path.Contains("new") ||
                        path.Contains("url"))
                    {
                        context.Request.EnableBuffering();
                        using var reader = new StreamReader(context.Request.Body, leaveOpen: true);
                        var body = await reader.ReadToEndAsync();
                        context.Request.Body.Position = 0;

                        if (body.Length > 50_000 ||
                            body.Contains("127.0.0.1", StringComparison.OrdinalIgnoreCase) ||
                            body.Contains("localhost", StringComparison.OrdinalIgnoreCase) ||
                            body.Contains("169.254.169.254"))
                        {
                            context.Response.StatusCode = 400;
                            await context.Response.WriteAsync("Invalid request");
                            return;
                        }
                    }
                }

                // Global protection against the huge /?/?/?... paths
                if ((context.Request.Path.Value?.Length ?? 0) > 2000 ||
                    (context.Request.QueryString.Value?.Length ?? 0) > 8000)
                {
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsync("Request too large");
                    return;
                }

                await next();
            });
        }


        private void ConfigureRateLimiting(IServiceCollection services, IConfiguration configuration)
        {
            var rateLimitingSettings = Configuration.GetSection("RateLimiting").Get<RateLimitingSettings>() ?? new RateLimitingSettings();

            services.AddRateLimiter(options =>
            {
                if (rateLimitingSettings.PerClient.Limit > 0)
                {
                    options.AddPolicy("PerClient", context =>
                        RateLimitPartition.GetFixedWindowLimiter(
                            partitionKey: context.Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                            factory: _ => new FixedWindowRateLimiterOptions
                            {
                                PermitLimit = rateLimitingSettings.PerClient.Limit,
                                Window = TimeSpan.FromSeconds(rateLimitingSettings.PerClient.PeriodInSeconds),
                                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                                QueueLimit = 0
                            }));
                }

                if (rateLimitingSettings.Global.Limit > 0)
                {
                    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                        RateLimitPartition.GetFixedWindowLimiter(
                            partitionKey: "Global",
                            factory: _ => new FixedWindowRateLimiterOptions
                            {
                                PermitLimit = rateLimitingSettings.Global.Limit,
                                Window = TimeSpan.FromSeconds(rateLimitingSettings.Global.PeriodInSeconds)
                            }));
                }

                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

                options.OnRejected = async (context, token) =>
                {
                    context.HttpContext.Response.ContentType = "application/json";
                    await context.HttpContext.Response.WriteAsync(
                        "{\"errors\":[{\"message\":\"Too many requests. Please try again later.\"}]}", token);
                };
            });
        }

        private void ConfigureCorsPolicy(IServiceCollection services, IConfiguration configuration)
        {
            var corsPolicySettings = Configuration.GetSection("CorsPolicy").Get<CorsPolicySettings>() ?? new CorsPolicySettings();

            // Should rather use CorsPolicy__Origins in App Service Env variable which will override the value in appsettings.json, but keeping this for backward compatibility for now
            var corsAllowedDomainsEnv = System.Environment.GetEnvironmentVariable("CORS_ALLOWED_DOMAINS");
            if (!string.IsNullOrEmpty(corsAllowedDomainsEnv)) corsPolicySettings.Origins = corsAllowedDomainsEnv;

            services.AddCors(options => options.AddPolicy("CorsPolicy", builder => builder
                            .WithMethods(corsPolicySettings.Methods.Split(","))
                            .WithHeaders(corsPolicySettings.Headers.Split(","))
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .WithOrigins(corsPolicySettings.Origins.Split(","))
                            .WithExposedHeaders(corsPolicySettings.ExposeHeaders.Split(","))
                        ));
        }

        private void ConfigureCompression(IServiceCollection services, IConfiguration configuration)
        {
            var compressionSettings = Configuration.GetSection("ResponseCompression").Get<ResponseCompressionSettings>() ?? new ResponseCompressionSettings();

            if (compressionSettings.Enabled)
            {
                services.AddResponseCompression(options =>
                {
                    options.EnableForHttps = true;
                    options.ExcludedMimeTypes = compressionSettings.ExcludeMimeTypes;
                    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(compressionSettings.MimeTypes);
                    options.Providers.Add<BrotliCompressionProvider>();
                    options.Providers.Add<GzipCompressionProvider>();
                });
                // Configure compression levels
                services.Configure<GzipCompressionProviderOptions>(options =>
                {
                    options.Level = System.IO.Compression.CompressionLevel.Optimal;
                });

                services.Configure<BrotliCompressionProviderOptions>(options =>
                {
                    options.Level = System.IO.Compression.CompressionLevel.Optimal;
                });
            }
        }

        private bool TelemetryEnabled()
        {
            var aiConnString = System.Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING");
            if (!string.IsNullOrEmpty(aiConnString)) return true;
            var aiConfig = Configuration.GetSection("ApplicationInsights");
            if (aiConfig == null) return false;
            aiConnString = aiConfig["ConnectionString"];
            if (!string.IsNullOrEmpty(aiConnString)) return true; ;
            return false;
        }

        private string GetStorageType()
        {
            var section = Configuration.GetSection("Storage");
            if (section == null) return "FileSystem";
            var type = section["Type"];
            if (string.IsNullOrEmpty(type)) return "FileSystem";
            return type;
        }
    }
}