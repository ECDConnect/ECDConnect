using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class TeamLeadModel
    {
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public virtual Clinic Clinic { get; set; }
        public Guid? ClinicId { get; set; }
        public string JobTitle { get; set; }
    }
}

