using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class ProvincesSeedConstants
    {
        public static Guid EasternCape = Guid.Parse("58f42ddf-38d5-4008-a007-af7cb220206c");
        public static Guid FreeState = Guid.Parse("4f5b20fd-0560-41cc-855f-80c399b42aed");
        public static Guid Gauteng = Guid.Parse("d1a18dc2-8ad7-4417-8cbf-ebf07833f86c");
        public static Guid KwaZuluNatal = Guid.Parse("623a071f-3b3e-43e8-a297-75dc1f68756c");
        public static Guid Limpopo = Guid.Parse("65781a5f-c7b8-418a-85ea-06c78abfec37");
        public static Guid NorthernCape = Guid.Parse("73b40520-2a68-47ff-831f-6be160dbc60e");
        public static Guid NorthWest = Guid.Parse("1f430b67-6759-4cca-a121-db1cb406410c");
        public static Guid WesternCape = Guid.Parse("4d3a4d5d-f983-49bd-8ca5-2aaa72846032");
        public static Guid Mpumalanga = Guid.Parse("c2b47d46-d987-46b2-82dc-0e0959cf92fb");
    }

    internal static class ProvincesSeed<T>
        where T : Province, new()
    {
        internal static IList<T> GetProvinceSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = ProvincesSeedConstants.EasternCape,
                    Description = "Eastern Cape"
                },
                new T
                {
                    Id = ProvincesSeedConstants.FreeState,
                    Description = "Free State"
                },
                new T
                {
                    Id = ProvincesSeedConstants.Gauteng,
                    Description = "Gauteng"
                },
                new T
                {
                    Id = ProvincesSeedConstants.KwaZuluNatal,
                    Description = "KwaZulu-Natal"
                },
                new T
                {
                    Id = ProvincesSeedConstants.Limpopo,
                    Description = "Limpopo"
                },
                new T
                {
                    Id = ProvincesSeedConstants.NorthernCape,
                    Description = "Northern Cape"
                },
                new T
                {
                    Id = ProvincesSeedConstants.NorthWest,
                    Description = "North West"
                },
                new T
                {
                    Id = ProvincesSeedConstants.WesternCape,
                    Description = "Western Cape"
                },
                new T
                {
                    Id = ProvincesSeedConstants.Mpumalanga,
                    Description = "Mpumalanga"
                }
            };
        }
    }
}
