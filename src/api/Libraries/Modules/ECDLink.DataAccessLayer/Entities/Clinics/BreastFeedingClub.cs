using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clinics
{
    [Table(nameof(BreastFeedingClub))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class BreastFeedingClub : BreastFeedingClub<Guid>
    {
    }

    public class BreastFeedingClub<TKey> : EntityBase<TKey>,
        HealthCareWorkerJoin<Guid>
         where TKey : IEquatable<TKey>
    {
        public DateTime MeetingDate { get; set; }
        public bool ClientsAttendedConfirmed { get; set; }
        public Guid ClinicId { get; set; }

        public Guid HealthCareWorkerId { get; set; }

        [ForeignKey(nameof(HealthCareWorkerId))]
        public virtual HealthCareWorker HealthCareWorker { get; set; }

        public virtual ICollection<BreastFeedingClubClient> Clients { get; set; }
    }

    public interface BreastFeedingClubJoin<TKey>
    {
        [ForeignKey(nameof(BreastFeedingClubId))]
        public BreastFeedingClub BreastFeedingClub { get; set; }
        public TKey BreastFeedingClubId { get; set; }
    }
}
