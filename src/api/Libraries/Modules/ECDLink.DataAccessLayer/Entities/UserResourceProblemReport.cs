using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(UserResourceProblemReport))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class UserResourceProblemReport : UserResourceProblemReport<Guid>
    {
    }

    public class UserResourceProblemReport<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public Guid UserId { get; set; }
        public int ContentId { get; set; }
        public string ProblemType { get; set; }
        public string AdditionalDetails { get; set; }
        public string DataFreeAtReport { get; set; }
        public string LinkAtReport { get; set; }
    }
}