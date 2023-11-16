using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.TestSeedData
{
    public static class TestSeedId
    {
        public static Guid ClassroomId = Guid.NewGuid();
        public static Guid SiteAddressId = Guid.NewGuid();

        public static Guid ClassgroupOne = Guid.NewGuid();
        public static Guid ClassgroupTwo = Guid.NewGuid();

        public static Guid ProgrammeOne = Guid.NewGuid();
        public static Guid ProgrammeTwo = Guid.NewGuid();
        public static Guid ProgrammeThree = Guid.NewGuid();
    }

    public class ChildrenTest
    {
        public Guid ClassroomGroupId { get; set; }
        public ApplicationUser User { get; set; }
    }

    public class TestSeed
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private Guid _userId;
        private Guid _practitionerId;

        public TestSeed(IServiceProvider serviceProvider)
        {
            /*
            _repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>();

            var user = userManager.Users.FirstOrDefault();
            Guid coachId = Guid.NewGuid();
            _userId = user.Id;

            var siteAddressId = SeedSiteAddress();
            try
            {
                coachId = AddFranchisorCoach(userManager);
            }
            catch (Exception e) { }

            try
            {

                AddPractitioners(userManager, siteAddressId, coachId.ToString());
            }
            catch (Exception e) { }

            try
            {
                SeedClassProgrammes();
                SeedAttendance(serviceProvider, _practitionerId);
            }
            catch (Exception e) { }

            try
            {
                SeedChildren(serviceProvider);
            }
            catch (Exception e) { }

            try
            {
                SeedChildAttendance(serviceProvider);
            }
            catch (Exception e) { }
            */
        }

        /*
        private Guid AddFranchisorCoach(UserManager<ApplicationUser> userManager)
        {
            var fraRepo = _repositoryFactory.CreateRepository<Franchisor>(userContext: _userId);
            var coaRepo = _repositoryFactory.CreateRepository<Coach>(userContext: _userId);

            var pUserFranchisor = new ApplicationUser
            {
                FirstName = "TestFranchisor",
                Surname = "TestFranchisorSurname",
                Email = "test@testfranchisor.com",
                UserName = "00000054654111",
                ContactPreference = MessageTypeConstants.SMS,
                IdNumber = "00000054654111",
                PhoneNumber = "06148808",
                IsActive = true,
            };

            userManager.CreateAsync(pUserFranchisor);
            var franchisorId = pUserFranchisor.Id;

            userManager.AddPasswordAsync(pUserFranchisor, "Hello123!");

            fraRepo.Insert(new Franchisor
            {
                Id = Guid.NewGuid(),
                UserId = new Guid(_practitionerId),
                AreaOfOperation = "Office"
            });

            var pUserCoach = new ApplicationUser
            {
                FirstName = "TestCoach",
                Surname = "TestCoachSurname",
                Email = "test@testcoachr.com",
                UserName = "00000022111",
                ContactPreference = MessageTypeConstants.SMS,
                IdNumber = "00000022111",
                PhoneNumber = "0614887314",
                IsActive = true
            };

            userManager.CreateAsync(pUserCoach);
            var coachId = pUserCoach.Id;

            userManager.AddPasswordAsync(pUserCoach, "Hello123!");

            coaRepo.Insert(new Coach
            {
                Id = Guid.NewGuid(),
                UserId = new Guid(pUserCoach.Id),
                AreaOfOperation = "Office",
                FranchisorId = Guid.Parse(franchisorId)
            });

            return Guid.Parse(coachId);
        }

        private void AddPractitioners(UserManager<ApplicationUser> userManager, Guid siteAddressId, string coachId)
        {
            var pracRepo = _repositoryFactory.CreateRepository<Practitioner>(userContext: _userId);

            var pUserOne = new ApplicationUser
            {
                FirstName = "TestPractitioner",
                Surname = "TestPracitionerSurname",
                Email = "test@test.com",
                UserName = "0000000000022111",
                ContactPreference = MessageTypeConstants.SMS,
                IdNumber = "0000000000022111",
                PhoneNumber = "0614887313",
                IsActive = true
            };

            userManager.CreateAsync(pUserOne);
            _practitionerId = pUserOne.Id;

            userManager.AddPasswordAsync(pUserOne, "Hello123!");

            pracRepo.Insert(new Practitioner
            {
                MaxChildren = 4,
                Id = Guid.NewGuid(),
                UserId = new Guid(_practitionerId),
                SiteAddressId = siteAddressId,
                IsPrincipal = true,
                IsFundaAppAdmin = false,
                IsTrainee = false,
                IsRegistered = false,
                CoachHierarchy = Guid.Parse(coachId)
            });

            var pUser2 = new ApplicationUser
            {
                FirstName = "TestPractitioner2",
                Surname = "TestPracitionerSurname2",
                Email = "test@test.com",
                UserName = "00000022111",
                ContactPreference = MessageTypeConstants.SMS,
                IdNumber = "00000022111",
                PhoneNumber = "0614887313",
                IsActive = true
            };

            userManager.CreateAsync(pUser2);
            userManager.AddPasswordAsync(pUser2, "Hello123!");

            pracRepo.Insert(new Practitioner
            {
                MaxChildren = 4,
                Id = Guid.NewGuid(),
                UserId = new Guid(pUser2.Id),
                SiteAddressId = siteAddressId,
                PrincipalHierarchy = Guid.Parse(pUser2.Id),
                IsPrincipal = false,
                IsFundaAppAdmin = false,
                IsTrainee = false,
                IsRegistered = false,
                CoachHierarchy = Guid.Parse(coachId)
            });
        }

        private void SeedChildAttendance(IServiceProvider serviceProvider)
        {
            var repo = _repositoryFactory.CreateRepository<Child>();
            repo.SetUserContext(_practitionerId);

            var child = repo.GetAll().FirstOrDefault();

            SeedAttendance(serviceProvider, child.UserId.ToString());
        }
        private void SeedChildren(IServiceProvider serviceProvider)
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<WorkflowStatus>();
            var workflowStatuses = repo.GetAll();
            var statusId = workflowStatuses.Where(x => x.EnumId == WorkflowStatusEnum.ChildPending).Select(x => x.Id).FirstOrDefault();

            var childrenUsers = new List<ChildrenTest>();

            childrenUsers.Add(new ChildrenTest
            {
                ClassroomGroupId = TestSeedId.ClassgroupOne,
                User = new ApplicationUser
                {
                    FirstName = "Hope",
                    Surname = "Mokoena",
                    UserName = Guid.NewGuid().ToString(),
                    IsActive = true,
                    IsSouthAfricanCitizen = true,
                    VerifiedByHomeAffairs = false,
                    DateOfBirth = new DateTime(2019, 5, 25)
                }
            });

            childrenUsers.Add(new ChildrenTest
            {
                ClassroomGroupId = TestSeedId.ClassgroupOne,
                User = new ApplicationUser
                {
                    FirstName = "Lethabo",
                    Surname = "Nkosi",
                    UserName = Guid.NewGuid().ToString(),
                    IsActive = true,
                    IsSouthAfricanCitizen = true,
                    VerifiedByHomeAffairs = false,
                    IdNumber = "190615",
                    DateOfBirth = new DateTime(2018, 6, 25)
                }
            });

            childrenUsers.Add(new ChildrenTest
            {
                ClassroomGroupId = TestSeedId.ClassgroupOne,
                User = new ApplicationUser
                {
                    FirstName = "Themba",
                    Surname = "Sibiya",
                    UserName = Guid.NewGuid().ToString(),
                    IsActive = true,
                    IsSouthAfricanCitizen = true,
                    VerifiedByHomeAffairs = false,
                    IdNumber = "190615",
                    DateOfBirth = new DateTime(2017, 7, 25)
                }
            });

            childrenUsers.Add(new ChildrenTest
            {
                ClassroomGroupId = TestSeedId.ClassgroupOne,
                User = new ApplicationUser
                {
                    FirstName = "Thandile",
                    Surname = "Dlamini",
                    UserName = Guid.NewGuid().ToString(),
                    IsActive = true,
                    IsSouthAfricanCitizen = true,
                    VerifiedByHomeAffairs = false,
                    IdNumber = "190615",
                    DateOfBirth = new DateTime(2020, 1, 25)
                }
            });

            childrenUsers.Add(new ChildrenTest
            {
                ClassroomGroupId = TestSeedId.ClassgroupTwo,
                User = new ApplicationUser
                {
                    FirstName = "Amahle",
                    Surname = "Khumalo",
                    UserName = Guid.NewGuid().ToString(),
                    IsActive = true,
                    IsSouthAfricanCitizen = true,
                    VerifiedByHomeAffairs = false,
                    IdNumber = "190615",
                    DateOfBirth = new DateTime(2019, 1, 25)
                }
            });

            childrenUsers.Add(new ChildrenTest
            {
                ClassroomGroupId = TestSeedId.ClassgroupTwo,
                User = new ApplicationUser
                {
                    FirstName = "Monwabisi",
                    Surname = "Dasie",
                    UserName = Guid.NewGuid().ToString(),
                    IsActive = true,
                    IsSouthAfricanCitizen = true,
                    VerifiedByHomeAffairs = false,
                    IdNumber = "190615",
                    DateOfBirth = new DateTime(2015, 8, 25)
                }
            });

            foreach (var child in childrenUsers)
            {
                SeedChild(child.User, child.ClassroomGroupId, statusId, serviceProvider);
            }
        }

        private void SeedChild(ApplicationUser user, Guid classroomGroupId, Guid statusId, IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>();
            userManager.CreateAsync(user);
            var currentChild = userManager.FindByIdAsync(user.Id).Result;

            userManager.AddToRoleAsync(currentChild, "Child");

            var repo = _repositoryFactory.CreateRepository<Child>();
            repo.SetUserContext(_practitionerId);

            var newChild = repo.Insert(new Child
            {
                UserId = new Guid(user.Id),
                Allergies = "None",
                LanguageId = LanguageSeedConstants.English,
                InsertedDate = DateTime.Now,
                WorkflowStatusId = statusId
            });

            var learnerRepo = _repositoryFactory.CreateRepository<Learner>();
            learnerRepo.SetUserContext(_practitionerId);

            learnerRepo.Insert(new Learner
            {
                ProgrammeAttendanceReasonId = AttendenceReasonSeedConstants.GradeRGuid,
                ClassroomGroupId = classroomGroupId,
                UserId = newChild.UserId,
                StartedAttendance = DateTime.Parse("April 7, 2021")
            });
        }

        private void SeedAttendance(IServiceProvider serviceProvider, string userId)
        {
            var dbFactory = serviceProvider.GetService<IDbContextFactory<AuthenticationDbContext>>();

            using var context = dbFactory.CreateDbContext();
            context.Attendances.AsNoTracking();

            foreach (var day in MonthDays(12, 6, 2021))
            {
                context.Attendances.Add(new Attendance
                {
                    ClassroomProgrammeId = TestSeedId.ProgrammeOne,
                    ParentRecordId = _practitionerId,
                    UserId = new Guid(userId),
                    WeekOfYear = day.GetWeekOfYear(),
                    MonthOfYear = day.Month,
                    AttendanceDate = day,
                    Year = day.Year,
                    Attended = true
                });

                context.SaveChanges();
            }

            foreach (var day in MonthDays(7, 6, 2021))
            {
                context.Attendances.Add(new Attendance
                {
                    ClassroomProgrammeId = TestSeedId.ProgrammeTwo,
                    ParentRecordId = _practitionerId,
                    UserId = new Guid(userId),
                    WeekOfYear = day.GetWeekOfYear(),
                    MonthOfYear = day.Month,
                    AttendanceDate = day,
                    Year = day.Year,
                    Attended = true
                });

                context.SaveChanges();
            }

            foreach (var day in MonthDays(9, 6, 2021))
            {
                context.Attendances.Add(new Attendance
                {
                    ClassroomProgrammeId = TestSeedId.ProgrammeThree,
                    ParentRecordId = _practitionerId,
                    UserId = new Guid(userId),
                    WeekOfYear = day.GetWeekOfYear(),
                    MonthOfYear = day.Month,
                    AttendanceDate = day,
                    Year = day.Year,
                    Attended = true
                });

                context.SaveChanges();
            }

            foreach (var day in MonthDays(3, 7, 2021))
            {
                context.Attendances.Add(new Attendance
                {
                    ClassroomProgrammeId = TestSeedId.ProgrammeOne,
                    ParentRecordId = _practitionerId,
                    UserId = new Guid(userId),
                    WeekOfYear = day.GetWeekOfYear(),
                    MonthOfYear = day.Month,
                    AttendanceDate = day,
                    Year = day.Year,
                    Attended = true
                });

                context.SaveChanges();
            }

            foreach (var day in MonthDays(5, 7, 2021))
            {
                context.Attendances.Add(new Attendance
                {
                    ClassroomProgrammeId = TestSeedId.ProgrammeTwo,
                    ParentRecordId = _practitionerId,
                    UserId = new Guid(userId),
                    WeekOfYear = day.GetWeekOfYear(),
                    MonthOfYear = day.Month,
                    AttendanceDate = day,
                    Year = day.Year,
                    Attended = true
                });

                context.SaveChanges();
            }

            foreach (var day in MonthDays(7, 7, 2021))
            {
                context.Attendances.Add(new Attendance
                {
                    ClassroomProgrammeId = TestSeedId.ProgrammeThree,
                    ParentRecordId = _practitionerId,
                    UserId = new Guid(userId),
                    WeekOfYear = day.GetWeekOfYear(),
                    MonthOfYear = day.Month,
                    AttendanceDate = day,
                    Year = day.Year,
                    Attended = true
                });

                context.SaveChanges();
            }

            foreach (var day in MonthDays(7, 8, 2021))
            {
                context.Attendances.Add(new Attendance
                {
                    ClassroomProgrammeId = TestSeedId.ProgrammeOne,
                    ParentRecordId = _practitionerId,
                    UserId = new Guid(userId),
                    WeekOfYear = day.GetWeekOfYear(),
                    MonthOfYear = day.Month,
                    AttendanceDate = day,
                    Year = day.Year,
                    Attended = true
                });

                context.SaveChanges();
            }

            foreach (var day in MonthDays(2, 8, 2021))
            {
                context.Attendances.Add(new Attendance
                {
                    ClassroomProgrammeId = TestSeedId.ProgrammeTwo,
                    ParentRecordId = _practitionerId,
                    UserId = new Guid(userId),
                    WeekOfYear = day.GetWeekOfYear(),
                    MonthOfYear = day.Month,
                    AttendanceDate = day,
                    Year = day.Year,
                    Attended = true
                });

                context.SaveChanges();
            }

            foreach (var day in MonthDays(4, 8, 2021))
            {
                context.Attendances.Add(new Attendance
                {
                    ClassroomProgrammeId = TestSeedId.ProgrammeThree,
                    ParentRecordId = _practitionerId,
                    UserId = new Guid(userId),
                    WeekOfYear = day.GetWeekOfYear(),
                    MonthOfYear = day.Month,
                    AttendanceDate = day,
                    Year = day.Year,
                    Attended = true
                });

                context.SaveChanges();
            }
        }

        private IEnumerable<DateTime> MonthDays(int startDay, int month, int year)
        {
            var dayList = new List<DateTime>();

            var endOfMonth = new DateTime(year, month, startDay).GetEndOfMonth();

            for (DateTime dt = new DateTime(year, month, startDay); dt <= endOfMonth; dt = dt.AddDays(7))
            {
                dayList.Add(dt);
            }

            return dayList;
        }

        private void SeedClassProgrammes()
        {
            var classroomGroupRepo = _repositoryFactory.CreateRepository<ClassroomGroup>(userContext: _practitionerId);
            var repo = _repositoryFactory.CreateRepository<ClassProgramme>(userContext: _practitionerId);

            var name = "Little Lions";
            var classroomGroup = classroomGroupRepo.Insert(new ClassroomGroup
            {
                Id = TestSeedId.ClassgroupOne,
                ClassroomId = TestSeedId.ClassroomId,
                ProgrammeTypeId = ProgrammeTypeSeedConstants.Playgroup,
                Name = name,
                IsActive = true
            });

            var startDate = DateTime.Parse("April 7, 2021");

            repo.Insert(new ClassProgramme
            {
                Id = TestSeedId.ProgrammeOne,
                ClassroomGroupId = classroomGroup.Id,
                IsFullDay = true,
                MeetingDay = (int)DayOfWeek.Monday,
                ProgrammeStartDate = startDate,
                IsActive = true
            });

            repo.Insert(new ClassProgramme
            {
                Id = TestSeedId.ProgrammeTwo,
                ClassroomGroupId = classroomGroup.Id,
                IsFullDay = true,
                MeetingDay = (int)DayOfWeek.Wednesday,
                ProgrammeStartDate = startDate,
                IsActive = true
            });

            repo.Insert(new ClassProgramme
            {
                Id = TestSeedId.ProgrammeThree,
                ClassroomGroupId = classroomGroup.Id,
                IsFullDay = true,
                MeetingDay = (int)DayOfWeek.Friday,
                ProgrammeStartDate = startDate,
                IsActive = true
            });

            var secondName = "Little Angels";
            var secondClassroomGroup = classroomGroupRepo.Insert(new ClassroomGroup
            {
                Id = TestSeedId.ClassgroupTwo,
                ClassroomId = TestSeedId.ClassroomId,
                ProgrammeTypeId = ProgrammeTypeSeedConstants.Playgroup,
                Name = secondName,
                IsActive = true
            });

            repo.Insert(new ClassProgramme
            {
                ClassroomGroupId = secondClassroomGroup.Id,
                IsFullDay = true,
                MeetingDay = (int)DayOfWeek.Tuesday,
                ProgrammeStartDate = startDate,
            });

            repo.Insert(new ClassProgramme
            {
                ClassroomGroupId = secondClassroomGroup.Id,
                IsFullDay = true,
                MeetingDay = (int)DayOfWeek.Thursday,
                ProgrammeStartDate = startDate,
                IsActive = true
            });

        }

        private Guid SeedSiteAddress()
        {
            var repo = _repositoryFactory.CreateRepository<SiteAddress>();

            var siteAddress = repo.Insert(new SiteAddress
            {
                Id = TestSeedId.SiteAddressId,
                AddressLine1 = "Address Line 1",
                AddressLine2 = "Address Line 2",
                AddressLine3 = "Address Line 3",
                Name = "Test Classroom Address",
                PostalCode = "7441",
                ProvinceId = ProvincesSeedConstants.EasternCape,
                IsActive = true
            });

            return siteAddress.Id;
        }
        */
    }
}
