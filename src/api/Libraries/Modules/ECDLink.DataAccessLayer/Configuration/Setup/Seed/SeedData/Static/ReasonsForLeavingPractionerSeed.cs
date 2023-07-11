using ECDLink.DataAccessLayer.Entities;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using static NPOI.HSSF.Util.HSSFColor;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class ReasonsForLeavingPractionerSeedConstants
    {
        // MATTODO - update all the ids!
        public static Guid CouldNotFindChildren = Guid.Parse("4755d392-abcf-4dbe-aeda-b094ef1657e5");
        public static Guid NotInterestedInECD = Guid.Parse("4755d392-abcf-4dbe-aeda-b094ef1657e5");
        public static Guid Relocated = Guid.Parse("4755d392-abcf-4dbe-aeda-b094ef1657e5");
        public static Guid ProblemsWithVenue = Guid.Parse("4755d392-abcf-4dbe-aeda-b094ef1657e5");
        public static Guid MovedToOtherCWP = Guid.Parse("4755d392-abcf-4dbe-aeda-b094ef1657e5");
        public static Guid HealthIssues = Guid.Parse("4755d392-abcf-4dbe-aeda-b094ef1657e5");
        public static Guid WentBackToSchool = Guid.Parse("4755d392-abcf-4dbe-aeda-b094ef1657e5");
        public static Guid NotEnoughIncome = Guid.Parse("4755d392-abcf-4dbe-aeda-b094ef1657e5");
        public static Guid Delicensed = Guid.Parse("4755d392-abcf-4dbe-aeda-b094ef1657e5");
        public static Guid DidNotCompleteOnboarding = Guid.Parse("4755d392-abcf-4dbe-aeda-b094ef1657e5");
        public static Guid Other = Guid.Parse("4755d392-abcf-4dbe-aeda-b094ef1657e5");    
    }

    internal static class ReasonsForLeavingPractionerSeed<T>
        where T : ReasonForLeavingPractioner, new()
    {
        internal static IList<T> GetReasonForLeavingPractionerSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = ReasonsForLeavingPractionerSeedConstants.Other,
                    Description = "Other"
                },
            };
        }
    }
}
