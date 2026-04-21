using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Interceptors;
using ECDLink.EGraphQL.Registration;
using ECDLink.EGraphQL.Registration.Modules;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace ECDLink.EGraphQL
{
    public static class GraphStartup
    {
        public static void ConfigureGraphQlServices(IServiceCollection services, bool isDevelopment)
        {
            const int maxRequestSize = 128 * 1024 * 1024;

            var contentReloader = new DynamicContentReload();

            services.AddSingleton(contentReloader);
            services.AddHttpContextAccessor();

            var builder = services
              .AddGraphQLServer(maxAllowedRequestSize: maxRequestSize)
              //.AddErrorFilter<Diagnostic.ErrorFilter>(services => new Diagnostic.ErrorFilter(services))
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
              .UseRequest(next => async context =>
              {
                  //if (context.Request.Query is null && (context.IsCachedDocument || context.IsPersistedDocument))
                  {
                      await next(context);
                      return;
                  }
                  //var error = ErrorBuilder.New().SetMessage("Persisted Operations Only").Build();
                  //context.Result = QueryResultBuilder.CreateError(error);
              })
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
            var envEnableGraphQLPlayground = System.Environment.GetEnvironmentVariable("ENABLE_GRAPHQL_PLAYGROUND");
            bool enableGraphQLPlayground = env.IsDevelopment();
            if (!string.IsNullOrEmpty(envEnableGraphQLPlayground))
            {
                if (envEnableGraphQLPlayground == "1")
                    enableGraphQLPlayground = true;
                else if (envEnableGraphQLPlayground == "0")
                    enableGraphQLPlayground = false;
            }

            app.UseEndpoints(endpoints =>
             {
                 endpoints.MapGraphQL().WithOptions(new HotChocolate.AspNetCore.GraphQLServerOptions()
                 {
                     Tool = { Enable = enableGraphQLPlayground }
                 });
             });
        }
    }
}