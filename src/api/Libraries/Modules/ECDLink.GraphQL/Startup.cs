using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Interceptors;
using ECDLink.EGraphQL.ObjectTypes.Input;
using ECDLink.EGraphQL.Registration;
using ECDLink.EGraphQL.Registration.Modules;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

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
              .AddFiltering()
              .AddSorting()
              .RegisterDbContext<AuthenticationDbContext>(HotChocolate.Data.DbContextKind.Synchronized)
              .RegisterService<HierarchyEngine>(ServiceKind.Synchronized)
              .RegisterService<IDbContextFactory<AuthenticationDbContext>>(ServiceKind.Synchronized)
              .RegisterService<ApplicationUserManager>(ServiceKind.Synchronized)
              .RegisterService<IGenericRepositoryFactory>(ServiceKind.Synchronized);

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