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
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Reflection;

namespace EcdLink.Api.CoreApi
{
    using EcdLink.Api.CoreApi.GraphApi.Models;
    using EcdLink.Api.CoreApi.Middleware;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Http;
    using System;
    using System.Threading.Tasks;

    public static class MaintainCorsExtension
    {
        public static IApplicationBuilder MaintainCorsHeadersOnError(this IApplicationBuilder builder)
        {
            return builder.Use(async (httpContext, next) =>
            {
                string timestamp = DateTime.Now.Ticks.ToString();
                string path = httpContext.Request.Path;
                string origin = httpContext.Request.Headers.Origin;
                Console.WriteLine("{0}: {1} {2}", timestamp, path, origin);
                //var corsHeaders = new HeaderDictionary();
                //foreach (var pair in httpContext.Response.Headers)
                //{
                //    if (!pair.Key.StartsWith("access-control-", StringComparison.InvariantCultureIgnoreCase)) { continue; }
                //    corsHeaders[pair.Key] = pair.Value;
                //}

                httpContext.Response.OnStarting(o => {
                    var ctx = (HttpContext)o;
                    var headers = ctx.Response.Headers;
                    Console.WriteLine("{0}: {1} {2} {3}", timestamp, path, ctx.Response.Headers.AccessControlAllowOrigin, origin);
                    //ctx.Response.Headers.AccessControlAllowOrigin = origin;
                    //Console.WriteLine("{0}: {1} {2} {3}", timestamp, path, ctx.Response.Headers.AccessControlAllowOrigin, origin);
                    //foreach (var pair in corsHeaders)
                    //{
                    //    if (headers.ContainsKey(pair.Key))
                    //    {
                    //        headers[pair.Key] = pair.Value;
                    //    }
                    //    else
                    //    {
                    //        headers.Add(pair.Key, pair.Value);
                    //    }
                    //}
                    return Task.CompletedTask;
                }, httpContext);

                await next();
            });
        }
    }

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
            SetIdentityUser(services);
            ConfigureTenancy(services);

            services.AddHttpContextAccessor();

            // We are explicitly setting these because of CORS issues on .datafree.co
            var corsAllowedDomainsEnv = System.Environment.GetEnvironmentVariable("CORS_ALLOWED_DOMAINS");
            if (string.IsNullOrEmpty(corsAllowedDomainsEnv))
            {
                corsAllowedDomainsEnv = "https://ecdconnect.co.za,https://*.ecdconnect.co.za,https://*.azurewebsites.net,https://portal.smartstart.ecdconnect.co.za,https://portal.chwconnect.ecdconnect.co.za,http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3005,https://*.datafree.co,https://*.sbox.datafree.co";
            }
            //var allowedDomains = new[] { "https://ecdconnect.co.za",
            //"https://ecdconnect-co-za-fundasmartstart.datafree.co",
            //"https://*.ecdconnect.co.za",
            //"https://*.ecdlink.co.za",
            //"https://*.azurewebsites.net",
            //"http://localhost:3001",
            //"http://localhost:3000" ,
            //"https://smartstart-ecdconnect-co-za-funda.datafree.co"};

            var corsAllowedDomains = corsAllowedDomainsEnv.Split(",");
            services.AddCors(options => options.AddPolicy("CorsPolicy", builder => builder
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials()
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .SetIsOriginAllowed(origin => true)
                            .WithOrigins(corsAllowedDomains)
                            .WithExposedHeaders("WWW-Authenticate")
                        ));

            //services.AddHttpLogging(logging =>
            //{
            //    logging.LoggingFields = HttpLoggingFields.All;
            //    logging.RequestHeaders.Add("Origin");
            //    logging.ResponseHeaders.Add("Access-Control-Allow-Origin");
            //    logging.MediaTypeOptions.AddText("application/javascript");
            //    logging.RequestBodyLogLimit = 4096;
            //    logging.ResponseBodyLogLimit = 4096;
            //});

            CoreStartup.ConfigureCoreServices(services, Configuration);

            //PostgresTenancyStartup.ConfigureDataAccessServices(services, Configuration);

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
            services.AddTransient<IChildService, ChildService>();
            services.AddTransient<DocumentManager>();
            services.AddTransient<MonthlyAttendanceReport>();
            services.AddTransient<ChildAttendanceReport>();
            services.AddTransient<INotificationService, NotificationService>();
            services.AddTransient<INotificationTasksService, NotificationTasksService>();
            services.AddTransient<IClassroomService, ClassroomService>();
            services.AddTransient<ICommunityService, CommunityService>();
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

            if (TelemtryEnabled()) services.AddApplicationInsightsTelemetry();

            ECDLink.AutomatedJobs.AutomatedJobsStartup.ConfigureServices(services, Configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider, Microsoft.Extensions.Logging.ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                DiagnosticListener.AllListeners.Subscribe(new DiagnosticObserver());

                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpLogging();
            //app.MaintainCorsHeadersOnError();
            app.UseCors("CorsPolicy");
            app.UseCookiePolicy();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseTenancy();
            app.UseUserActivity();

            if (TelemtryEnabled()) app.UseMiddleware<CoreApi.Telemetry.TelemetryMiddleware>();
            // TODO: Can't upload images through CKEditor without bypassing Json sanitizer, update or replace.
            //app.UseInputSanitizer();

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

        bool TelemtryEnabled()
        {
            var aiConnString = System.Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING");
            if (!string.IsNullOrEmpty(aiConnString)) return true;
            var aiConfig = Configuration.GetSection("ApplicationInsights");
            if (aiConfig == null) return false;
            aiConnString = aiConfig["ConnectionString"];
            if (!string.IsNullOrEmpty(aiConnString)) return true; ;
            return false;
        }

        string GetStorageType()
        {
            var section = Configuration.GetSection("Storage");
            if (section == null) return "FileSystem";
            var type = section["Type"];
            if (string.IsNullOrEmpty(type)) return "FileSystem";
            return type;
        }
    }
}