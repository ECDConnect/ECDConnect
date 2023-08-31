using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedSmartSpaceVisits
    {
        public string Guid { get; set; }
        public DateTime DateOfVisit { get; set; }
        public MappedCoach Coach { get; set; }

    }
}
