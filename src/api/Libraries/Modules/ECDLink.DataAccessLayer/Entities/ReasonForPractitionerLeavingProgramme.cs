using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(ReasonForPractitionerLeavingProgramme))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ReasonForPractitionerLeavingProgramme : ReasonForPractitionerLeavingProgramme<Guid>
    {

    }

    public class ReasonForPractitionerLeavingProgramme<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
    }

    public interface ReasonForPractitionerLeavingProgrammeJoin<TKey>
    {
        [ForeignKey(nameof(ReasonForPractitionerLeavingProgrammeId))]
        public ReasonForPractitionerLeavingProgramme ReasonForLeavingProgramme { get; set; }
        public TKey ReasonForPractitionerLeavingProgrammeId { get; set; }
    }
}
