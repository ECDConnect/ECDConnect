using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clinics
{
    [Table(nameof(BreastFeedingClubClient))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class BreastFeedingClubClient : BreastFeedingClubClient<Guid>
    {
    }

    public class BreastFeedingClubClient<TKey> : EntityBase<TKey>,
        CaregiverJoin<Guid>,
        BreastFeedingClubJoin<Guid>
         where TKey : IEquatable<TKey>
    {
        public Guid CaregiverId { get; set; }
        public Guid BreastFeedingClubId { get; set; }

        [ForeignKey(nameof(BreastFeedingClubId))]
        public virtual BreastFeedingClub BreastFeedingClub { get; set; }

        [ForeignKey(nameof(CaregiverId))]
        public virtual Caregiver Caregiver { get; set; }
    }

    public interface BreastFeedingClubClientJoin<TKey>
    {
        [ForeignKey(nameof(BreastFeedingClubClientId))]
        public BreastFeedingClubClient BreastFeedingClubClient { get; set; }
        public TKey BreastFeedingClubClientId { get; set; }
    }
}
