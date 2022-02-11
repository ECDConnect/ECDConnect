using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;

namespace ECDLink.Security.Providers.Tokens
{
    public class CustomOpenAccessTokenProvider<TUser>
    : DataProtectorTokenProvider<TUser> where TUser : class
    {
        public CustomOpenAccessTokenProvider(IDataProtectionProvider dataProtectionProvider,
            IOptions<OpenAccessTokenProviderOptions> options,
            ILogger<DataProtectorTokenProvider<TUser>> logger,
            ISystemSetting<SecurityTokenOptions> tokenSettings)
          : base(dataProtectionProvider, options, logger)
        {
            base.Options.TokenLifespan = TimeSpan.FromHours(int.Parse(tokenSettings?.Value?.OpenAccessInvitationExpiry ?? "24"));
        }
    }
    public class OpenAccessTokenProviderOptions : DataProtectionTokenProviderOptions
    {
        public OpenAccessTokenProviderOptions()
        {
            Name = ProviderKeys.Tokens.OPEN_ACCESS;
            TokenLifespan = TimeSpan.FromHours(24);
        }
    }
}
