using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(PointsClinicSummary))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class PointsClinicSummary : PointsClinicSummary<Guid>
    {
    }

    public class PointsClinicSummary<TKey> : EntityBase<TKey>,
        PointsCategoryJoin<Guid>
         where TKey : IEquatable<TKey>
    {
        public DateTime DateScored { get; set; }
        public int TimesScored { get; set; }
        public int PointsTotal { get; set; }

        public Guid PointsCategoryId { get; set; }

        [ForeignKey(nameof(PointsCategoryId))]
        public virtual PointsCategory PointsCategory { get; set; }
    }

    public interface PoitnsClinicSummaryJoin<TKey>
    {
        [ForeignKey(nameof(PointsClinicSummaryId))]
        public PointsClinicSummary PointsClinicSummary { get; set; }
        public TKey PointsClinicSummaryId { get; set; }
    }
}
