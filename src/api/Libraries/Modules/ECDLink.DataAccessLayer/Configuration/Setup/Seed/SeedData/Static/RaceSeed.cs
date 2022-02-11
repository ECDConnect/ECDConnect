using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class RaceSeedConstants
    {
        public static Guid African = Guid.Parse("212ef761-b9c0-44bf-b720-d63332b4cfd3");
        public static Guid Coloured = Guid.Parse("415d2af1-567e-4631-8f0c-daf8106c7a22");
        public static Guid White = Guid.Parse("77a23508-46e9-4b9d-9582-6747f2367132");
        public static Guid Indian = Guid.Parse("58c7317d-03d4-4ec4-b2e2-c3c2e4829337");
        public static Guid Other = Guid.Parse("17fbe767-1b9d-447d-b531-0205f2f3eeb7");
    }

    internal static class RaceSeed<T>
        where T : Race, new()
    {
        internal static IList<T> GetRaceSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = RaceSeedConstants.African,
                    Description = "African"
                },
                new T
                {
                    Id = RaceSeedConstants.Coloured,
                    Description = "Coloured"
                },
                new T
                {
                    Id = RaceSeedConstants.White,
                    Description = "White"
                },
                new T
                {
                    Id = RaceSeedConstants.Indian,
                    Description = "Indian"
                },
                new T
                {
                    Id = RaceSeedConstants.Other,
                    Description = "Other"
                }
            };
        }
    }
}
