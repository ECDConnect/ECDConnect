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
using Microsoft.AspNetCore.Http;
using HotChocolate.Execution.Configuration; // For IRequestExecutorBuilder
using HotChocolate;
using HotChocolate.Execution;
using System; // General HotChocolate namespace

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

            // // Explicitly enable schema definition requests
            // builder.ModifyOptions(opt =>
            // {
            //     opt.EnableSchemaRequests = true; // Enables SDL schema endpoint requests
            // });

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

                //  endpoints.MapGraphQL().RequireCors("CorsPolicy"); TODO - Add this as a test when CORS still fails

                 // Explicitly map schema.graphql endpoint
                 //  endpoints.MapGet("/graphql/schema.graphql", async context =>
                 //  {
                 //      var schema = app.ApplicationServices.GetRequiredService<HotChocolate.Execution.IRequestExecutor>().Schema;
                 //      await context.Response.WriteAsync(schema.ToString());
                 //  });

                 endpoints.MapGet("/graphql/schema.graphql", async context =>
                    {
                        try
                        {
                            var requestExecutor = context.RequestServices.GetService<IRequestExecutor>();
                            if (requestExecutor == null)
                            {
                                await context.Response.WriteAsync("IRequestExecutor not registered");
                                return;
                            }

                            var schema = requestExecutor.Schema;
                            await context.Response.WriteAsync(schema.ToString() ?? "Schema not available");
                        }
                        catch (Exception ex)
                        {
                            await context.Response.WriteAsync($"Error: {ex.Message}");
                        }
                    });

                //  endpoints.MapGet("/graphql/schema.graphql", async context =>
                // {
                //     var schema = app.ApplicationServices
                //         .GetRequiredService<HotChocolate.Execution.IRequestExecutor>()
                //         .Schema;

                //     await context.Response.WriteAsync(schema.ToString() ?? "Schema not available");
                // });
             });
        }
    }
}
