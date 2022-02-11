using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.AuditLog;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class AuditLogTypeSeedConstants
    {
        public static Guid TrackAttendance = Guid.Parse("68e4e63c-b2b8-4060-bf43-afbef894c6b0");
    }

    internal static class AuditLogTypeSeed<T>
        where T : AuditLogType, new()
    {
        internal static IList<T> GetSeed()
        {
            return new List<T>()
            {
                new T
                {
                    Id = AuditLogTypeSeedConstants.TrackAttendance,
                    EnumId = AuditLogTypeEnum.TrackAttendance,
                    Description = "Track Attendance"
                }
            };
        }
    }
}
