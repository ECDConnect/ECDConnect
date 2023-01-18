using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Interceptors;
using ECDLink.EGraphQL.ObjectTypes;
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
              .RegisterDbContext<AuthenticationDbContext>(HotChocolate.Data.DbContextKind.Synchronized)
              .RegisterDbContext<PostgresTenancyContext>()
              .RegisterService<IDbContextFactory<AuthenticationDbContext>>()
              .RegisterService<UserManager<ApplicationUser>>()
              .RegisterService<IGenericRepositoryFactory>()
              .AddQueryType<Query>()
              .AddTypeModule(sp => new ContentTypeModule(contentReloader))
              .AddTypeModule(sp => new SettingsModule(contentReloader))
              .AddMutationType<Mutation>()
              .AddType<UploadType>()
              .AddType<SettingsType>()
              .AddDirectiveType<TokenAccessDirectiveType>()
              .AddDirectiveType<PermissionDirectiveType>()
              .AddFiltering();

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
