using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class PrincipalhMutationModel
    {
        public string UserId { get; set; }

        public string AreaOfOperation { get; set; }

        public string SecondaryAreaOfOperation { get; set; }

        public DateTime StartDate { get; set; }

        public Guid? SiteAddressId { get; set; }
        public string Signature { get; set; }
    }

    public class AddPrincipalToPractitionerModel
    {
        public Guid? userId { get; set; }

        public Guid? practitionerId { get; set; }
    }

    public class RemovePrincipalForPractitionerModel
    {
        public Guid? userId { get; set; }

        public Guid? practitionerId { get; set; }
    }

    public class PractitionersListByPrincipal
    {
        public List<Practitioner> Practitioners { get; set;}
    }
    public class ChildListByPrincipal
    {
        public List<Child> Children { get; set; }
    }

 
}
