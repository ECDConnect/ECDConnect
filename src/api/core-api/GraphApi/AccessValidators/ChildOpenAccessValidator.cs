using EcdLink.Api.CoreApi.GraphApi.Models.Users;
using EcdLink.Api.CoreApi.Security.Managers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Security.AccessModifiers.OpenAccess;
using ECDLink.Security.Enums;
using ECDLink.Security.Helpers;
using ECDLink.Security.Managers;
using Newtonsoft.Json;

namespace EcdLink.Api.CoreApi.GraphApi.AccessValidators
{
    public class ChildOpenAccessValidator : IOpenAccessValidator<ChildOpenAccessValidator>
    {
        private readonly ITokenManager<ApplicationUser, OpenAccessTokenManager> _manager;

        public ChildOpenAccessValidator(ITokenManager<ApplicationUser, OpenAccessTokenManager> manager)
        {
            _manager = manager;
        }

        public AuthState ValidateToken(string token)
        {
            var tokenModel = JsonConvert.DeserializeObject<ChildTokenWrapperModel>(TokenHelper.DecodeToken(token));

            var appUser = _manager.GetValidUserWithTokenAsync(tokenModel.ChildUserId, tokenModel.Token).Result;

            if (appUser == default(ApplicationUser))
            {
                // No user with the token. Cannot update
                return AuthState.NotAllowed;
            }

            return AuthState.Allowed;
        }
    }
}
