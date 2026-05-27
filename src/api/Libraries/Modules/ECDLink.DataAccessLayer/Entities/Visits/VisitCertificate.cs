using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits
{
    [Table(nameof(VisitCertificate))]
    public class VisitCertificate : VisitCertificate<Guid>
    {
    }

    public class VisitCertificate<TKey> : EntityBase<TKey>, VisitCertificateJoin<TKey>
         where TKey : IEquatable<TKey>
    {
        public TKey VisitId { get; set; }
        [ForeignKey(nameof(VisitId))]
        public virtual Visit Visit { get; set; }
        public string CertificateName { get; set; }
       
    }

    public interface VisitCertificateJoin<TKey>
    {
        [ForeignKey(nameof(VisitId))]
        public Visit Visit { get; set; }
        public TKey VisitId { get; set; }
    }
}
