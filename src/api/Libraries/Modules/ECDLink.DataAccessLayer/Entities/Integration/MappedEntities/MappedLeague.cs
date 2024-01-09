using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedLeague
    {
        public string Guid { get; set; }
        public string Name { get; set; }
        public string LeagueType { get; set; }
        public string Status { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}