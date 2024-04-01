using ECDLink.Core.Models;
using ECDLink.EGraphQL.Interceptors;
using Microsoft.AspNetCore.Http;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Interceptors
{
    public class UserInterceptHandler : IUserInterceptHandler
    {
        public void OnUserIntercept(HttpContext context, ApplicationIdentityUser user)
        {
            /*
            var userManager = context.RequestServices.GetService<ApplicationUserManager>();

            var applicationUser = user as ApplicationUser;

            if (userManager == default)
            {
                throw new NotImplementedException();
            }
            */
            if (user == default)
            {
                throw new UnauthorizedAccessException("User no defined");
            }

            // ApplicationUser comes from the user claim/cookie, so will never have updated LastSeen time.
            // So async updating database just causing multiple context issues almost always
            // Commented out for now.
            //if (applicationUser.LastSeen <= DateTime.UtcNow.AddMinutes(-10))
            //{
            //    applicationUser.LastSeen = DateTime.UtcNow;
            //    userManager.
            //    //userManager.UpdateAsync(applicationUser);
            //}
        }
    }
}
