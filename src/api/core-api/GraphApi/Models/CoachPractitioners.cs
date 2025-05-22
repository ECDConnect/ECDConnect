using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class CoachPractitioner
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string ProgrammeType { get; set; }
        public virtual PractitionerTimeline timeline { get; set; }
    }

}
