using ECDLink.DataAccessLayer.Hierarchy.Entities;

namespace ECDLink.DataAccessLayer.Entities.Interfaces
{
    public interface IUserType : IHierarchyScoped
    {
        public string UserId { get; set; }
    }
}
