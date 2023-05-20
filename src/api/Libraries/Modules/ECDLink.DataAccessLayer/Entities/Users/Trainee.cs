using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Trainee))]
    [EntityPermission(PermissionGroups.USER)]
    public class Trainee : Trainee<Guid>
    {

    }

    public class Trainee<TKey> : EntityBase<TKey>,
        IDocumentQueryable, ITrackableType
         where TKey : IEquatable<TKey>
    {
        public DateTime? StartDate { get; set; }

        public virtual ICollection<Document> Documents { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public virtual Practitioner Practitioner { get; set; }

    }

    public interface TraineeIdJoin<TKey>
    {
        [ForeignKey(nameof(TraineeId))]
        public Trainee Trainee { get; set; }
        public TKey TraineeId { get; set; }
    }
}
