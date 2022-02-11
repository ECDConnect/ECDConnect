using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Navigation;
using ECDLink.DataAccessLayer.Entities.Workflow;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.NavigationData
{
    internal static class NavigationSeed<T>
        where T : Navigation, new()
    {
        internal static IList<T> GetNavigations()
        {
            return new List<T>()
            {
                new T
                {
                  Sequence = 1,
                  Name = "Dashboard",
                  Icon = "HomeIcon",
                  IsActive = true,
                  Route = "/dashboard",
                  Description = "Dashboard",
                },
                new T
                {
                  Sequence = 2,
                  Name = "Users",
                  Icon = "UsersIcon",
                  IsActive = true,
                  Route = "/users",
                  Description = "Users",
                },
                new T
                {
                  Sequence = 3,
                  Name = "Roles & Permissions",
                  Icon = "ShieldCheckIcon",
                  IsActive = true,
                  Route = "/roles",
                  Description = "Roles & Permissions",
                },
                new T
                {
                  Sequence = 4,
                  Name = "Documents",
                  Icon = "DocumentIcon",
                  IsActive = true,
                  Route = "/documents",
                  Description = "Documents",
                },
                new T
                {
                  Sequence = 5,
                  Name = "Content Management",
                  Icon = "AnnotationIcon",
                  IsActive = true,
                  Route = "/content-management",
                  Description = "Content Management",
                },
                new T
                {
                  Sequence = 6,
                  Name = "Reporting",
                  Icon = "DocumentReportIcon",
                  IsActive = true,
                  Route = "/reports",
                  Description = "Reporting",
                },
                new T
                {
                  Sequence = 7,
                  Name = "Site data",
                  Icon = "AdjustmentsIcon",
                  IsActive = true,
                  Route = "/data",
                  Description = "Site data",
                },
                new T
                {
                  Sequence = 8,
                  Name = "Settings",
                  Icon = "CogIcon",
                  IsActive = true,
                  Route = "/settings",
                  Description = "Settings",
                },
            };
        }
    }
}
