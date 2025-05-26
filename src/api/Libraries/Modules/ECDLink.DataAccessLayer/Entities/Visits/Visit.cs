using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Calendar;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits
{
    [Table(nameof(Visit))]
    public class Visit : Visit<Guid>
    {
    }

    public class Visit<TKey> : EntityBase<TKey>, VisitTypeJoin<TKey>
         where TKey : IEquatable<TKey>
    {
        public DateTime PlannedVisitDate { get; set; }
        public DateTime? ActualVisitDate { get; set; }
        public bool Attended { get; set; }
        public bool IsCancelled { get; set; }
        public TKey VisitTypeId { get; set; }
        [ForeignKey(nameof(VisitTypeId))]
        public virtual VisitType VisitType { get; set; }
        public string Risk { get; set; }
        public string Comment { get; set; }
        public Guid? LinkedVisitId { get; set; }
        public Guid? PractitionerId { get; set; }
        public virtual Practitioner Practitioner { get; set; }
        public Guid? CoachId { get; set; }
        public virtual Coach Coach { get; set; }
        [NotMapped]
        public DateTime? OrderDate { get; set; }
        [NotMapped]
        public string OverallRatingColor { get; set; }
        [NotMapped]
        public bool DelicenseQuestionAnswered { get; set; }
        [NotMapped]
        public bool VisitInProgress { get; set; }
        public DateTime? DueDate { get; set; }
        public Guid? EventId { get; set; }
        [ForeignKey(nameof(EventId))]
        public virtual CalendarEvent Event { get; set; }
        [NotMapped]
        public bool HasAnswerData { get; set; }
        public string Rating { get; set; }
        public virtual PQARating PQARating { get; set; }
        public virtual ICollection<VisitData> VisitData { get; set; }
    }

    public interface VisitJoin<TKey>
    {
        [ForeignKey(nameof(VisitId))]
        public Visit Visit { get; set; }
        public TKey VisitId { get; set; }
    }
}
