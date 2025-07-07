using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Models;

namespace ECDLink.Security.Helpers
{
    public static class ApplicationUserHelper
    {
        public static string GetObscureMessagePrefenceValue(ApplicationIdentityUser user)
        {
            switch (user.ContactPreference)
            {
                case MessageTypeConstants.SMS:
                    return AuthenticationHelper.ObscurePhoneNumber(user.PhoneNumber);
                case MessageTypeConstants.EMAIL:
                    return AuthenticationHelper.ObscureEmail(user.Email);
                default:
                    return string.Empty;
            }
        }
    }
}
