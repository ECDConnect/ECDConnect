using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedCoach : MappedBaseEntity
    {
        public string ContactNumber { get; set; }
        public string Gender { get; set; }
        public string AreaOfOperation { get; set; }
        public bool? WorksAtOffice { get; set; }
        public string SecondaryAreaOfOperation { get; set; }
        public DateTime? StartDate { get; set; }
        public MappedFranchisor Franchisor { get; set; }
        public string EmergencyContactPhoneNumber { get; set; }
        public string EmergencyContactFirstName { get; set; }
        public string EmergencyContactSurname { get; set; }

        public string WorkAddressBuildingAndUnitNumber { get; set; }
        public string WorkAddressStreetAddress { get; set; }
        public string WorkAddressCity { get; set; }
        public string WorkAddressSuburbOrArea { get; set; }
        public string WorkAddressProvince { get; set; }


    }
}
