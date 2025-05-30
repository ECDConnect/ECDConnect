using ECDLink.DataAccessLayer.Entities.Visits;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Visits
{
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
        public string PractitionerId { get; set; }
      
        public string CoachId { get; set; }
        public string EventId { get; set; }
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
  }

