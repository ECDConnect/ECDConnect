using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class CoachMutationModel
    {
        public string UserId { get; set; }

        public string AreaOfOperation { get; set; }

        public string SecondaryAreaOfOperation { get; set; }

        public DateTime StartDate { get; set; }

        public Guid? SiteAddressId { get; set; }
        public string Signature { get; set; }
    }

    public class AddCoachToPractitionerModel
    {
        public Guid? userId { get; set; }

        public Guid? practitionerId { get; set; }
    }

    public class RemoveCoachForPractitionerModel
    {
        public Guid? userId { get; set; }

        public Guid? practitionerId { get; set; }
    }

    public class PractitionersListByCoach
    {
        public List<Practitioner> Practitioners { get; set;}
    }
    public class ChildListByCoach
    {
        public List<Child> Children { get; set; }
    }

 
}
