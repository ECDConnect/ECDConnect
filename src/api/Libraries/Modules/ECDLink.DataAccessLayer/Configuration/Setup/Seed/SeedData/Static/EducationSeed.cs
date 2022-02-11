using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class EducationSeedConstants
    {
        public static Guid Matric = Guid.Parse("2c09aaf9-f68e-45e7-871e-de0c2a6d27f2");
        public static Guid Diploma = Guid.Parse("68e7fb42-8db8-4798-8853-0fa9cc602981");
        public static Guid Degree = Guid.Parse("e015e4e7-cab2-43f6-bbb8-3ea1100e3051");
    }

    internal static class EducationSeed<T>
        where T : Education, new()
    {
        internal static IList<T> GetEducationSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = EducationSeedConstants.Matric,
                    Description = "Matric"
                },
                new T
                {
                    Id = EducationSeedConstants.Diploma,
                    Description = "Diploma"
                },
                new T
                {
                    Id = EducationSeedConstants.Degree,
                    Description = "Degree"
                }
            };
        }
    }
}
