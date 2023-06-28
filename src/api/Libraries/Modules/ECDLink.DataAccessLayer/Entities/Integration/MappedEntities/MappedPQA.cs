using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedPQA : MappedBaseEntity
    {
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public bool? WasSuccessful { get; set; }
        public bool? IsFranchiseeHittingChildren { get; set; }
        public bool? IsSmartSpaceStillFine { get; set; }
        public bool? IsVenueSafe { get; set; }
        public bool? IsThereTooManyChildren { get; set; }
        public DateTime? DateOfVisit { get; set; }
        public MappedFranchisee Franchisee { get; set; }
        public MappedCoach Coach { get; set; }
    }
}
