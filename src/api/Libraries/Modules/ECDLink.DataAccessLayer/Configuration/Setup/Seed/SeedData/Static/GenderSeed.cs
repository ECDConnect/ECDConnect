using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class GenderSeedConstants
    {
        public static Guid MaleIdGuid = Guid.Parse("61791dd5-2563-4a45-9d66-03be48d50e28");
        public static Guid FemaleIdGuid = Guid.Parse("2505d06f-d3cb-4544-abf8-f984fbe78505");
    }

    internal static class GenderSeed<T>
    where T : Gender, new()
    {
        internal static IList<T> GetGenderSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = GenderSeedConstants.MaleIdGuid,
                    Description = "Male"
                },
                new T
                {
                    Id = GenderSeedConstants.FemaleIdGuid,
                    Description = "Female"
                }
            };
        }
    }
}
