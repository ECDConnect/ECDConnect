using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clinics
{
    [Table(nameof(ClinicMeetingParticipantOptedOut))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ClinicMeetingParticipantOptedOut : ClinicMeetingParticipantOptedOut<Guid>
    {
    }

    public class ClinicMeetingParticipantOptedOut<TKey> : EntityBase<TKey>, ClinicMeetingJoin<TKey>, HealthCareWorkerJoin<TKey>
        where TKey : IEquatable<TKey>
    {
        public TKey ClinicMeetingId { get; set; }
        [ForeignKey(nameof(ClinicMeetingId))]
        public virtual ClinicMeeting ClinicMeeting { get; set; }
        public TKey HealthCareWorkerId { get; set; }
        [ForeignKey(nameof(HealthCareWorkerId))]
        public virtual HealthCareWorker HealthCareWorker { get; set; }
    }

    public interface ClinicMeetingParticipantOptedOutJoin<TKey>
    {
        [ForeignKey(nameof(ClinicMeetingParticipantOptedOutId))]
        public ClinicMeetingParticipantOptedOut ClinicMeetingParticipantOptedOut { get; set; }
        public TKey ClinicMeetingParticipantOptedOutId { get; set; }
    }
}
