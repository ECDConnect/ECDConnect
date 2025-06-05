using ECDLink.DataAccessLayer.Entities.Users;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class CaregiverBaseModel
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public Guid CaregiverId { get; set; }

        public CaregiverBaseModel(Caregiver caregiver)
        {
            FirstName = caregiver.FirstName;
            Surname = caregiver.Surname;
            CaregiverId = caregiver.Id;
        }
    }
}
