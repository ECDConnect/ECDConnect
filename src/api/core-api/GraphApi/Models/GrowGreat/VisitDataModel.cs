using ECDLink.DataAccessLayer.Entities.Visits;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat {
    public class VisitDataModel
    {
        public string VisitId { get; set; }
        public Visit Visit { get; set; }
        public string VisitName { get; set; }
        public string Question { get; set; }
        public string QuestionAnswer { get; set; }
    }

    public class CMSVisitDataInputModel
    {
        public string VisitId { get; set; }  // this is coming from the visit table
        public string MotherId { get; set; }
        public string InfantId { get; set; }
        public string PractitionerId { get; set; }
        public string TraineeId { get; set; }
        public virtual CMSVisitData VisitData { get; set; }
    }

    public class CMSVisitData {
        public string VisitName { get; set; } // this is coming from the FE (e.x. Care for mom, Care for baby, etc)
        public virtual ICollection<CMSVisitSection> Sections { get; set; } 
    }

    public class CMSVisitSection {

        public string VisitSection { get; set; } // this coming from the FE (e.x. Danger signs, Clinic check-ups, etc)
        public virtual ICollection<CMSQuestion> Questions { get; set; }
    }

    public class CMSQuestion {
        public string Question { get; set; }
        public string Answer { get; set; }
    }

    public class PQARating
    {
        public string VisitName { get; set; }
        public int OverallScore { get; set; }
        public string OverallRating { get; set; }
        public string OverallRatingStars { get; set; }
        public string OverallRatingColor { get; set; }
        public DateTime? PlannedDate { get; set; }
        public virtual ICollection<PQARatingChild> Children { get; set; }
    }

    public class PQARatingChild
    {
        public string VisitSection { get; set; }
        public int SectionScore { get; set; }
        public string SectionRating { get; set; }
        public string SectionRatingColor { get; set; }
    }


  }

