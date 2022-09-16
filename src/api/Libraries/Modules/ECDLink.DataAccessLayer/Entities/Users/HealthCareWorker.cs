using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(HealthCareWorker))]
    [EntityPermission(PermissionGroups.USER)]
    public class HealthCareWorker : HealthCareWorker<Guid>
    {

    }

    public class HealthCareWorker<TKey> : EntityBase<TKey>,
        ApplicationUserJoin,
        SiteAddressJoin<Guid?>,
        LanguageJoin<Guid?>
         where TKey : IEquatable<TKey>
    {
        public bool ConsentForPhoto { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }

        [ForeignKey(nameof(SiteAddressId))]
        public virtual SiteAddress SiteAddress { get; set; }
        public Guid? SiteAddressId { get; set; }

        [ForeignKey(nameof(LanguageId))]
        public virtual Language Language { get; set; }
        public Guid? LanguageId { get; set; }

        [ForeignKey(nameof(TeamLeadId))]
        public virtual ApplicationUser TeamLead { get; set; }
        public string TeamLeadId { get; set; }

        public string EmergancyContactPerson { get; set; }

        public string EmergancyContactNumber { get; set; }
    }

    public interface HealthCareWorkerJoin<TKey>
    {
        [ForeignKey(nameof(HealthCareWorkerId))]
        public HealthCareWorker HealthCareWorker { get; set; }
        public TKey HealthCareWorkerId { get; set; }
    }
}
