using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Navigation
{
    [Table(nameof(NavigationPermission))]
    public class NavigationPermission : NavigationPermission<Guid>
    {

    }

    public class NavigationPermission<TKey> : PermissionJoin<TKey>
        where TKey : IEquatable<TKey>
    {
        // Part of PK
        [ForeignKey(nameof(NavigationId))]
        public virtual Navigation Navigation { get; set; }

        public TKey NavigationId { get; set; }

        // Part of PK
        [ForeignKey(nameof(PermissionId))]
        public virtual Permission Permission { get; set; }

        public TKey PermissionId { get; set; }
    }

    public interface NavigationPermissionJoin<TKey>
    {
        [ForeignKey(nameof(NavigationPermissionId))]
        public NavigationPermission NavigationPermission { get; set; }
        public TKey NavigationPermissionId { get; set; }
    }
}
