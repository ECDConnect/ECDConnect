using System.Threading.Tasks;
using System;
using ECDLink.DataAccessLayer.Entities.Documents;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface IAttendancePdfService
    {
        Task<Document> GetClassroomAttendanceReportPDFFile(
            string userId,
            Guid classroomId,
            DateTime startDate,
            DateTime endDate);
    }
}
