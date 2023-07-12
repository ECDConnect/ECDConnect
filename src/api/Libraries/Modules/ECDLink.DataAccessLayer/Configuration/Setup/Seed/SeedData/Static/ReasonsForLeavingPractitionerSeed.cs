using ECDLink.DataAccessLayer.Entities;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using static NPOI.HSSF.Util.HSSFColor;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class ReasonsForLeavingPractitionerSeedConstants
    {
        // MATTODO - update all the ids!
        public static Guid CouldNotFindChildren = Guid.Parse("06eefbbd-ee77-4d02-9dae-dea3608742c9");
        public static Guid NotInterestedInECD = Guid.Parse("512e06fb-5805-4207-9b87-4fba4ea00f12");
        public static Guid Relocated = Guid.Parse("d7c94ba2-9279-47cb-8d9d-f5b80b1fc70a");
        public static Guid ProblemsWithVenue = Guid.Parse("eb87cca4-e28b-4398-910f-dc60dcbbfafb");
        public static Guid MovedToOtherCWP = Guid.Parse("b86630e9-9a6d-43cf-8545-63a8b1ed62aa");
        public static Guid HealthIssues = Guid.Parse("2611dab8-52a2-4212-910d-f203a05e1ea0");
        public static Guid WentBackToSchool = Guid.Parse("951a0a16-5b95-4d6c-aa99-3a3a072e9b6c");
        public static Guid NotEnoughIncome = Guid.Parse("258c3081-746c-4cf8-af7e-b2c8fa37820e");
        public static Guid Delicensed = Guid.Parse("4ad4e79f-9446-4584-94d8-484e16c6336c");
        public static Guid DidNotCompleteOnboarding = Guid.Parse("001b8ef4-92e5-4d29-8bb4-edb5332346ee");
        public static Guid Other = Guid.Parse("528d108a-b70a-4cbb-943e-f799cecceba6");    
    }

    internal static class ReasonsForLeavingPractitionerSeed<T>
        where T : ReasonForLeavingPractitioner, new()
    {
        internal static IList<T> GetReasonForLeavingPractitionerSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = ReasonsForLeavingPractitionerSeedConstants.CouldNotFindChildren,
                    Description = "Could not find children"
                },
                new T
                {
                    Id = ReasonsForLeavingPractitionerSeedConstants.NotInterestedInECD,
                    Description = "Not interested in ECD"
                },
                new T
                {
                    Id = ReasonsForLeavingPractitionerSeedConstants.Relocated,
                    Description = "Relocated"
                },
                new T
                {
                    Id = ReasonsForLeavingPractitionerSeedConstants.ProblemsWithVenue,
                    Description = "Problems with venue"
                },
                new T
                {
                    Id = ReasonsForLeavingPractitionerSeedConstants.MovedToOtherCWP,
                    Description = "Moved to other CWP"
                },
                new T
                {
                    Id = ReasonsForLeavingPractitionerSeedConstants.HealthIssues,
                    Description = "Health issues"
                },
                new T
                {
                    Id = ReasonsForLeavingPractitionerSeedConstants.WentBackToSchool,
                    Description = "Went back to school"
                },
                new T
                {
                    Id = ReasonsForLeavingPractitionerSeedConstants.NotEnoughIncome,
                    Description = "Not enough income"
                },
                new T
                {
                    Id = ReasonsForLeavingPractitionerSeedConstants.Delicensed,
                    Description = "Delicensed"
                },
                new T
                {
                    Id = ReasonsForLeavingPractitionerSeedConstants.DidNotCompleteOnboarding,
                    Description = "Did not complete onboarding"
                },
                new T
                {
                    Id = ReasonsForLeavingPractitionerSeedConstants.Other,
                    Description = "Other"
                },
            };
        }
    }
}
