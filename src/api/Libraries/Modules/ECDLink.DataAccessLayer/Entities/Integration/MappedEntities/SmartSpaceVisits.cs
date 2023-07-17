using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.SmartSpaceVisit
{
    [Table(nameof(SmartSpaceVisit))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class SmartSpaceVisit : SmartSpaceVisit<Guid>
    {

    }

    public class SmartSpaceVisit<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public int NumberOfAssistants { get; set; }
        public int Capacity { get; set; }
        public int RequiredItemsScore { get; set; }
        public int UnrequiredItemsScore { get; set; }
        public int TotalScore { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public bool? OwnsProperty { get; set; }
        public bool? HasAcceptedSmartSpaceAgreement { get; set; }
        public bool? Q1 { get; set; }
        public bool? Q2 { get; set; }
        public bool? Q3 { get; set; }
        public bool? Q4 { get; set; }
        public bool? Q5 { get; set; }
        public bool? Q6 { get; set; }
        public bool? Q7 { get; set; }
        public bool? Q8 { get; set; }
        public bool? Q9 { get; set; }
        public bool? Q10 { get; set; }
        public bool? Q11 { get; set; }
        public bool? Q12 { get; set; }
        public bool? Q13 { get; set; }
        public bool? Q14 { get; set; }
        public bool? Q15 { get; set; }
        public bool? Q16 { get; set; }
        public bool? Q17 { get; set; }
        public bool? Q18 { get; set; }
        public bool? Q19 { get; set; }
        public bool? Q20 { get; set; }
        public bool? Q21 { get; set; }
        public DateTime? DateOfVisit { get; set; }
        public string UserId { get; set; }
    }

    public interface SmartSpaceVisitJoin<TKey>
    {
        [ForeignKey(nameof(SmartSpaceVisitId))]
        public SmartSpaceVisit SmartSpaceVisit { get; set; }
        public TKey SmartSpaceVisitId { get; set; }
    }
}
