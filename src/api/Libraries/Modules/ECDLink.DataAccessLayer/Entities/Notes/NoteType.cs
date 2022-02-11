using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Notes
{
    [Table(nameof(NoteType))]
    public class NoteType : NoteType<Guid>
    {
    }

    public class NoteType<TKey> : EntityBase<TKey>, IEnumType<NoteTypeEnum>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }

        public string NormalizedName { get; set; }

        public string Description { get; set; }

        public NoteTypeEnum EnumId { get; set; }
    }

    public interface NoteTypeJoin<TKey>
    {
        [ForeignKey(nameof(NoteTypeId))]
        public NoteType NoteType { get; set; }
        public TKey NoteTypeId { get; set; }
    }
}
