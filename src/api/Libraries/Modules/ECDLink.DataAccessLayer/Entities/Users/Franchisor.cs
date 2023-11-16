using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Franchisor))]
    [EntityPermission(PermissionGroups.USER)]
    public class Franchisor : Franchisor<Guid>
    {
    }

    public class Franchisor<TKey> : EntityBase<TKey>,
        IUserElevatedScoped, SiteAddressJoin<Guid?>,
        ApplicationUserJoin, IUserType, ITrackableType
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid UserId { get; set; }
        public string AreaOfOperation { get; set; }
        public string SecondaryAreaOfOperation { get; set; }
        public DateTime StartDate { get; set; }

        //[GraphQLIgnore]
        public string Hierarchy { get; set; }

        [ForeignKey(nameof(SiteAddressId))]
        public virtual SiteAddress SiteAddress { get; set; }
        public Guid? SiteAddressId { get; set; }

        public string SigningSignature { get; set; }

        public string ContactPerson { get; set; }
        public string ContactPersonNumber { get; set; }
    }

    public interface FranchisorJoin<TKey>
    {
        [ForeignKey(nameof(FranchisorId))]
        public Franchisor Franchisor { get; set; }
        public TKey FranchisorId { get; set; }
    }
}
