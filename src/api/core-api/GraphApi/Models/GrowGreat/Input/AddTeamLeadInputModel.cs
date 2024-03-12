using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input
{
    public class AddTeamLeadInputModel
    {
        public Guid UserId { get; set; }
    }

    public class AddBulkTeamLeadInputModel
    {
        public string Username { get; set; }
        public string ClinicId { get; set; }
    }
}
