using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Interceptors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Interceptors
{
    public class UserInterceptHandler : IUserInterceptHandler
    {
        public void OnUserIntercept(HttpContext context, ApplicationIdentityUser user)
        {
            var userManager = context.RequestServices.GetService<UserManager<ApplicationUser>>();

            var applicationUser = user as ApplicationUser;

            if (userManager == default)
            {
                throw new NotImplementedException();
            }

            if (applicationUser == default)
            {
                throw new UnauthorizedAccessException("User no defined");
            }

            if (applicationUser.LastSeen <= DateTime.UtcNow.AddMinutes(-10))
            {
                applicationUser.LastSeen = DateTime.UtcNow;
                var updateResult = userManager.UpdateAsync(applicationUser).Result;
            }
        }
    }
}
