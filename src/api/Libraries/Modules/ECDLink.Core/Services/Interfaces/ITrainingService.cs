using ECDLink.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface ITrainingService
    {
        bool Enabled { get; }

        Task<bool> CreateUserAsync(ApplicationIdentityUser user);

        //Task<string> CreateUserSessionAsync(string userName);

        Task SyncCompletedCourses();

        Task<IEnumerable<object>> GetUserCompletedCourses(Guid userId);
    }
}
