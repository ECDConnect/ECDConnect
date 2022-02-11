using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using HotChocolate;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Coach
{
    [Table(nameof(Coach))]
    [EntityPermission(PermissionGroups.USER)]
    public class Coach : Coach<Guid>
    {
    }

    public class Coach<TKey> : EntityBase<TKey>, ApplicationUserJoin, IUserType
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }

        public string AreaOfOperation { get; set; }

        public string SecondaryAreaOfOperation { get; set; }

        public DateTime StartDate { get; set; }

        [GraphQLIgnore]
        public string Hierarchy { get; set; }
    }

    public interface CoachJoin<TKey>
    {
        [ForeignKey(nameof(CoachId))]
        public Coach Coach { get; set; }
        public TKey CoachId { get; set; }
    }
}
