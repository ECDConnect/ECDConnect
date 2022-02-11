using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class ReasonsForLeavingSeedConstants
    {
        public static Guid StartR = Guid.Parse("1720616e-f86b-4715-a7c6-94d5b25aea7a");
        public static Guid Moving = Guid.Parse("e49aac51-be89-4f63-ab4b-4d873cc81a91");
        public static Guid CloserHome = Guid.Parse("2f0afdbc-0389-4390-9a3b-0d561e568bfa");
        public static Guid OpenLonger = Guid.Parse("595d41b1-56d3-45e1-ad39-e42313c22c59");
        public static Guid NoEarlyYears = Guid.Parse("bb27cfa6-67b0-4843-87fc-0a9ce0bca70e");
        public static Guid NotEnjoying = Guid.Parse("a26d6775-065e-4354-a2e0-56d1acc85f59");
        public static Guid Other = Guid.Parse("4755d392-abcf-4dbe-aeda-b094ef1657e5");
    }

    internal static class ReasonsForLeavingSeed<T>
        where T : ReasonForLeaving, new()
    {
        internal static IList<T> GetReasonForLeavingSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = ReasonsForLeavingSeedConstants.StartR,
                    Description = "Starting Grade R"
                },
                new T
                {
                    Id = ReasonsForLeavingSeedConstants.Moving,
                    Description = "Moving to a different area"
                },
                new T
                {
                    Id = ReasonsForLeavingSeedConstants.CloserHome,
                    Description = "Going to a different programme which is closer to home"
                },
                new T
                {
                    Id = ReasonsForLeavingSeedConstants.OpenLonger,
                    Description = "Going to a different programme which is open for longer"
                },
                new T
                {
                    Id = ReasonsForLeavingSeedConstants.NoEarlyYears,
                    Description = "Caregiver doesn’t want child to go to any early years programme"
                },
                new T
                {
                    Id = ReasonsForLeavingSeedConstants.NotEnjoying,
                    Description = "Child was not enjoying the programme"
                },
                new T
                {
                    Id = ReasonsForLeavingSeedConstants.Other,
                    Description = "Other"
                }
            };
        }
    }
}
