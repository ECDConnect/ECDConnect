using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Training;
using ECDLink.DataAccessLayer.Entities.Visits;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(UserCertificate))]
    public class UserCertificate : UserCertificate<Guid>
    {
    }

    public class UserCertificate<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(VisitId))]
        public virtual Visit Visit { get; set; }
        public Guid? VisitId { get; set; }

        [ForeignKey(nameof(UserTrainingCourseId))]
        public virtual UserTrainingCourse UserTrainingCourse { get; set; }
        public Guid? UserTrainingCourseId { get; set; }

       [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

        public string CertificateName { get; set; }
        public string CertificateRegNr { get; set; }
    }

    public interface UserCertificateJoin<TKey>
    {
        [ForeignKey(nameof(UserCertificateId))]
        public UserCertificate UserCertificate { get; set; }
        public TKey UserCertificateId { get; set; }
    }
}
