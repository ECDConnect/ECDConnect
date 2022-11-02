using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.AuditLog;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Math.EC.Rfc7748;
using System;
using System.Collections;
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
                _context.Attendances.AddRange(attendances);

                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                // Log error
                return false;
            }

            return true;
        }

        public IQueryable<Attendance> GetAllAttendancesByParentId(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Enumerable.Empty<Attendance>().AsQueryable();
            }
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var attendances = _context.Attendances
                              .Include(x => x.User)
                              .Include(x => x.ClassroomProgramme)
                                .ThenInclude(x => x.ClassroomGroup)
                              .Where(x => string.Equals(x.ParentRecordId, userId))
                              .Where(e => e.TenantId == null || e.TenantId.Equals(tenantId));

            return attendances;
        }

        public IQueryable<Attendance> GetAllByDateRange(DateTime startMonth, DateTime endMonth)
        {
            var start = startMonth.GetStartOfMonth();
            var end = endMonth.GetStartOfMonth();
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return _context.Attendances
                .Where(f => f.AttendanceDate >= start && f.AttendanceDate < end)
                .Where(e => e.TenantId == null || e.TenantId.Equals(tenantId));            
        }


        public List<Attendance> GetAllByDateRangeByClassroom(DateTime startMonth, DateTime endMonth, Guid classroomId, string userId)
        {
            try
            {
                var start = startMonth.GetStartOfMonth();
                var end = endMonth.GetEndOfMonth();
                Guid tenantId = TenantExecutionContext.Tenant.Id;
                //get all programmes under classroom
                IQueryable<ClassProgramme> programmes = _context.ClassProgrammes.Where(x => x.ClassroomGroupId.Equals(classroomId)).AsQueryable();
                List<Attendance> attendance = _context.Attendances.Where(f => f.UserId == userId && f.AttendanceDate >= start && f.AttendanceDate < end).Where(e => e.TenantId == null || e.TenantId.Equals(tenantId)).ToList();//
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
            catch (Exception e)
            {
                return null;
            }
        }
    }
}
