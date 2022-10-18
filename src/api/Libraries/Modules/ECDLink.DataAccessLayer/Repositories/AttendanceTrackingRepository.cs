using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.AuditLog;
using ECDLink.DataAccessLayer.Entities.Classroom;
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

            var attendances = _context.Attendances
                              .Include(x => x.User)
                              .Include(x => x.ClassroomProgramme)
                                .ThenInclude(x => x.ClassroomGroup)
                              .Where(x => string.Equals(x.ParentRecordId, userId));

            return attendances;
        }

        public IQueryable<Attendance> GetAllByDateRange(DateTime startMonth, DateTime endMonth)
        {
            var start = startMonth.GetStartOfMonth();
            var end = endMonth.GetStartOfMonth();
            return _context.Attendances.Where(f => f.AttendanceDate >= start && f.AttendanceDate < end);            
        }

        public List<ClassroomAttendance> GetAllByDateRangeByClassroom(DateTime startMonth, DateTime endMonth, Guid classroomId)
        {
            //TODO: iterate through classrooms and its programmes and tally up
            var start = startMonth.GetStartOfMonth();
            var end = endMonth.GetStartOfMonth();
            List<ClassroomAttendance> classAttendance = new List<ClassroomAttendance>();
            //foreach (var classroom in classes)
            //{
                //get all programmes under classroom
                List<ClassProgramme> programmes = _context.ClassProgrammes.Where(x => x.ClassroomGroupId.Equals(classroomId)).ToList();
                IQueryable<Attendance> attendance = _context.Attendances.Where(f => f.AttendanceDate >= start && f.AttendanceDate < end);

                //ClassAttendance = programmes.Where(x => x.ClassroomId.ToString().Contains(classroom.Id.ToString())).ToList() };
                List<string> programmeIds = programmes.Where(x => x.ClassroomGroupId.Equals(classroomId)).Select(y => y.ClassroomGroupId.ToString()).ToList();
                List<Attendance> filteredAttendance = (List<Attendance>)attendance.Where(x => x.ClassroomProgrammeId.ToString().Contains(programmeIds.ToString())).ToList();
                classAttendance.Add(new ClassroomAttendance() { ClassroomId = classroomId.ToString(), ClassAttendance = filteredAttendance });
            //}

            return classAttendance;//
        }
    }
}
