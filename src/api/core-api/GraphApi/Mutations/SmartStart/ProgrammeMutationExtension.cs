using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ProgrammeMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public bool UpdateProgrammes([Service] IHttpContextAccessor contextAccessor,
         [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
         IGenericRepositoryFactory repoFactory,
         ProgrammeModel programmeInput)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Programme>(userContext: uId);
            var dbRepoDaily = repoFactory.CreateGenericRepository<DailyProgramme>(userContext: uId);

            if (programmeInput != null)
            {
                var programmeExists = dbRepo.Exists(programmeInput.Id);

                if (programmeExists)
                {
                    Programme programme = dbRepo.GetById(programmeInput.Id);
                    programme.ClassroomId = programmeInput.ClassroomId;
                    programme.ClassroomGroupId = programmeInput.ClassroomGroupId;
                    programme.Name = programmeInput.Name;
                    programme.StartDate = programmeInput.StartDate;
                    programme.EndDate = programmeInput.EndDate;
                    programme.PreferredLanguage = programmeInput.PreferredLanguage;
                    programme.IsActive = programmeInput.IsActive;
                    dbRepo.Update(programme);

                    var currentDailyProgrammes = programme.DailyProgrammes;
                    List<Guid> dailyProgramesChanged = new List<Guid>();

                    foreach (var dailyProgrammeElement in programmeInput.dailyProgrammes)
                    {
                        var dailyProgrammeExists = dbRepoDaily.Exists(dailyProgrammeElement.Id);

                        if (dailyProgrammeExists)
                        {
                            DailyProgramme dailyProgramme = dbRepoDaily.GetById(dailyProgrammeElement.Id);

                            dailyProgramme.ProgrammeId = dailyProgrammeElement.ProgrammeId;
                            dailyProgramme.Day = dailyProgrammeElement.Day;
                            dailyProgramme.DayDate = dailyProgrammeElement.DayDate;
                            dailyProgramme.MessageBoardText = dailyProgrammeElement.MessageBoardText;
                            dailyProgramme.SmallGroupActivityId = dailyProgrammeElement.SmallGroupActivityId;
                            dailyProgramme.LargeGroupActivityId = dailyProgrammeElement.LargeGroupActivityId;
                            dailyProgramme.StoryBookId = dailyProgrammeElement.StoryBookId;
                            dailyProgramme.StoryActivityId = dailyProgrammeElement.StoryActivityId;
                            dailyProgramme.IsActive = dailyProgrammeElement.IsActive;

                            dbRepoDaily.Update(dailyProgramme);
                            dailyProgramesChanged.Add(dailyProgrammeElement.Id);
                        }
                        else
                        {
                            DailyProgramme dailyProgramme = new DailyProgramme
                            {
                                Id = dailyProgrammeElement.Id,
                                ProgrammeId = dailyProgrammeElement.ProgrammeId,
                                Day = dailyProgrammeElement.Day,
                                DayDate = dailyProgrammeElement.DayDate,
                                MessageBoardText = dailyProgrammeElement.MessageBoardText,
                                SmallGroupActivityId = dailyProgrammeElement.SmallGroupActivityId,
                                LargeGroupActivityId = dailyProgrammeElement.LargeGroupActivityId,
                                StoryBookId = dailyProgrammeElement.StoryBookId,
                                StoryActivityId = dailyProgrammeElement.StoryActivityId,
                                IsActive = dailyProgrammeElement.IsActive
                            };

                            dbRepoDaily.Insert(dailyProgramme);
                        }
                        
                    }
                    foreach (var currentDailyProgrammeElement in currentDailyProgrammes)
                    {
                        bool containsItem = dailyProgramesChanged.Any(item => item == currentDailyProgrammeElement.Id);
                        if (containsItem == false)
                        {
                            DailyProgramme dailyProgramme = dbRepoDaily.GetById(currentDailyProgrammeElement.Id);
                            if (dailyProgramme != null)
                            {
                                dailyProgramme.IsActive = false;
                                dbRepoDaily.Update(dailyProgramme);
                            }
                        }
                    }
                }
                else
                {
                    Programme programme = new Programme
                    {
                        Id = programmeInput.Id,
                        ClassroomId = programmeInput.ClassroomId,
                        ClassroomGroupId = programmeInput.ClassroomGroupId,
                        Name = programmeInput.Name,
                        StartDate = programmeInput.StartDate,
                        EndDate = programmeInput.EndDate,
                        PreferredLanguage = programmeInput.PreferredLanguage,
                        IsActive = programmeInput.IsActive
                    };
                    dbRepo.Insert(programme);

                    foreach (var dailyProgrammeElement in programmeInput.dailyProgrammes)
                    {
                        DailyProgramme dailyProgramme = new DailyProgramme
                        {
                            Id = dailyProgrammeElement.Id,
                            ProgrammeId = dailyProgrammeElement.ProgrammeId,
                            Day = dailyProgrammeElement.Day,
                            DayDate = dailyProgrammeElement.DayDate,
                            MessageBoardText = dailyProgrammeElement.MessageBoardText,
                            SmallGroupActivityId = dailyProgrammeElement.SmallGroupActivityId,
                            LargeGroupActivityId = dailyProgrammeElement.LargeGroupActivityId,
                            StoryBookId = dailyProgrammeElement.StoryBookId,
                            StoryActivityId = dailyProgrammeElement.StoryActivityId,
                            IsActive = dailyProgrammeElement.IsActive
                        };

                        dbRepoDaily.Insert(dailyProgramme);
                    }
                }
                                  
                return true;
            }
            return false;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Programme UpdateProgramme([Service] IHttpContextAccessor contextAccessor,
          [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
          IGenericRepositoryFactory repoFactory,
          Guid? id,
          Programme input)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Programme>(userContext: uId);
            
            var programmeExists = dbRepo.Exists(input.Id);

            if (programmeExists)
            {
                Programme programme = dbRepo.GetById(input.Id);
                programme.ClassroomId = input.ClassroomId;
                programme.ClassroomGroupId = input.ClassroomGroupId;
                programme.Name = input.Name;
                programme.StartDate = input.StartDate;
                programme.EndDate = input.EndDate;
                programme.PreferredLanguage = input.PreferredLanguage;
                programme.IsActive = input.IsActive;
                return dbRepo.Update(programme);
            }
            else
            {
                Programme programme = new Programme
                {
                    Id = input.Id,
                    ClassroomId = input.ClassroomId,
                    ClassroomGroupId = input.ClassroomGroupId,
                    Name = input.Name,
                    StartDate = input.StartDate,
                    EndDate = input.EndDate,
                    PreferredLanguage = input.PreferredLanguage,
                    IsActive = input.IsActive
                };
                return dbRepo.Insert(programme);
            }
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public DailyProgramme UpdateDailyProgramme([Service] IHttpContextAccessor contextAccessor,
             [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
             IGenericRepositoryFactory repoFactory,
             Guid? id,
             DailyProgramme input)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<DailyProgramme>(userContext: uId);

            var programmeExists = dbRepo.Exists(input.Id);

            if (programmeExists)
            {
                DailyProgramme dailyProgramme = dbRepo.GetById(input.Id);
                dailyProgramme.ProgrammeId = input.ProgrammeId;
                dailyProgramme.Day = input.Day;
                dailyProgramme.DayDate = input.DayDate;
                dailyProgramme.MessageBoardText = input.MessageBoardText;
                dailyProgramme.SmallGroupActivityId = input.SmallGroupActivityId;
                dailyProgramme.LargeGroupActivityId = input.LargeGroupActivityId;
                dailyProgramme.StoryBookId = input.StoryBookId;
                dailyProgramme.StoryActivityId = input.StoryActivityId;
                dailyProgramme.IsActive = input.IsActive;

                return dbRepo.Update(dailyProgramme);
            }
            else
            {
                DailyProgramme dailyProgramme = new DailyProgramme
                {
                    Id = input.Id,
                    ProgrammeId = input.ProgrammeId,
                    Day = input.Day,
                    DayDate = input.DayDate,
                    MessageBoardText = input.MessageBoardText,
                    SmallGroupActivityId = input.SmallGroupActivityId,
                    LargeGroupActivityId = input.LargeGroupActivityId,
                    StoryBookId = input.StoryBookId,
                    StoryActivityId = input.StoryActivityId,
                    IsActive = input.IsActive
                };

                return dbRepo.Insert(dailyProgramme);
            }
          
        }
    }
}
