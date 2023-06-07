using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clubs
{
    [Table(nameof(ClubMeetingRegister))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ClubMeetingRegister : ClubMeetingRegister<Guid>
    {

    }

    public class ClubMeetingRegister<TKey> : EntityBase<TKey>, ClubMeetingJoin<TKey>
        where TKey : IEquatable<TKey>
    {
        public TKey ClubMeetingId { get; set; }
        [ForeignKey(nameof(ClubMeetingId))]
        public virtual ClubMeeting ClubMeeting { get; set; }
        public bool Attended { get; set; }
        public Guid? PractitionerId { get; set; }
        public virtual Practitioner Practitioner { get; set; }
    }

    public interface ClubMeetingRegisterJoin<TKey>
    {
        [ForeignKey(nameof(ClubMeetingRegisterId))]
        public ClubMeetingRegister ClubMeetingRegister { get; set; }
        public TKey ClubMeetingRegisterId { get; set; }
    }
}
