namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedCaregiver : MappedBaseEntity
    {
        public string ContactNumber { get; set; }
        public string RelationshipType { get; set; }
        public string HighestEducationLevel { get; set; }
        public string Language { get; set; }
        public string Province { get; set; }
        public string EmergencyContactPhoneNumber { get; set; }
        public string EmergencyContactFirstName { get; set; }
        public string EmergencyContactSurname { get; set; }
        public string HomeAddressLine1 { get; set; }
        public string HomeAddressLine2 { get; set; }
        public string HomeAddressLine3 { get; set; }
        public string HomeAddressPostalCode { get; set; }
        public MappedFranchisee Franchisee { get; set; }

    }
}
