using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Classroom;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class ProgrammeTypeSeedConstants
    {
        public static Guid Playgroup = Guid.Parse("c8858630-bb66-4d93-b93f-295cf7cd9ed5");
        public static Guid DayMother = Guid.Parse("0edfa1f9-4ba6-42f2-af53-3829d8faca88");
        public static Guid Preschool = Guid.Parse("2d570001-7a9e-43af-8efd-96065d830493");
    }

    internal static class ProgrammeTypeSeed<T>
        where T : ProgrammeType, new()
    {
        internal static IList<T> GetSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = ProgrammeTypeSeedConstants.Playgroup,
                    EnumId = ProgrammeTypeEnum.Playgroup,
                    Description = "Playgroup"
                },
                new T
                {
                    Id = ProgrammeTypeSeedConstants.DayMother,
                    EnumId = ProgrammeTypeEnum.DayMother,
                     Description = "Day Mother"
                },
                new T
                {
                    Id = ProgrammeTypeSeedConstants.Preschool,
                    EnumId = ProgrammeTypeEnum.Preschool,
                    Description = "Preschool"
                }
            };
        }
    }
}
