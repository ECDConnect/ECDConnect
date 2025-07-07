using ECDLink.Abstractrions.Services;
using ECDLink.Core.Extensions;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Classroom;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.Api.CoreApi.Services
{
    public abstract class AttendanceReportBase : IDisposable
    {
        protected AuthenticationDbContext _dbContext;
        protected IHolidayService<Holiday> _holidayService;

        public AttendanceReportBase(IHolidayService<Holiday> holidayService, AuthenticationDbContext dbContext)
        {
            _holidayService = holidayService;
            _dbContext = dbContext;
        }

        public virtual IEnumerable<DateTime> GetDayRangeWithoutHolidays(DateTime startMonth, DateTime endMonth)
        {
            var holidays = _holidayService.GetHolidays(startMonth, endMonth, "en-za").ToList();

            //if current month, do not project as per business rules and use current date as enddate - if its the 1st of the month and dates match, then add 1 day
            //endMonth = (endMonth.Month == DateTime.Now.Month ? (startMonth.Date == DateTime.Now.Date ? DateTime.Now.AddDays(1) : DateTime.Now) : endMonth);

            var datesBetween = startMonth.DaysBetween(endMonth.GetEndOfDay());

            return RemoveHolidays(datesBetween, holidays);
        }

        public virtual IEnumerable<DateTime> RemoveHolidays(IEnumerable<DateTime> days, List<Holiday> holidays)
        {
            var holidayDates = holidays.Select(x => x.Day);

            return days.Except(holidayDates);
        }

        public virtual List<Attendance> GetAttendanceRecordsForPeriodByProgramme(IEnumerable<Guid> ClassroomProgrammeIds, string userId, DateTime startMonth, DateTime endMonth)
        {
            return _dbContext.Attendances
              .Include(i => i.ClassroomProgramme)
              .Where(a => Guid.Parse(userId) == a.UserId && ClassroomProgrammeIds.Contains(a.ClassroomProgrammeId))
              .Where(f => f.AttendanceDate >= startMonth.Date && f.AttendanceDate < endMonth.GetEndOfDay())
              .ToList();
        }

        internal virtual IEnumerable<Classroom> GetActiveClassrooms(DateTime startMonth, DateTime endMonth)
        {
            var activeClasses = _dbContext.ClassProgrammes
              .Include(x => x.ClassroomGroup)
              .ThenInclude(x => x.Classroom)
              .ThenInclude(x => x.User)
              .Where(cp => cp.ProgrammeStartDate <= endMonth.GetEndOfDay())
              .Select(c => c.ClassroomGroup.Classroom)
              .Distinct();

            return activeClasses;
        }

        public virtual IEnumerable<DateTime> CalculateDaysOfClassForMonth(DateTime month, int day, IEnumerable<DateTime> validClassdays, DateTime? startBound, DateTime? endBound)
        {
            var actualStart = month;

            if (startBound.HasValue && startBound.Value > actualStart)
            {
                if (actualStart.IsInSameMonth(startBound))
                {
                    actualStart = startBound.Value;
                }
                else
                {
                    return Enumerable.Empty<DateTime>();
                }
            }
            
            var actualEnd = actualStart.GetEndOfMonth();
            if (endBound.HasValue && endBound.Value < actualEnd)
            {
                if (actualEnd.IsInSameMonth(endBound))
                {
                    actualEnd = endBound.Value;
                }
                else
                {
                    return Enumerable.Empty<DateTime>();
                }
            }

            var monthRange = validClassdays.Where(x => x.Date >= actualStart.Date && x.Date <= actualEnd.GetEndOfDay()).ToList();

            return monthRange.Where(x => (int)x.DayOfWeek == day).ToList();
        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }
}
