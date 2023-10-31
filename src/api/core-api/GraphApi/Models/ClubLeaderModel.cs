using ECDLink.DataAccessLayer.Entities.Clubs;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClubLeaderModel
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? DateAccepted { get; set; }  

        public ClubLeaderModel(ClubLeader clubLeader)
        {
            UserId = clubLeader.Practitioner.User.Id;
            Name = $"{clubLeader.Practitioner.User.FirstName} {clubLeader.Practitioner.User.Surname}";
            PhoneNumber = clubLeader.Practitioner.User.PhoneNumber;
            DateAccepted = clubLeader.DateAccepted;
        }
    }
}