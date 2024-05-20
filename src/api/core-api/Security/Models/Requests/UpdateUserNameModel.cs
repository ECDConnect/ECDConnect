using System;

namespace EcdLink.Api.CoreApi.Security.Models.Requests
{
    public class UpdateUserNameModel
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
    }
}
