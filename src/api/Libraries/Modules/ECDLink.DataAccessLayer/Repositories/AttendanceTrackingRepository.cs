using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Repositories
{
    public class AttendanceTrackingRepository
    {
        private AuthenticationDbContext _context;

        public AttendanceTrackingRepository(AuthenticationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> TrackAttendance(IEnumerable<Attendance> attendances)
        {
            try
            {
                // Check for existing records
                foreach (var attendance in attendances)
                {
                    var existingRecord = _context.Attendances.FirstOrDefault(x =>
                        x.UserId == attendance.UserId
                        && x.ClassroomProgrammeId == attendance.ClassroomProgrammeId 
                        && x.WeekOfYear == attendance.WeekOfYear);

                    if (existingRecord != null)
                    {
                        // Update existing record
                        if (existingRecord.Attended != attendance.Attended)
                        {
                            existingRecord.Attended = attendance.Attended;
                        }
                    }
                    else
                    {
                        // Add new record
                        _context.Attendances.Add(attendance);
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                // Log error
                return false;
            }

            return true;
        }

        public IQueryable<Attendance> GetAllAttendances(List<Guid> classroomGroupIds)
        {
            if (classroomGroupIds == null || !classroomGroupIds.Any())
            {
                return Enumerable.Empty<Attendance>().AsQueryable();
            }

            var tenantId = TenantExecutionContext.Tenant.Id;
            var attendances = _context.Attendances
                              .Include(x => x.User)
                              .Include(x => x.ClassroomProgramme)
                                .ThenInclude(x => x.ClassroomGroup)
                              .Where(x => x.ClassroomProgramme.ClassroomGroupId.HasValue && classroomGroupIds.Contains(x.ClassroomProgramme.ClassroomGroupId.Value))
                              .Where(e => e.TenantId == Guid.Empty || e.TenantId == tenantId);

            return attendances;
        }

        public IQueryable<Attendance> GetAllAttendancesByParentId(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Enumerable.Empty<Attendance>().AsQueryable();
            }

            var tenantId = TenantExecutionContext.Tenant.Id;
            var attendances = _context.Attendances
                              .Include(x => x.User)
                              .Include(x => x.ClassroomProgramme)
                                .ThenInclude(x => x.ClassroomGroup)
                              .Where(x => x.ParentRecordId == userId)
                              .Where(e => e.TenantId == Guid.Empty || e.TenantId == tenantId);

            return attendances;
        }

        public IQueryable<Attendance> GetAllByDateRange(DateTime start, DateTime end)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return _context.Attendances
                .Where(f => f.AttendanceDate >= start && f.AttendanceDate < end)
                .Where(e => e.TenantId == Guid.Empty || e.TenantId == tenantId);
        }

        public IQueryable<Attendance> GetAllByDateRangeByFullMonth(DateTime startMonth, DateTime endMonth)
        {
            var start = startMonth.GetStartOfMonth();
            var end = endMonth.GetEndOfMonth();
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return _context.Attendances
                .Where(f => f.AttendanceDate >= start && f.AttendanceDate <= end)
                .Where(e => e.TenantId == Guid.Empty || e.TenantId == tenantId);
        }

        public List<Attendance> GetAllByDateRangeByClassroom(DateTime startMonth, DateTime endMonth, Guid classroomGroupId, string userId = null)
        {
            try
            {
                var start = startMonth.GetStartOfMonth();
                var end = endMonth.GetEndOfMonth();
                Guid tenantId = TenantExecutionContext.Tenant.Id;
                //get all programmes under classroom
                IQueryable<ClassProgramme> programmes = _context.ClassProgrammes.Where(x => x.ClassroomGroupId == classroomGroupId).AsQueryable();
                IQueryable<Attendance> attendanceQuery = null;
                if (userId is not null) {
                    attendanceQuery = _context.Attendances.Where(f => f.UserId.ToString() == userId && f.AttendanceDate >= start && f.AttendanceDate <= end);
                } else
                {
                    attendanceQuery = _context.Attendances.Where(f => f.AttendanceDate >= start && f.AttendanceDate < end);
                }
                List<Attendance> attendance = attendanceQuery
                    .Where(e => e.TenantId == Guid.Empty || e.TenantId == tenantId)
                    .ToList();
                List<string> programmeIds = programmes.Select(y => y.Id.ToString()).ToList();

                List<Attendance> filteredAttendance = new List<Attendance>();

                if (attendance.Any())
                {
                    foreach (var att in attendance)
                    {
                        if (programmeIds.Contains(att.ClassroomProgrammeId.ToString()))
                        {
                            if (att != null)
                            {
                                filteredAttendance.Add(att);
                            }
                        }
                    }
                }
                return filteredAttendance;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<Attendance> GetAllByParentClassroom(Guid classroomId, string userId, string parentRecordId)
        {
            try
            {
                Guid tenantId = TenantExecutionContext.Tenant.Id;
                //get all programmes under classroom
                List<Attendance> attendance = _context.Attendances.Where(f => f.UserId.ToString() == userId)
                    .Where(g => g.ClassroomProgrammeId == classroomId)
                    .Where(y => y.ParentRecordId == parentRecordId)
                    .Where(e => e.TenantId == tenantId).ToList();//

                List<Attendance> filteredAttendance = new List<Attendance>();

                if (attendance.Any())
                {

                    foreach (var att in attendance)
                    {
                        if (att != null)
                        {
                            filteredAttendance.Add(att);
                        }
                    }
                }
                return filteredAttendance;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public bool UpdateAttendance(Attendance attendance, string newParentRecordId)
        {
            try
            {
                var existingAttendance = _context.Attendances
                    .Where(x => x.UserId == attendance.UserId && x.ClassroomProgrammeId == attendance.ClassroomProgrammeId)
                    .Where(y => y.ParentRecordId == attendance.ParentRecordId && y.AttendanceDate == attendance.AttendanceDate)
                    .OrderBy(x => x.UserId)
                    .FirstOrDefault();

                existingAttendance.ParentRecordId = newParentRecordId;

                _context.Update(existingAttendance);
                return true;
            }
            catch (Exception)
            {
                // Log error
                return false;
            }
        }

        public int GetAttendancePercentileByParent(string parentRecordId, DateTime startDate, DateTime endDate)
        {
            try
            {
                int totalPercentageAttendance = 0;
                int percentageAttendance = 0;
                Guid tenantId = TenantExecutionContext.Tenant.Id;
                List<ClassroomGroup> groups = _context.ClassroomGroups.Where(x => x.UserId == Guid.Parse(parentRecordId)).ToList();
                int divider = 0;
                foreach (ClassroomGroup group in groups)
                {

                    List<ClassProgramme> programmes = _context.ClassProgrammes.Where(x => x.ClassroomGroupId == group.Id).ToList();

                    foreach (ClassProgramme programme in programmes)
                    {
                        List<Attendance> attendance = _context.Attendances
                            .Where(g => g.ClassroomProgrammeId == programme.Id)
                            .Where(y => y.ParentRecordId == parentRecordId)
                            .Where(x => x.AttendanceDate >= startDate && x.AttendanceDate <= endDate)
                            .Where(e => e.TenantId == tenantId).ToList();//

                        List<Attendance> filteredAttendance = new List<Attendance>();

                        if (attendance.Any())
                        {
                            divider = attendance.Count();
                            int absent = 0;
                            int present = 0;
                            foreach (var att in attendance)
                            {
                                if (att != null)
                                {
                                    filteredAttendance.Add(att);
                                    present += (att.Attended == true ? 1 : 0);
                                    absent += (att.Attended == false ? 1 : 0);
                                }
                            }
                            //calculate attendance percentage
                            percentageAttendance += (present > 0 ? (int)Math.Round((double)(present / (present + absent) * 100)) : 0);
                        }

                    }
                }

                if (percentageAttendance > 0)
                {
                    totalPercentageAttendance = (int)Math.Round((double)(percentageAttendance / (divider * 100)) * 100);
                }
                return totalPercentageAttendance;
            }
            catch (Exception)
            {
                return 0;
            }
        }
    }
}
