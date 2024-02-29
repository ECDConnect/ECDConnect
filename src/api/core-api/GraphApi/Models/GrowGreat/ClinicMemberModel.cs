using ECDLink.DataAccessLayer.Entities.Users;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class ClinicMemberModel
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public string ProfileImageUrl { get; set; }
        public string WelcomeMessage { get; set; }
        public bool ShareContactInfo { get; set; }

        public ClinicMemberModel(HealthCareWorker healthCareWorker)
        {
            if (healthCareWorker.User != null)
            {
                FirstName = healthCareWorker.User.FirstName;
                Surname = healthCareWorker.User.Surname;
                PhoneNumber = healthCareWorker.User.PhoneNumber;
                WhatsAppNumber = healthCareWorker.User.WhatsAppNumber;
                ProfileImageUrl = healthCareWorker.User.ProfileImageUrl;
            }

            WelcomeMessage = healthCareWorker.WelcomeMessage;
            ShareContactInfo = healthCareWorker.ShareContactInfo;
        }
    }
}
