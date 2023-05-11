using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping
{
    [Table(nameof(IntegrationColumnMapping))]
    public class IntegrationColumnMapping : IntegrationColumnMapping<Guid>
    {
    }

    public class IntegrationColumnMapping<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string LocalColumn { get; set; }
        public string RemoteColumn { get; set; }
        public string RemoteEntity { get; set; }
        public string LocalEntity { get; set; }
        public string IntegrationSystem { get; set; } = "Smartlink";
        public string UpdateDirection { get; set; }
        public string EntityGrouping { get; set; }
        public int ColumnValidationLimit { get; set; }
        public bool RemapToString { get; set; } = false;


    }
}
