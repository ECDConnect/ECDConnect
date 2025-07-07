using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Navigation
{
    [Table(nameof(Navigation))]
    public class Navigation : Navigation<Guid>
    {
    }

    public class Navigation<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public int Sequence { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public string Route { get; set; }
        public string Description { get; set; }
    }
}
