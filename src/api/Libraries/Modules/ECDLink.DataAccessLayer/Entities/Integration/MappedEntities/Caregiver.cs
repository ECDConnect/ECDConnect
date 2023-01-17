namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedCaregiver : MappedBaseEntity
    {
        public string ContactNumber { get; set; }
        public string RelationshipType { get; set; }
        public string HighestEducationLevel { get; set; }
        public string Language { get; set; }

    }
}
