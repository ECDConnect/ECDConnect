using ECDLink.DataAccessLayer.Hierarchy.Entities;
using System;

namespace ECDLink.DataAccessLayer.Entities.Interfaces
{
    public interface IUserType : IHierarchyScoped
    {
        public Guid? UserId { get; set; }
    }
}
