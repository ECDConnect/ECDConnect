using ECDLink.ContentManagement.Configuration.Setup;
using ECDLink.ContentManagement.GraphQL.Resolvers;
using ECDLink.ContentManagement.Repositories;
using ECDLink.ContentManagement.Services;
using ECDLink.EGraphQL.ObjectTypes.Services;
using ECDLink.EGraphQL.Resolvers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ECDLink.ContentManagement
{
    public static class ContentManagementStartup
    {
        public static void ConfigureContentManagement(IServiceCollection services, IConfiguration config, bool isDevelop = false)
        {
            services.AddTransient<ContentDefinitionRepository>();
            services.AddTransient<ContentManagementRepository>();
            services.AddTransient<ContentTypeRepository>();
            services.AddTransient<IDynamicTypeDefinitionService, DynamicTypeDefinitionService>();
            services.AddTransient<IDynamicQueryResolver, QueryResolvers>();
            services.AddTransient<IDynamicMutationResolver, MutationResolver>();
            services.AddTransient<ContentMangementSeedService>();
            services.AddTransient<IDynamicFieldResolverFactory, FieldResolverFactory>();
        }

        public static void AddContentManagementConfiguration(IApplicationBuilder app, IWebHostEnvironment env)
        {

        }
    }
}
