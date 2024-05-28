using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Input
{
    public class AddUserHelpInputModel
    {
        public string Subject { get; set; }
        public string Description { get; set; }
        public string ContactPreference { get; set; }
        public string CellNumber { get; set; }
        public string Email { get; set; }
        public Guid? UserId { get; set; }
        public bool IsLoggedIn { get; set; }
    }
}
