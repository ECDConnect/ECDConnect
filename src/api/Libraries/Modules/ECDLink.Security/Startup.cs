using ECDLink.Security.JwtSecurity.Configuration;
using ECDLink.Security.JwtSecurity.Factories;
using ECDLink.Security.JwtSecurity.Managers;
using ECDLink.Security.Secrets;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;

namespace ECDLink.Security
{
    public static class SecurityStartup
    {
        public static void ConfigureSecurityServices(IServiceCollection services, IConfiguration configuration)
        {
            ConfigureSecurityPolicies(services);

            ConfigureJwt(services, configuration);

            ConfigureSecurityTokenTimers(services);

            SetSecurityIoC(services);
        }

        public static void AddSecurityConfiguration(IApplicationBuilder app)
        {
        }

        private static void ConfigureSecurityPolicies(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(SecurityConstants.RolePolicy.RequiresAdmin, policy => policy.RequireClaim(SecurityConstants.Strings.JwtClaimIdentifiers.Rol, SecurityConstants.Strings.JwtClaims.AdminAccess));
            });
        }

        private static void ConfigureSecurityTokenTimers(IServiceCollection services)
        {
            // Configure the token lifespan for all generated tokens
            // If specific timeouts are needed, specific provider classes can be implemented
            services.Configure<DataProtectionTokenProviderOptions>(options =>
                options.TokenLifespan = TimeSpan.FromDays(1)
                );
        }

        private static void SetSecurityIoC(IServiceCollection services)
        {
            services.AddTransient<IJwtFactory, JwtFactory>();
            services.AddTransient<JwtTokenManager>();

            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false;
            });
        }

        private static void ConfigureJwt(IServiceCollection services, IConfiguration configuration)
        {
            // Get options from app settings
            var jwtAppSettingOptions = configuration.GetSection(nameof(JwtIssuerOptions));

            // Configure JwtIssuerOptions
            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
                options.SigningCredentials = SecretManager.GetSigningCredentials();
            });

            services.Configure<JwtIssuerOverrides>(options =>
            {
                options.OneTimeTokenValidFor = TimeSpan.FromHours(1);
            });

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

                ValidateAudience = true,
                ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = SecretManager.GetSymmetricSecurityKey(),

                RequireExpirationTime = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            services.AddTransient(x => tokenValidationParameters);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(configureOptions =>
            {
                configureOptions.ClaimsIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                configureOptions.TokenValidationParameters = tokenValidationParameters;
                configureOptions.SaveToken = true;
            });
        }
    }
}
