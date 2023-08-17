using ECDLink.DataAccessLayer.Entities;
using System;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.Services.Interfaces;

public interface ISchedulerService
{
    Task<DateTime> GetLastRunTime(string task);
    Task<ServiceScheduler> GetTaskResults(string task);
}
