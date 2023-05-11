namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedChildCaregiver : MappedBaseEntity
    {

        MappedChild Child { get; set; }
        MappedCaregiver Caregiver { get; set; }

    }

}
