using ECDLink.DataAccessLayer.Entities.Users;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class TeamLeadModel
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string JobTitle { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public string WelcomeMessage { get; set; }

        public TeamLeadModel(TeamLead teamLead, string welcomeMessage)
        {
            Id = teamLead.Id;
            JobTitle = teamLead.JobTitle;
            WelcomeMessage = welcomeMessage;

            if (teamLead.User != null)
            {
                FirstName = teamLead.User.FirstName;
                Surname = teamLead.User.Surname;
                PhoneNumber = teamLead.User.PhoneNumber;
                WhatsAppNumber = teamLead.User.WhatsAppNumber;
            }
        }
    }
}
