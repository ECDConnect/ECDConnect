using ECDLink.DataAccessLayer.Entities.Classroom;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class AttendenceReasonSeedConstants
    {
        public static Guid GradeRGuid = Guid.Parse("771b505b-7f44-4230-b8a5-afd20fdbbcce");
        public static Guid NoSchoolGuid = Guid.Parse("913a6024-c3d4-4bf9-94f0-4f846c082b0c");
        public static Guid Other = Guid.Parse("32a9172a-bf3d-4e3b-a2bd-ed6f298db789");
    }

    internal static class AttendenceReasonSeed<T>
        where T : ProgrammeAttendanceReason, new()
    {
        internal static IList<T> GetAttendenceReasons()
        {
            return new List<T>()
            {
                // SMS
                new T
                {
                  Id = AttendenceReasonSeedConstants.GradeRGuid,
                  Reason = "No Grade R in area"
                },
                new T
                {
                    Id = AttendenceReasonSeedConstants.NoSchoolGuid,
                  Reason = "No School in area"
                },
                new T
                {
                    Id = AttendenceReasonSeedConstants.Other,
                  Reason = "Other"
                }
            };
        }
    }
}
