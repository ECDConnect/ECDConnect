namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedFranchisee : MappedBaseEntity
    {
        public string ContactNumber { get; set; }
        public string Gender { get; set; }
        public string SiteArea { get; set; }
        public string SiteName { get; set; }
        public string PersonalNumber { get; set; }
        public string BirthDate { get; set; }
        public string CountryOfCitizenship { get; set; }
        public bool IsSouthAfricanCitizen { get; set; }
        public string Age { get; set; }
        public string ProgrammeType { get; set; }
        public string EthnicGroup { get; set; }
        public string Province { get; set; }

    }
}
