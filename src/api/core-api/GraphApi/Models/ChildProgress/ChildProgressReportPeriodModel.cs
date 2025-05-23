using System;
using System.Collections.Generic;
using ECDLink.DataAccessLayer.Entities.Notifications;

namespace EcdLink.Api.CoreApi.GraphApi.Models.ChildProgress
{
    public class ChildProgressReportPeriodModel
    {
        public Guid Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<MessageLog> Notifications {get; set;}
    }
}
