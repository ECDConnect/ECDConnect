using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Coach))]
    [EntityPermission(PermissionGroups.USER)]
    public class Coach : Coach<Guid>
    {
    }

    public class Coach<TKey> : EntityBase<TKey>,
        ApplicationUserJoin, IUserType, IUserElevatedScoped, ITrackableType,
        SiteAddressJoin<Guid?>
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }
        public string AreaOfOperation { get; set; }
        public string SecondaryAreaOfOperation { get; set; }
        public DateTime StartDate { get; set; }

        [ForeignKey(nameof(SiteAddressId))]
        public virtual SiteAddress SiteAddress { get; set; }
        public Guid? SiteAddressId { get; set; }
        public string SigningSignature { get; set; }

        [GraphQLIgnore]
        public string Hierarchy { get; set; }
        [NotMapped]
        public virtual ICollection<Visit> PractitionerVisits { get; set; }
        public string AboutInfo { get; set; }
        public bool? IsRegistered { get; set; } = false;
        public bool? ShareInfo { get; set; } = false;
        public bool? ClickedCommunityTab { get; set; } = false;
    }

    public interface CoachJoin<TKey>
    {
        [ForeignKey(nameof(CoachId))]
        public Coach Coach { get; set; }
        public TKey CoachId { get; set; }
    }
}
