using EcdLink.Api.CoreApi.Documents;
using EcdLink.Api.CoreApi.GraphApi.AccessValidators;
using EcdLink.Api.CoreApi.GraphApi.Interceptors;
using EcdLink.Api.CoreApi.Managers;
using EcdLink.Api.CoreApi.Managers.EventRecords;
//using EcdLink.Api.CoreApi.Managers.Integration;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Managers.Users;
using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using EcdLink.Api.CoreApi.Services;
using ECDLink.AzureStorage;
using ECDLink.ContentManagement;
using ECDLink.Core;
using ECDLink.Core.Services;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Diagnostics;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Development;
using ECDLink.EGraphQL;
using ECDLink.EGraphQL.Interceptors;
using ECDLink.Moodle;
using ECDLink.Notifications;
using ECDLink.PDFGenerator;
using ECDLink.PostgresTenancy;
using ECDLink.PostgresTenancy.Repository;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Security;
using ECDLink.Security.AccessModifiers.OpenAccess;
using ECDLink.Security.Managers;
using ECDLink.SmartStart;
using ECDLink.SmartStart.Services;
using ECDLink.Tenancy.Extensions;
using ECDLink.UrlShortner;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Diagnostics;
using ECDLink.AutomatedJobs.Services;
using ECDLink.AutomatedJobs.Services.Interfaces;
using EcdLink.Api.CoreApi.Managers.Integration;

namespace EcdLink.Api.CoreApi
{
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
                corsAllowedDomainsEnv = "https://ecdconnect.co.za,https://*.ecdconnect.co.za,https://*.ecdlink.co.za,https://*.azurewebsites.net,http://localhost:3001,http://localhost:3000,https://smartstart-ecdconnect-co-za-funda.datafree.co";
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
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .SetIsOriginAllowed(origin => true)
                            .WithOrigins(corsAllowedDomains)
                            .WithExposedHeaders("WWW-Authenticate")
                        ));

            CoreStartup.ConfigureCoreServices(services, Configuration);

            PostgresTenancyStartup.ConfigureDataAccessServices(services, Configuration);

            AzureStorageStartup.ConfigureAzureStorageServices(services, Configuration);

            DataAccessStartup.ConfigureDataAccessServices(services);

            UrlShortnerStartup.ConfigureUrlShortnerServices(services, Configuration);

            SecurityStartup.ConfigureSecurityServices(services, Configuration);

            GraphStartup.ConfigureGraphQlServices(services, Environment.IsDevelopment());

            ContentManagementStartup.ConfigureContentManagement(services, Configuration);

            NotificationsStartup.ConfigureNotificationServices(services, Configuration);

            PdfGeneratorStartup.ConfigureAzureStorageServices(services, Configuration);

            SmartStartStartup.ConfigureSmartStartServices(services, Environment.IsDevelopment());

            MoodleStartup.ConfigureMoodleServices(services, Configuration);

            if (Environment.IsDevelopment())
            {
                DevStartup.ConfigureLocalDevServices(services, Configuration);
            }

            services.AddTransient<IOpenAccessValidator<ChildOpenAccessValidator>, ChildOpenAccessValidator>();

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
            services.AddTransient<HealthCareWorkerManager>();
            services.AddTransient<CaregiverManager>();
            services.AddTransient<MotherManager>();
            services.AddTransient<EventRecordManager>();
            services.AddTransient<InfantManager>();
            services.AddTransient<VisitManager>();
            services.AddTransient<VisitDataManager>();
            services.AddTransient<VisitDataStatusManager>();
            services.AddTransient<VisitDataStatusManager_Practitioner>();
            services.AddTransient<VisitBackReferralManager>();
            services.AddTransient<UserLicenseManager>();
            services.AddTransient<PersonnelService>();
            services.AddTransient<ChildManager>();
            services.AddTransient<IncomeExpenseService>();
            services.AddTransient<AttendanceService>();
            services.AddTransient<IClaimsManager, ClaimsManager>();
            services.AddTransient<IAuthorizationManager, AuthorizationManager>();
            services.AddTransient<IUserInterceptHandler, UserInterceptHandler>();
            services.AddTransient<IChildrenAnonymiseService, ChildrenAnonymiseService>();
            services.AddTransient<IDocumentManagementService, DocumentManagementService>();
            services.AddTransient<IReassignmentService, ReassignmentService>();
            services.AddTransient<IIntegrationService, SmartStartIntegrationService>();
            services.AddTransient<ISchedulerService, SchedulerService>();
            services.AddTransient<IPointsEngineService, PointsEngineService>();
            services.AddTransient<IntegrationAPIManager>();
            services.AddTransient<IntegrationLogManager>();
            services.AddTransient<IntegrationHelperManager>();
            services.AddTransient<DocumentManager>();

            ConfigureJobs(services);
            
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                DiagnosticListener.AllListeners.Subscribe(new DiagnosticObserver());

                app.UseDeveloperExceptionPage();
            }

            app.UseCors("CorsPolicy");

            app.UseCookiePolicy();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseTenancy();
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
    }
}
