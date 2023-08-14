using ECDLink.AutomatedJobs.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.Services;

public class SchedulerService : ISchedulerService
{
    private IHttpContextAccessor _contextAccessor;
    private IGenericRepositoryFactory _repositoryFactory;        
    private IGenericRepository<ServiceScheduler, Guid> _schedulerRepo;
    private readonly HierarchyEngine _hierarchyEngine;
    private string _applicationUserId;
    private string _uId;

    public SchedulerService(
        IHttpContextAccessor contextAccessor,
         IGenericRepositoryFactory repositoryFactory, HierarchyEngine hierarchyEngine)
    {
        _contextAccessor = contextAccessor;
        _repositoryFactory = repositoryFactory;
        _hierarchyEngine = hierarchyEngine;
        _uId = _hierarchyEngine.GetAdminUserId();//_contextAccessor.HttpContext.GetUser().Id; //must map this as administrator
        _applicationUserId = _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : null;
        _schedulerRepo = _repositoryFactory.CreateGenericRepository<ServiceScheduler>(userContext: _uId);
    }

    public async Task<DateTime> GetLastRunTime(string task)
    {
        var scheduledTask = await GetTaskResults(task);

        return scheduledTask.EndTime;
    }

    public async Task<ServiceScheduler> GetTaskResults(string task)
    {
        var schedulerTask = _schedulerRepo.GetAll().Where(x => x.Name == task).FirstOrDefault();

        return schedulerTask;
    }

}

