using ECDLink.DataAccessLayer.Entities.Clubs;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClubMemberModel
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string WelcomeMessage { get; set; }  

        public ClubMemberModel(ClubMember clubMember)
        {
            UserId = clubMember.Practitioner.User.Id;
            Name = $"{clubMember.Practitioner.User.FirstName} {clubMember.Practitioner.User.Surname}";
            PhoneNumber = clubMember.Practitioner.User.PhoneNumber;
            WelcomeMessage = clubMember.WelcomeMessage;
        }
    }
}