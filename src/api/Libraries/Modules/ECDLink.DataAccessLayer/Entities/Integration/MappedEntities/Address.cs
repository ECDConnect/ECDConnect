namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedAddress : BasicMappedBaseEntity
    {
        public string Municipality { get; set; }
        public string Name { get; set; }
        public string PostalCode { get; set; }
        public string Ward { get; set; }
        public string Area { get; set; }
        public string StreetAddress { get; set; }
        public string SharedFullAddress { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string SharedLatitude { get; set; }
        public string SharedLongitude { get; set; }
        public string Province { get; set; }

    }
}
