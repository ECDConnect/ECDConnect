using ECDLink.DataAccessLayer.Entities.Visits;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class VisitDataModel
    {
        public string VisitId { get; set; }
        public Visit Visit { get; set; }
        public string VisitName { get; set; }
        public string Question { get; set; }
        public string QuestionAnswer { get; set; }
    }


    public class VisitDataStatusModel
    {
        public string VisitDataId { get; set; }
        public VisitData VisitData { get; set; }
        public string Comment { get; set; }
        public string Color { get; set; }
        public string Type { get; set; }
    }

    public class CMSQuestion
    {
        public string Question { get; set; }
        public string Answer { get; set; } 
    }

    public class CMSVisitDataInputModel
    {
        public string VisitId { get; set; }  // this is coming from the visit table
        public string VisitName { get; set; } // this is coming from the FE (e.x. Care for mom, Care for baby etc)
        public string VisitSection { get; set; } // this coming from the FE (e.x. Danger signs)
        public string MotherId { get; set; }
        public string InfantId { get; set; }
        public virtual ICollection<CMSQuestion> questions { get; set; }
    }

    public class Progress_VisitDataStatus
    {
        public float Score { get; set; }
        public virtual ICollection<VisitDataStatus> visitDataStatus { get; set; }
    }

    public class VisitDataSummary
    {
        public string VisitSection { get; set; }
        public virtual ICollection<VisitDataStatus> visitDataStatus { get; set; }
    }

}

