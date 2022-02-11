using System;

namespace ECDLink.Security.Attributes
{
    // Added in Permission attribute to act as a "grouping" of lower level permissions,
    // rather then having CRUD permission on each entity
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public class EntityPermissionAttribute : Attribute
    {
        public string PermissionName { get; private set; }

        public EntityPermissionAttribute(string name)
        {
            PermissionName = name;
        }
    }
}
