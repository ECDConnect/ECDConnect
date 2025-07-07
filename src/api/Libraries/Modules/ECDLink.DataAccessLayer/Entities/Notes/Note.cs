using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Notes
{
    [Table(nameof(Note))]
    public class Note : Note<Guid>
    {
    }

    public class Note<TKey> : EntityBase<TKey>, ApplicationUserJoin, NoteTypeJoin<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }

        public string BodyText { get; set; }

        public TKey NoteTypeId { get; set; }

        [ForeignKey(nameof(NoteTypeId))]
        public virtual NoteType NoteType { get; set; }

        public Guid? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }

        public Guid? CreatedUserId { get; set; }
    }

    public interface NoteJoin<TKey>
    {
        [ForeignKey(nameof(NoteId))]
        public Note Note { get; set; }
        public TKey NoteId { get; set; }
    }
}
