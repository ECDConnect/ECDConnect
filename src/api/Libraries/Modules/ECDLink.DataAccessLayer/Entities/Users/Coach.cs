using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using ECDLink.Security;
using HotChocolate;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Coach))]
    [EntityPermission(PermissionGroups.USER)]
    public class Coach : Coach<Guid>
    {

    }

    public class Coach<TKey> : EntityBase<TKey>, 
        ApplicationUserJoin,
        SiteAddressJoin<Guid?>
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }

        [ForeignKey(nameof(SiteAddressId))]
        public virtual SiteAddress SiteAddress { get; set; }
        public Guid? SiteAddressId { get; set; }
        public string SigningSignature { get; set; }
        
        [GraphQLIgnore]
        public string Hierarchy { get; set; }
        [ForeignKey(nameof(FranchisorId))]
        public virtual Franchisor Franchisor { get; set; }
        public Guid? FranchisorId { get; set; }
    }

    public interface CoachJoin<TKey>
    {
        [ForeignKey(nameof(CoachId))]
        public Coach Coach { get; set; }
        public TKey CoachId { get; set; }
    }
}
