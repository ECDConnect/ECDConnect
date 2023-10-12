using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedCoach : MappedBaseEntity
    {
        public string ContactNumber { get; set; }
        public string Gender { get; set; }
        public string AreaOfOperation { get; set; }
        public string WorksAtOffice { get; set; }
        public string SecondaryAreaOfOperation { get; set; }
        public DateTime? StartDate { get; set; }
        public MappedFranchisor Franchisor { get; set; }

    }
}
