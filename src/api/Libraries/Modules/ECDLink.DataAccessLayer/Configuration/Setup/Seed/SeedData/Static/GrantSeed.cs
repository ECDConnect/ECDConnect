using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class GrantSeedConstants
    {
        public static Guid ChildSupport = Guid.Parse("192254fe-f614-431c-a789-2729aef37e62");
        public static Guid FosterCare = Guid.Parse("cf610ca4-3eb6-4ee5-b063-dc4ab2feecbc");
        public static Guid Pension = Guid.Parse("23b1b880-2c81-4dfa-9e90-3dbb77959ef5");
        public static Guid Disability = Guid.Parse("b0fc151f-1388-4fda-be88-33f8484d0f1b");
        //public static Guid None = Guid.Parse("99093226-9f87-492c-bd62-645d8c1c6eaa");
    }

    internal static class GrantSeed<T>
        where T : Grant, new()
    {
        internal static IList<T> GetGrantSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = GrantSeedConstants.ChildSupport,
                    Description = "Child Support Grant"
                },
                new T
                {
                    Id = GrantSeedConstants.FosterCare,
                    Description = "Foster Care Grant"
                },
                new T
                {
                    Id = GrantSeedConstants.Pension,
                    Description = "Pension"
                },
                new T
                {
                    Id = GrantSeedConstants.Disability,
                    Description = "Disability"
                }
                //,
                //new T
                //{
                //    Id = GrantSeedConstants.None,
                //    Description = "None"
                //}
            };
        }
    }
}
