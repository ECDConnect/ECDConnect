using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedFranchisor
    {
        public string Guid { get; set; }
        public string Name { get; set; }
        public string ContactPerson { get; set; }
        public string EmailAddress { get; set; }
        public string ContactNumber { get; set; }
        public string Gender { get; set; }
        public DateTime CreatedOn { get; set; }

        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string PostalCode { get; set; }

    }
}
