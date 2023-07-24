using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Interceptors;
using ECDLink.EGraphQL.ObjectTypes.Input;
using ECDLink.EGraphQL.Registration;
using ECDLink.EGraphQL.Registration.Modules;
using ECDLink.PostgresTenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

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
              .AddTypeModule(sp => new ContentTypeModule(contentReloader))
              .AddTypeModule(sp => new SettingsModule(contentReloader))
              .AddMutationType<Mutation>()
              .AddType<UploadType>()
              .AddType<Abstractrions.GraphQL.Attributes.FilterByField>()
              .AddType<Abstractrions.GraphQL.Attributes.SortByField>()
              .AddDirectiveType<TokenAccessDirectiveType>()
              .AddDirectiveType<PermissionDirectiveType>()
              .AddFiltering()
              .AddSorting()
              .RegisterDbContext<AuthenticationDbContext>(HotChocolate.Data.DbContextKind.Synchronized)
              .RegisterDbContext<PostgresTenancyContext>(HotChocolate.Data.DbContextKind.Synchronized)
              .RegisterService<HierarchyEngine>(ServiceKind.Synchronized)
              .RegisterService<IDbContextFactory<AuthenticationDbContext>>(ServiceKind.Synchronized)
              .RegisterService<UserManager<ApplicationUser>>(ServiceKind.Synchronized)
              .RegisterService<IGenericRepositoryFactory>(ServiceKind.Synchronized);

            builder = builder
                .AddAuthorization()
                .AddHttpRequestInterceptor<UserContextInterceptor>();

            GraphServiceRegistration.RegisterExtensions(builder);
        }

        public static void AddGraphConfiguration(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseEndpoints(endpoints =>
             {
                 endpoints.MapGraphQL();
             });
        }
    }
}
