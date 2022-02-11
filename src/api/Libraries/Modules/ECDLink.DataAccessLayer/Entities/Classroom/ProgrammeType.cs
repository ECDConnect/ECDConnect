using ECDLink.Abstractrions.Enums;
using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using ECDLink.Security;

namespace ECDLink.DataAccessLayer.Entities.Classroom
{
    [Table(nameof(ProgrammeType))]
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class ProgrammeType : ProgrammeType<Guid>
    {
    }

    public class ProgrammeType<TKey> : EntityBase<TKey>, IEnumType<ProgrammeTypeEnum>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }

        public ProgrammeTypeEnum EnumId { get; set; }
    }

    public interface ProgrammeTypeJoin<TKey> 
    {
        [ForeignKey(nameof(ProgrammeTypeId))]
        public ProgrammeType ProgrammeType { get; set; }
        public TKey ProgrammeTypeId { get; set; }
    }
}
