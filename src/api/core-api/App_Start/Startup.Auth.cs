using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Stores;
using ECDLink.Security.Managers;
using ECDLink.Security.Providers;
using ECDLink.Security.Providers.Tokens;
using ECDLink.Tenancy.EntityFramework.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EcdLink.Api.CoreApi
{
    public partial class Startup
    {
        private void ConfigureAuthContext(IServiceCollection services, IConfiguration config)
        {           
            services.AddDbContextFactory<AuthenticationDbContext>((serviceProvider, options) =>
            {
                options.UseNpgsqlTenancy(config);
                options.UseLazyLoadingProxies();
            });

            services.AddDbContextFactory<ContentManagementDbContext>((serviceProvider, options) =>
            {
                options.UseNpgsqlTenancy(config);
            });

            services.AddScoped<AuthenticationDbContext>(p =>
                p.GetRequiredService<IDbContextFactory<AuthenticationDbContext>>()
                .CreateDbContext());
        }

        private void SetIdentityUser(IServiceCollection services)
        {
            services.AddTransient<IRoleStore<ApplicationIdentityRole>, ApplicationRoleStore>();
            services.AddTransient<IUserRoleStore<ApplicationUser>, ApplicationUserRoleStore>();

            services.AddIdentity<ApplicationUser, ApplicationIdentityRole>(config =>
            {
                config.Tokens.ProviderMap.Add(
                    ProviderKeys.Tokens.EMAIL,
                    new TokenProviderDescriptor(typeof(CustomEmailConfirmationTokenProvider<ApplicationUser>))
                );

                config.Tokens.EmailConfirmationTokenProvider = ProviderKeys.Tokens.EMAIL;

                config.Tokens.ProviderMap.Add(
                    ProviderKeys.Tokens.OPEN_ACCESS,
                    new TokenProviderDescriptor(typeof(CustomOpenAccessTokenProvider<ApplicationUser>))
                );
            }).AddEntityFrameworkStores<AuthenticationDbContext>()
              .AddUserManager<ApplicationUserManager>()
              .AddRoleManager<ApplicationRoleManager>()
              .AddUserStore<ApplicationUserRoleStore>()
              .AddRoleStore<ApplicationRoleStore>()
              .AddDefaultTokenProviders();

            services.AddTransient<CustomEmailConfirmationTokenProvider<ApplicationUser>>();
            services.AddTransient<CustomOpenAccessTokenProvider<ApplicationUser>>();
        }
    }
}
