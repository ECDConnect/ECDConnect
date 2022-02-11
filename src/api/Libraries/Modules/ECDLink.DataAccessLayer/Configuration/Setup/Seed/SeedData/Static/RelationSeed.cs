using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class RelationSeedConstants
    {
        public static Guid Father = Guid.Parse("c3dd6d6c-e120-4a9f-90ab-3a8bd8ab7fdc");
        public static Guid Mother = Guid.Parse("568a219f-f1b9-41ac-bf38-143d8d749a39");
        public static Guid Guardian = Guid.Parse("8fc60d17-57be-4b46-aed9-ca035c560848");
        public static Guid Grandparent = Guid.Parse("95095d04-6990-4a34-ba76-23000e52e1fb");
    }

    internal static class RelationSeed<T>
        where T : Relation, new()
    {
        internal static IList<T> GetSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = RelationSeedConstants.Father,
                    Description = "Father"
                },
                new T
                {
                    Id = RelationSeedConstants.Mother,
                    Description = "Mother"
                },
                new T
                {
                    Id = RelationSeedConstants.Guardian,
                    Description = "Guardian"
                },
                new T
                {
                    Id = RelationSeedConstants.Grandparent,
                    Description = "Grandparent"
                }
            };
        }
    }
}
