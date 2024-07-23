using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clinics
{
    [Table(nameof(ClinicMeeting))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ClinicMeeting : ClinicMeeting<Guid>
    {
    }

    public class ClinicMeeting<TKey> : EntityBase<TKey>, ClinicJoin<TKey>, TeamLeadJoin<TKey>
        where TKey : IEquatable<TKey>
    {
        public DateTime MeetingDate { get; set; }
        public Guid MeetingTypeId { get; set; }
        public virtual MeetingType MeetingType { get; set; }
        public TKey ClinicId { get; set; }
        [ForeignKey(nameof(ClinicId))]
        public virtual Clinic Clinic { get; set; }
        public TKey TeamLeadId { get; set; }
        [ForeignKey(nameof(TeamLeadId))]
        public virtual TeamLead TeamLead { get; set; }
        public virtual ICollection<ClinicMeetingParticipantOptedOut> ParticipantsOptedOut { get; set; }
        public virtual ICollection<ClinicMeetingParticipantInField> ParticipantsInField { get; set; }
        public string PositiveStory { get; set; }
        public string ReportingIssue { get; set; }
        public int TotalSupportVisits { get; set; }
    }

    public interface ClinicMeetingJoin<TKey>
    {
        [ForeignKey(nameof(ClinicMeetingId))]
        public ClinicMeeting ClinicMeeting { get; set; }
        public TKey ClinicMeetingId { get; set; }
    }
}
