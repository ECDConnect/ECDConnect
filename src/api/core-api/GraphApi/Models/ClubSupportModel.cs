using ECDLink.DataAccessLayer.Entities.Clubs;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClubSupportModel
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? DateAccepted { get; set; }

        public ClubSupportModel(ClubSupport clubSupport)
        {
            UserId = clubSupport.Practitioner.User.Id;
            Name = $"{clubSupport.Practitioner.User.FirstName} {clubSupport.Practitioner.User.Surname}";
            PhoneNumber = clubSupport.Practitioner.User.PhoneNumber;
            DateAccepted = clubSupport.DateAccepted;
        }
    }
}