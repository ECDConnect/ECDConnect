namespace ECDLink.DataAccessLayer.Events
{
    public interface IDomainEventService
    {
        void NotifyCreate<T>(string createdById, T entity);

        void NotifyUpdate<T>(string updatedById, T entity);

        void NotifyDelete<T>(string deletedById, T entity);
    }
}
