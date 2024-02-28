using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    // TODO - rename to input model and move to GG namespace
    public class ClinicModel
    {
        public string Name { get; set; }

        public string PhoneNumber { get; set; }

        public virtual SiteAddress SiteAddress { get; set; }
        public Guid? SiteAddressId { get; set; }

        public string EmergencyContactPerson { get; set; }

        public string EmergencyContactNumber { get; set; }
    }
}