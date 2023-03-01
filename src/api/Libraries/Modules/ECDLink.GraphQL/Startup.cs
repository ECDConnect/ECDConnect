using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Interceptors;
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
        public static void ConfigureGraphQlServices(IServiceCollection services, bool isDevelop = false)
        {
            var contentReloader = new DynamicContentReload();

            services.AddSingleton(contentReloader);

            services.AddHttpContextAccessor();

            var builder = services
              .AddGraphQLServer()
              .AddQueryType<Query>()
              .AddTypeModule(sp => new ContentTypeModule(contentReloader))
              .AddTypeModule(sp => new SettingsModule(contentReloader))
              .AddMutationType<Mutation>()
              .AddType<UploadType>()
              .AddDirectiveType<TokenAccessDirectiveType>()
              .AddDirectiveType<PermissionDirectiveType>()
              .AddFiltering()
              .RegisterDbContext<AuthenticationDbContext>(HotChocolate.Data.DbContextKind.Resolver)
              .RegisterDbContext<PostgresTenancyContext>(HotChocolate.Data.DbContextKind.Resolver)
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
