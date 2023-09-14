using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.SmartStart
{
    public class CoachPractitioner
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string ProgrammeType { get; set; }
        public virtual PractitionerTimeline timeline { get; set; }
    }

}
