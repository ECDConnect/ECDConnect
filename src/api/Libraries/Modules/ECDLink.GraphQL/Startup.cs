using ECDLink.DataAccessLayer.Context;
using ECDLink.EGraphQL.DataLoaders;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Interceptors;
using ECDLink.EGraphQL.Registration;
using ECDLink.EGraphQL.Registration.Modules;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.AspNetCore;
using HotChocolate.AspNetCore.Formatters;
using HotChocolate.Data;
using HotChocolate.Execution;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;
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
              // v13 adopts the GraphQL-over-HTTP spec by default, which returns non-2xx status
              // codes for validation and execution errors. Both clients assume the older
              // always-200 behaviour - the PWA treats any non-200 as a connection failure in
              // axios.helper.ts, and axios rejects non-2xx before that check even runs - so errors
              // would surface to users as lost connectivity on an offline-first app. Legacy keeps
              // the v12 contract. Adopting the spec belongs in its own change, with the client work.
              // (v16 moved this from IServiceCollection onto the GraphQL builder.)
              .AddHttpResponseFormatter(new HttpResponseFormatterOptions
              {
                  HttpTransportVersion = HttpTransportVersion.Legacy,
              })
              // Keeps v12 field casing across Hot Chocolate majors - see LegacyNamingConventions.
              .AddConvention<INamingConventions, LegacyNamingConventions>()
              .AddDataLoader<UserRolesGroupedDataLoader>()
              // v16 hands these factories the schema service provider, which does not contain
              // IHttpContextAccessor, ILogger<> or IWebHostEnvironment. The constructors use
              // GetService, so they would get nulls and silently stop logging to Application
              // Insights rather than fail. GetRootServiceProvider() is the application provider
              // they were given up to v15.
              .AddErrorFilter<Diagnostic.ErrorFilter>(services => new Diagnostic.ErrorFilter(services.GetRootServiceProvider()))
              .AddDiagnosticEventListener<Diagnostic.AppServerDiagnosticEventListener>(services => new Diagnostic.AppServerDiagnosticEventListener(services.GetRootServiceProvider()))
              .AddDiagnosticEventListener<Diagnostic.AppExecutionDiagnosticEventListener>(services => new Diagnostic.AppExecutionDiagnosticEventListener(services.GetRootServiceProvider()))
              //.AddDiagnosticEventListener<Diagnostic.AppDataLoaderDiagnosticEventListener>(services => new Diagnostic.AppDataLoaderDiagnosticEventListener(services))
              .ModifyOptions(o =>
              {
                  o.DefaultResolverStrategy = HotChocolate.Execution.ExecutionStrategy.Serial;

                  // v14 removed RegisterService and RegisterDbContext, along with ServiceKind
                  // and DbContextKind, and changed the default to a fresh service scope per
                  // resolver and per DataLoader dispatch. Request scope keeps the v12/v13
                  // semantics - one scope and one DbContext shared for the whole request - which
                  // is what RegisterDbContext(DbContextKind.Synchronized) and
                  // RegisterService(ServiceKind.Synchronized) used to give us.
                  //
                  // What this protects is the ~56 places in core-api/GraphApi that take an
                  // AuthenticationDbContext directly as a resolver parameter, where per-resolver
                  // scoping would stop entity change tracking spanning resolvers within one
                  // request. It is safe because DefaultResolverStrategy is Serial - nothing
                  // executes concurrently, which is why sharing one context was never a race.
                  //
                  // It is NOT what protects the nine explicit BeginTransaction sites: those all
                  // call dbFactory.CreateDbContext(), which returns a fresh context regardless
                  // of DI scope, so they never depended on this setting either way. (Eight of
                  // those nine open the transaction on that context and then do their work
                  // through a different one, so they are not atomic at all - a pre-existing bug,
                  // unrelated to the upgrade, and worth its own ticket.)
                  o.DefaultQueryDependencyInjectionScope = DependencyInjectionScope.Request;
                  o.DefaultMutationDependencyInjectionScope = DependencyInjectionScope.Request;
              })
              .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = isDevelopment)
              .AddQueryType<Query>()
              .ModifyRequestOptions(opt => opt.ExecutionTimeout = System.TimeSpan.FromMinutes(2))
              .AddTypeModule(sp => new ContentTypeModule(contentReloader))
              .AddTypeModule(sp => new SettingsModule(contentReloader))
              .AddMutationType<Mutation>()
              .AddType<UploadType>()
              // Keeps v12-v15 DateTime output across Hot Chocolate majors. Must be a new instance
              // per schema build, or CMS reloads fail silently - see LegacyDateTime.
              .ConfigureSchema(b => b.AddType(LegacyDateTime.Create()))
              .AddDirectiveType<TokenAccessDirectiveType>()
              .AddDirectiveType<PermissionDirectiveType>()
              // v14 replaced the complexity analyser with cost analysis, on and enforcing by
              // default. It annotates ~1,780 fields and arguments with @cost weights and would
              // start rejecting operations that exceed its limits - a new runtime failure mode
              // for a hop that is meant to change nothing observable, and one that would first
              // show up as users being unable to load a screen. The annotations are harmless and
              // stay; enforcement is off until it can be turned on deliberately, with the limits
              // measured against the 223 persisted operations rather than guessed at.
              .ModifyCostOptions(o => o.EnforceCostLimits = false)
              // v16 adds two more limits that are on by default and would reject or queue
              // legitimate traffic: at most 64 executions in flight (the rest wait, and the wait
              // counts against ExecutionTimeout), and at most 64 operations per filter argument
              // (error HC0117) - the admin portal builds its filters dynamically. Same reasoning
              // as cost enforcement above: off for the upgrade, a deliberate decision later.
              .ModifyServerOptions(o => o.MaxConcurrentExecutions = null)
              .AddProjections()
              .AddFiltering(c => c.AddDefaults().MaxAllowedFilterOperations(null))
              .AddSorting()
              // v16 removed AllowIntrospection from the builder. Note the inverted polarity:
              // introspection stays allowed in development only, as before.
              .DisableIntrospection(!isDevelopment)
              .UseExceptions()
              .UseTimeout()
              .UseDocumentCache()
              .UseReadPersistedOperation()
              .UseDocumentParser()
              .UseDocumentValidation()
              .UseOperationCache()
              .UseOperationCompiler()
              .UseRequest(next => async context => await GraphQLRequestMiddleware(next, context))
              .UseOperationVariableCoercion()
              .UseOperationExecution()
              // v13's read-only variant is gone; v14 has one file-system storage implementing
              // the read/write IOperationDocumentStorage. Still effectively read-only here,
              // because writes only happen through the automatic-persisted-operations
              // middleware and this pipeline only reads (UseReadPersistedOperation above).
              .AddFileSystemOperationDocumentStorage(System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "PersistedQueries"));

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
                 .WithOptions(options => options.Tool.Enable = graphQLPlaygroundEnabled);
             });
        }

        private static async ValueTask GraphQLRequestMiddleware(
            RequestDelegate next,
            RequestContext context)
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
                    if (IsServedFromPersistedDocument(context))
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
            else if (IsServedFromPersistedDocument(context))
            {
                await next(context);
                return;
            }
            var error = ErrorBuilder.New().SetMessage("Persisted Operations Only").Build();
            context.Result = new OperationResult([error]);
        }

        // True when the client sent only an id and the document came from the persisted
        // store or the document cache, i.e. the client did not supply operation text.
        // v16 moved IsCachedDocument/IsPersistedDocument onto OperationDocumentInfo.
        private static bool IsServedFromPersistedDocument(RequestContext context)
            => context.Request.Document is null
                && (context.OperationDocumentInfo.IsCached || context.OperationDocumentInfo.IsPersisted);

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
