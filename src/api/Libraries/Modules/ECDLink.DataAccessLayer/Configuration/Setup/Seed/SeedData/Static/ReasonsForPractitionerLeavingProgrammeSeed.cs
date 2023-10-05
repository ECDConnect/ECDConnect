using ECDLink.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class ReasonsForPractitionerLeavingProgrammeSeedConstants
    {
        public static Guid MovingToAnotherSmartStartProgramme = Guid.Parse("279da107-c186-4976-9ba5-9f316c1964f5");
        public static Guid MovingToANonSmartStartProgramme = Guid.Parse("d8fea570-6c50-43ce-846c-8a2a2c522da4");
        public static Guid HasTakenANonECDJob = Guid.Parse("779871a1-4351-423d-86fe-949eb2200146");
        public static Guid Relocated = Guid.Parse("5c786db8-35a9-4731-b370-d70847eaf400");
        public static Guid DoesNotWantToDoThisWorkAnymore = Guid.Parse("f90e80b4-e9da-43c9-adcf-4d2c156a22b7");
        public static Guid Other = Guid.Parse("7049458d-cd48-4e74-883d-9b984e65feee");   
    }

    internal static class ReasonsForPractitionerLeavingProgrammeSeed<T>
        where T : ReasonForPractitionerLeavingProgramme, new()
    {
        internal static IList<T> GetReasonsForPractitionerLeavingProgrammeSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = ReasonsForPractitionerLeavingProgrammeSeedConstants.MovingToAnotherSmartStartProgramme,
                    Description = "Moving to another SmartStart programme"
                },
                new T
                {
                    Id = ReasonsForPractitionerLeavingProgrammeSeedConstants.MovingToANonSmartStartProgramme,
                    Description = "Moving to a non-SmartStart programme"
                },
                new T
                {
                    Id = ReasonsForPractitionerLeavingProgrammeSeedConstants.HasTakenANonECDJob,
                    Description = "Has taken a non-ECD job"
                },
                new T
                {
                    Id = ReasonsForPractitionerLeavingProgrammeSeedConstants.Relocated,
                    Description = "Relocated"
                },
                new T
                {
                    Id = ReasonsForPractitionerLeavingProgrammeSeedConstants.DoesNotWantToDoThisWorkAnymore,
                    Description = "Does not want to do this work anymore"
                },
                new T
                {
                    Id = ReasonsForPractitionerLeavingProgrammeSeedConstants.Other,
                    Description = "Other"
                },
            };
        }
    }
}
