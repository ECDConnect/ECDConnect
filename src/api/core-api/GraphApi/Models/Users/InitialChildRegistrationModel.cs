using ECDLink.Security.Managers;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class InitialChildRegistrationModel
    {
        public Guid ChildId { get; set; }
        public Guid ChildUserId { get; set; }
        public Guid AddedByUserId { get; set; }
        public Guid ClassroomGroupId { get; set; }
        public string CaregiverRegistrationUrl { get; set; }
    }
}
