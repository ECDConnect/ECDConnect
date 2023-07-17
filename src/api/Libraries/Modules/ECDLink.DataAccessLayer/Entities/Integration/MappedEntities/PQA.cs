using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.PQA
{
    [Table(nameof(PQA))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class PQA : PQA<Guid>
    {

    }

    public class PQA<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public bool? WasSuccessful { get; set; }
        public bool? IsFranchiseeHittingChildren { get; set; }
        public bool? IsSmartSpaceStillFine { get; set; }
        public bool? IsVenueSafe { get; set; }
        public bool? IsThereTooManyChildren { get; set; }
        public DateTime? DateOfVisit { get; set; }
        public string UserId { get; set; }
    }

    public interface PQAJoin<TKey>
    {
        [ForeignKey(nameof(PQAId))]
        public PQA PQA { get; set; }
        public TKey PQAId { get; set; }
    }
}
