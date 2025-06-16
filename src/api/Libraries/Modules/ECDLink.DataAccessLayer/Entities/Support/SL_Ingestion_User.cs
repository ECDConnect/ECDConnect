using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.DataIngestion
{
    [Table(nameof(SL_Ingestion_User))]
    [EntityPermission(PermissionGroups.USER)]
    public class SL_Ingestion_User
    {
        public Guid Id { get; set; }
    }

    [Table(nameof(SL_Ingestion_User_Update))]
    [EntityPermission(PermissionGroups.USER)]
    public class SL_Ingestion_User_Update
    {
        public Guid Id { get; set; }
    }
}
