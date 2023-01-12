namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedChildCaregiver : MappedBaseEntity
    {

        MappedChild child { get; set; }
        MappedCaregiver caregiver { get; set; }

    }

}
