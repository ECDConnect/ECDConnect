using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Interceptors;
using ECDLink.EGraphQL.Registration;
using ECDLink.EGraphQL.Registration.Modules;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL
{
    public static class GraphStartup
    {
        private enum QUERY_PERSISTENCE
        {
            Enabled = 2,
            PartiallyEnabled = 1,
            Disabled = 0
        }

        private static bool graphQLPlaygroundEnabled = false;
        private static QUERY_PERSISTENCE graphQLQueryPersistenceEnabled = QUERY_PERSISTENCE.PartiallyEnabled;

        public static void ConfigureGraphQlServices(IServiceCollection services, bool isDevelopment)
        {
            const int maxRequestSize = 128 * 1024 * 1024;

            graphQLPlaygroundEnabled = GraphQLPlaygroundEnabled(isDevelopment);
            graphQLQueryPersistenceEnabled = GraphQLQueryPersistenceEnabled(QUERY_PERSISTENCE.Enabled);

            var contentReloader = new DynamicContentReload();

            services.AddSingleton(contentReloader);
            services.AddHttpContextAccessor();

            var builder = services
              .AddGraphQLServer(maxAllowedRequestSize: maxRequestSize)
              .AddErrorFilter<Diagnostic.ErrorFilter>(services => new Diagnostic.ErrorFilter(services))
              .AddDiagnosticEventListener<Diagnostic.AppServerDiagnosticEventListener>(services => new Diagnostic.AppServerDiagnosticEventListener(services))
              .AddDiagnosticEventListener<Diagnostic.AppExecutionDiagnosticEventListener>(services => new Diagnostic.AppExecutionDiagnosticEventListener(services))
              //.AddDiagnosticEventListener<Diagnostic.AppDataLoaderDiagnosticEventListener>(services => new Diagnostic.AppDataLoaderDiagnosticEventListener(services))
              .ModifyOptions(o => o.DefaultResolverStrategy = HotChocolate.Execution.ExecutionStrategy.Serial)
              .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = isDevelopment)
              .AddQueryType<Query>()
              .SetRequestOptions(_ => new HotChocolate.Execution.Options.RequestExecutorOptions { ExecutionTimeout = System.TimeSpan.FromMinutes(2) })
              .AddTypeModule(sp => new ContentTypeModule(contentReloader))
              .AddTypeModule(sp => new SettingsModule(contentReloader))
              .AddMutationType<Mutation>()
              .AddType<UploadType>()
              .AddDirectiveType<TokenAccessDirectiveType>()
              .AddDirectiveType<PermissionDirectiveType>()
              .AddProjections()
              .AddFiltering()
              .AddSorting()
              .RegisterDbContext<AuthenticationDbContext>(HotChocolate.Data.DbContextKind.Synchronized)
              .RegisterService<HierarchyEngine>(ServiceKind.Synchronized)
              .RegisterService<IDbContextFactory<AuthenticationDbContext>>(ServiceKind.Synchronized)
              .RegisterService<ApplicationUserManager>(ServiceKind.Synchronized)
              .RegisterService<IGenericRepositoryFactory>(ServiceKind.Synchronized)
              .AllowIntrospection(isDevelopment)
              .UseExceptions()
              .UseTimeout()
              .UseDocumentCache()
              .UseReadPersistedQuery()
              .UseDocumentParser()
              .UseDocumentValidation()
              .UseOperationCache()
              .UseOperationResolver()
              .UseRequest(next => async context => await GraphQLRequestMiddleware(next, context))
              .UseOperationVariableCoercion()
              .UseOperationExecution()
              .AddReadOnlyFileSystemQueryStorage(System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "PersistedQueries"));

            builder = builder
                .AddAuthorization()
                .AddHttpRequestInterceptor<UserContextInterceptor>();

            GraphServiceRegistration.RegisterExtensions(builder);
        }

        public static void AddGraphConfiguration(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseEndpoints(endpoints =>
             {
                 endpoints.MapGraphQL().RequireRateLimiting("GraphQLPolicy")
                 .WithOptions(new HotChocolate.AspNetCore.GraphQLServerOptions()
                 {
                     Tool = { Enable = graphQLPlaygroundEnabled }
                 });
             });
        }

        private static async ValueTask GraphQLRequestMiddleware(
            RequestDelegate next,
            IRequestContext context)
        {
            if (graphQLQueryPersistenceEnabled == QUERY_PERSISTENCE.Disabled)
            {
                await next(context);
                return;
            }
            var httpContext = context.Request.ContextData["HttpContext"] as Microsoft.AspNetCore.Http.HttpContext;
            var userSupportPersistedQueries = httpContext.GetUserSupportPersistedQueries();
            if (httpContext.IsTenantAdminPortal() || httpContext.IsBackend())
            {
                await next(context);
                return;
            }
            else if (graphQLQueryPersistenceEnabled == QUERY_PERSISTENCE.PartiallyEnabled)
            {
                if (userSupportPersistedQueries)
                {
                    if (context.Request.Query is null && (context.IsCachedDocument || context.IsPersistedDocument))
                    {
                        await next(context);
                        return;
                    }
                }
                else
                {
                    await next(context);
                    return;
                }
            }
            else if (context.Request.Query is null && (context.IsCachedDocument || context.IsPersistedDocument))
            {
                await next(context);
                return;
            }
            var error = ErrorBuilder.New().SetMessage("Persisted Operations Only").Build();
            context.Result = QueryResultBuilder.CreateError(error);
        }

        private static bool GraphQLPlaygroundEnabled(bool defaultValue = false)
        {
            var value = System.Environment.GetEnvironmentVariable("ENABLE_GRAPHQL_PLAYGROUND");
            if (string.IsNullOrEmpty(value))
                return defaultValue;
            var enabled = bool.TryParse(value, out var b) ? b : value == "1";
            return enabled;
        }
        
        private static QUERY_PERSISTENCE GraphQLQueryPersistenceEnabled(QUERY_PERSISTENCE defaultValue = QUERY_PERSISTENCE.PartiallyEnabled)
        {
            var value = Environment.GetEnvironmentVariable("ENABLE_GRAPHQL_QUERYPERSISTENCE");
            if (string.IsNullOrEmpty(value))
                return defaultValue;
            int.TryParse(value, out var enabled);
            return (QUERY_PERSISTENCE)enabled;
        }
    }
}