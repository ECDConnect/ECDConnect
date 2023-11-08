using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Users;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClubCoachModel
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public string ProfileImageUrl { get; set; }
        public string AboutInfo { get; set; }  

        public ClubCoachModel(Coach coach)
        {
            UserId = coach.User.Id;
            FirstName = coach.User.FirstName;
            Surname = coach.User.Surname;
            PhoneNumber = coach.User.PhoneNumber;
            WhatsAppNumber = coach.User.WhatsAppNumber;
            ProfileImageUrl = coach.User.ProfileImageUrl;
            AboutInfo = coach.AboutInfo;
        }
    }
}