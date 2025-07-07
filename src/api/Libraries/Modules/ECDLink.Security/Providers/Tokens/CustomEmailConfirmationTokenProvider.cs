using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;

namespace ECDLink.Security.Providers.Tokens
{
    public class CustomEmailConfirmationTokenProvider<TUser>
    : DataProtectorTokenProvider<TUser> where TUser : class
    {
        public CustomEmailConfirmationTokenProvider(IDataProtectionProvider dataProtectionProvider,
            IOptions<EmailConfirmationTokenProviderOptions> options,
            ILogger<DataProtectorTokenProvider<TUser>> logger,
            ISystemSetting<SecurityTokenOptions> tokenSettings)
          : base(dataProtectionProvider, options, logger)
        {
            base.Options.TokenLifespan = TimeSpan.FromHours(int.Parse(tokenSettings?.Value?.InvitationLinkExpiry ?? "24"));
        }
    }
    public class EmailConfirmationTokenProviderOptions : DataProtectionTokenProviderOptions
    {
        public EmailConfirmationTokenProviderOptions()
        {
            Name = ProviderKeys.Tokens.EMAIL;
            TokenLifespan = TimeSpan.FromHours(24);
        }
    }
}
