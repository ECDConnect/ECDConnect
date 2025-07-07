using ECDLink.DataAccessLayer.Entities;
using System;

namespace ECDLink.DataAccessLayer.Helpers
{
    public static class ApplicationUserHelper
    {
        public static void AnonymizeUser(ApplicationUser user)
        {
            var username = $"Rectracted_{Guid.NewGuid()}";

            user.IsActive = false;
            user.Email = "";
            user.FirstName = "Retracted";
            user.Surname = "Retracted";
            user.FullName = "Retracted";
            user.UserName = username;
            user.NormalizedUserName = username;
            user.PhoneNumber = "";
            user.NormalizedEmail = "";
            user.NormalizedUserName = "";
            user.IdNumber = "";
            user.InsertedDate = DateTime.MinValue;
        }
    }
}
