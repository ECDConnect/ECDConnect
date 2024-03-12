using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(PractitionerRemovalHistory))]
    [EntityPermission(PermissionGroups.USER)]
    public class PractitionerRemovalHistory : PractitionerRemovalHistory<Guid>
    {

    }

    public class PractitionerRemovalHistory<TKey> : EntityBase<TKey>,
        ApplicationUserJoin, ITrackableType
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }
        public Guid ClassroomId { get; set; }
        public DateTime DateOfRemoval { get; set; }
        public Guid RemovedByUserId { get; set; }
        public Guid ReasonForPractitionerLeavingProgrammeId { get; set; }
        public string ReasonDetails { get; set; }
        public virtual ICollection<Absentees> ClassReassignments { get; set; }

    }

    public interface PractitionerRemovalHistoryJoin<TKey>
    {
        [ForeignKey(nameof(PractitionerRemovalHistoryId))]
        public PractitionerRemovalHistory PractitionerRemovalHistory { get; set; }
        public TKey PractitionerRemovalHistoryId { get; set; }
    }
}
