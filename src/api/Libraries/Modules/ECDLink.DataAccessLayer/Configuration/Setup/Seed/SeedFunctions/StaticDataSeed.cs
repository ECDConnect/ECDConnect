using ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.AuditLog;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Notes;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedFunctions
{
    public class StaticDataSeed
    {

        public StaticDataSeed(IServiceProvider serviceProvider)
        {
            SeedAttendingReasons<ProgrammeAttendanceReason>(serviceProvider);
            SeedGender<Gender>(serviceProvider);
            SeedRace<Race>(serviceProvider);
            SeedLanguage<Language>(serviceProvider);
            SeedProvinces<Province>(serviceProvider);
            SeedEducation<Education>(serviceProvider);
            SeedGrant<Grant>(serviceProvider);
            SeedRelation<Relation>(serviceProvider);
            SeedProgrammeType<ProgrammeType>(serviceProvider);
            SeedNoteType<NoteType>(serviceProvider);
            SeedReasonForLeaving<ReasonForLeaving>(serviceProvider);
            SeedAuditLogType<AuditLogType>(serviceProvider);
            SeedSystemSettings<SystemSetting>(serviceProvider);
            SeedReasonForPractitionerLeaving<ReasonForPractitionerLeaving>(serviceProvider);
        }

        private void SeedNoteType<T>(IServiceProvider serviceProvider)
           where T : NoteType, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var items = NoteTypeSeed<T>.GetNoteTypes();

            foreach (var item in items)
            {
                repo.Insert(item);
            }
        }

        private void SeedReasonForLeaving<T>(IServiceProvider serviceProvider)
          where T : ReasonForLeaving, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var reasons = ReasonsForLeavingSeed<T>.GetReasonForLeavingSeed();

            foreach (var reason in reasons)
            {
                repo.Insert(reason);
            }
        }

        private void SeedGender<T>(IServiceProvider serviceProvider)
          where T : Gender, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var genders = GenderSeed<T>.GetGenderSeed();

            foreach (var gender in genders)
            {
                repo.Insert(gender);
            }
        }

        private void SeedRace<T>(IServiceProvider serviceProvider)
          where T : Race, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var races = RaceSeed<T>.GetRaceSeed();

            foreach (var race in races)
            {
                repo.Insert(race);
            }
        }

        private void SeedLanguage<T>(IServiceProvider serviceProvider)
          where T : Language, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var languages = LanguageSeed<T>.GetLanguageSeed();

            foreach (var language in languages)
            {
                repo.Insert(language);
            }
        }

        private void SeedProvinces<T>(IServiceProvider serviceProvider)
          where T : Province, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var provinces = ProvincesSeed<T>.GetProvinceSeed();

            foreach (var province in provinces)
            {
                repo.Insert(province);
            }
        }

        private void SeedEducation<T>(IServiceProvider serviceProvider)
          where T : Education, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var dataset = EducationSeed<T>.GetEducationSeed();

            foreach (var data in dataset)
            {
                repo.Insert(data);
            }
        }

        private void SeedGrant<T>(IServiceProvider serviceProvider)
          where T : Grant, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var dataset = GrantSeed<T>.GetGrantSeed();

            foreach (var data in dataset)
            {
                repo.Insert(data);
            }
        }

        private void SeedAttendingReasons<T>(IServiceProvider serviceProvider)
          where T : ProgrammeAttendanceReason, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var dataset = AttendenceReasonSeed<T>.GetAttendenceReasons();

            foreach (var data in dataset)
            {
                repo.Insert(data);
            }
        }

        private void SeedRelation<T>(IServiceProvider serviceProvider)
          where T : Relation, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var dataset = RelationSeed<T>.GetSeed();

            foreach (var data in dataset)
            {
                repo.Insert(data);
            }
        }

        private void SeedProgrammeType<T>(IServiceProvider serviceProvider)
          where T : ProgrammeType, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var dataset = ProgrammeTypeSeed<T>.GetSeed();

            foreach (var data in dataset)
            {
                repo.Insert(data);
            }
        }

        private void SeedAuditLogType<T>(IServiceProvider serviceProvider)
          where T : AuditLogType, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var dataset = AuditLogTypeSeed<T>.GetSeed();

            foreach (var data in dataset)
            {
                repo.Insert(data);
            }
        }

        private void SeedSystemSettings<T>(IServiceProvider serviceProvider)
          where T : SystemSetting, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var settings = SystemSettingsSeed<T>.GetSeed();

            foreach (var setting in settings)
            {
                repo.Insert(setting);
            
            }
        }

        private void SeedReasonForPractitionerLeaving<T>(IServiceProvider serviceProvider)
          where T : ReasonForPractitionerLeaving, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var reasons = ReasonsForPractitionerLeavingSeed<T>.GetReasonForPractitionerLeavingSeed();

            foreach (var reason in reasons)
            {
                repo.Insert(reason);
            }
        }
    }
}
