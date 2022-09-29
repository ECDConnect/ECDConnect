using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(PractitionerOwner))]
    [EntityPermission(PermissionGroups.USER)]
    public class PractitionerOwner : PractitionerOwner<Guid>
    {

    }

    public class PractitionerOwner<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        [GraphQLIgnore]
        public string Hierarchy { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public Guid? PrincipalOwnerId { get; set; }
        public Guid? PractitionerId { get; set; }
        public DateTime? DateLinked { get; set; }
        public DateTime? DateAccepted { get; set; }
        public DateTime? DateToBeRemoved { get; set; }

    }

    public interface PractitionerOwnerJoin<TKey>
    {
        [ForeignKey(nameof(PractitionerOwnerId))]
        public PractitionerOwner PractitionerOwner { get; set; }
        public TKey PractitionerOwnerId { get; set; }
    }
}
