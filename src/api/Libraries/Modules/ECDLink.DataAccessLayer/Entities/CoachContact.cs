using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
  
    [Table(nameof(CoachContact))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class CoachContact : CoachContact<Guid>
    {
    }
    public class CoachContact<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
    
        public TKey Id { get; set; }

        public Guid? UserId { get; set; }
        public Guid? PractitionerId { get; set; }

        public Guid CoachId { get; set; }

        public ActionItemType ActionItemType { get; set; }

        public DateTime Period { get; set; }  
    
        public DateTime ContactedDate { get; set; } = DateTime.UtcNow;

    
        [ForeignKey(nameof(PractitionerId))]
        public virtual Practitioner Practitioner { get; set; }

        [ForeignKey(nameof(CoachId))]
        public virtual Coach Coach { get; set; }
    }
}
