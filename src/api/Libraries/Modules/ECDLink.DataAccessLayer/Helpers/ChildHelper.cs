using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Helpers;

namespace ECDLink.DataAccessLayer.Services
{
    public static class ChildHelper
    {
        public static void AnonymiseChild(Child child)
        {
            if (child?.User != null)
            {
                ApplicationUserHelper.AnonymizeUser(child.User);
            }

            if (child.CaregiverId != null)
            {
                //Anonymise linked Caregiver
                AnonymiseCaregiver(child.Caregiver);
            }
        }

        public static void AnonymiseCaregiver(Caregiver caregiver)
        {
            if (caregiver == null)
            {
                return;
            }

            caregiver.FirstName = "Retracted";
            caregiver.Surname = "Retracted";
            caregiver.FullName = "Retracted";
            caregiver.IdNumber = "";
            caregiver.PhoneNumber = "";

            caregiver.EmergencyContactFirstName = "Retracted";
            caregiver.EmergencyContactSurname = "Retracted";
            caregiver.EmergencyContactPhoneNumber = "";

            caregiver.AdditionalFirstName = "Retracted";
            caregiver.AdditionalSurname = "Retracted";
            caregiver.AdditionalPhoneNumber = "";

            AnonymiseSiteAddress(caregiver.SiteAddress);
        }

        private static void AnonymiseSiteAddress(SiteAddress siteAddress)
        {
            if (siteAddress == null)
            {
                return;
            }

            siteAddress.AddressLine1 = "";
            siteAddress.AddressLine2 = "";
            siteAddress.AddressLine3 = "";
        }
    }
}
