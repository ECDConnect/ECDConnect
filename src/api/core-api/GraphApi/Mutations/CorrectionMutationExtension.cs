using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class CorrectionMutationExtension
    {

        #region Service Calls       

        public async Task<bool> CorrectDuplicateHierarchies([Service] IHttpContextAccessor contextAccessor, HierarchyEngine hierarchyEngine, IGenericRepositoryFactory repositoryFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var staticHierarchyRepo = repositoryFactory.CreateGenericRepository<UserHierarchyEntity>(userContext: uId);

            var pracRepo = repositoryFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var childRepo = repositoryFactory.CreateGenericRepository<Child>(userContext: uId);
            var coachRepo = repositoryFactory.CreateGenericRepository<Coach>(userContext: uId);
            /*
 |Id                                  |ParentId                            |UserId                              |UserType    |NamedTypePath                     |Hierarchy|Key  |IsActive|InsertedDate           |UpdatedDate            |UpdatedBy|TenantId                            |
|------------------------------------|------------------------------------|------------------------------------|------------|----------------------------------|---------|-----|--------|-----------------------|-----------------------|---------|------------------------------------|
|44cd6d36-b2f2-40d5-acff-b1c7c25b1aee|33558c4a-3707-422f-bb8b-d4f82a9257c8|d8dbb829-adf2-4c20-859a-3addae2b7dbf|Practitioner|System.Administrator.Practitioner.|0.1.1080.|1,080|true    |2022-11-02 10:19:46.130|2022-11-02 10:19:46.261|         |258a15e6-3736-45ea-875c-48d9377de4c8|
|00daa40a-820e-4a6c-a025-ab9d915613a1|33558c4a-3707-422f-bb8b-d4f82a9257c8|d8dbb829-adf2-4c20-859a-3addae2b7dbf|Practitioner|System.Administrator.Practitioner.|0.1.1081.|1,081|true    |2022-11-02 10:44:59.042|2022-11-02 10:44:59.088|         |258a15e6-3736-45ea-875c-48d9377de4c8|
|295fd983-3fe5-4438-9f0a-2cda461d5e00|33558c4a-3707-422f-bb8b-d4f82a9257c8|d8dbb829-adf2-4c20-859a-3addae2b7dbf|Practitioner|System.Administrator.Practitioner.|0.1.1082.|1,082|true    |2022-11-02 10:45:01.370|2022-11-02 10:45:01.411|         |258a15e6-3736-45ea-875c-48d9377de4c8|
|90b0bf4f-8234-4a21-977d-c3e0ea332365|33558c4a-3707-422f-bb8b-d4f82a9257c8|d8dbb829-adf2-4c20-859a-3addae2b7dbf|Practitioner|System.Administrator.Practitioner.|0.1.1128.|1,128|true    |2022-11-10 08:25:30.268|2022-11-10 08:25:30.345|         |258a15e6-3736-45ea-875c-48d9377de4c8|
            */

            //get all hierarchies and loop through all to determine duplicates
            List< UserHierarchyEntity> allHierarchies = staticHierarchyRepo.GetAll().Where(x => x.IsActive == true).ToList();

            List<UserHierarchyEntity> duplicatedChildHierarchies = new List<UserHierarchyEntity>();
            List<UserHierarchyEntity> duplicatedPracHierarchies = new List<UserHierarchyEntity>();
            List<UserHierarchyEntity> duplicatedCoachHierarchies = new List<UserHierarchyEntity>();

            foreach ( var hierarchy in allHierarchies )
            {
                if (!duplicatedChildHierarchies.Contains(hierarchy) && !duplicatedPracHierarchies.Contains(hierarchy) && !duplicatedCoachHierarchies.Contains(hierarchy))
                {
                    //check if another exists with teh same userId
                    var sameHierarchies = allHierarchies.Where(x => x.UserId == hierarchy.UserId).ToList();
                    if (sameHierarchies.Count > 1)
                    {
                        switch (sameHierarchies[0].UserType)
                        {
                            case "Child":
                                duplicatedChildHierarchies.AddRange(sameHierarchies);
                                break;
                            case "Practitioner":
                                duplicatedPracHierarchies.AddRange(sameHierarchies);
                                break;
                            case "Coach":
                                duplicatedCoachHierarchies.AddRange(sameHierarchies);
                                break;
                        }
                    }
                }
            }

            //now fix them
            //for children, determine the unused and delete - 
            List<string> allAffectedChildren = duplicatedChildHierarchies.Select(c => c.UserId.ToString()).Distinct().ToList();
            List<string> allAffectedPracs = duplicatedPracHierarchies.Select(c => c.UserId.ToString()).Distinct().ToList();
            List<string> allAffectedCoaches = duplicatedCoachHierarchies.Select(c => c.UserId.ToString()).Distinct().ToList();

            foreach (var child in allAffectedChildren)
            {
                var record = childRepo.GetByUserId(child);
                if (record != null)
                {
                    foreach (var hierarchy in duplicatedChildHierarchies.Where(x => x.UserId == Guid.Parse(child)))
                    {
                        if (hierarchy.Hierarchy != record.Hierarchy)
                        {
                            //do a few more checks before deleting the record

                            staticHierarchyRepo.Delete(hierarchy.Id);
                        }
                    }
                }
            }

            foreach (var prac in allAffectedPracs)
            {
                var record = pracRepo.GetByUserId(prac);
                if (record != null)
                {
                    foreach (var hierarchy in duplicatedPracHierarchies.Where(x => x.UserId == Guid.Parse(prac)))
                    {
                        if (hierarchy.Hierarchy != record.Hierarchy)
                        {
                            //do a few more checks before deleting the record

                            staticHierarchyRepo.Delete(hierarchy.Id);
                        }
                    }
                }
            }

            foreach (var prac in allAffectedCoaches)
            {
                var record = coachRepo.GetByUserId(prac);
                if (record != null)
                {
                    foreach (var hierarchy in duplicatedCoachHierarchies.Where(x => x.UserId == Guid.Parse(prac)))
                    {
                        if (hierarchy.Hierarchy != record.Hierarchy)
                        {
                            //do a few more checks before deleting the record

                            staticHierarchyRepo.Delete(hierarchy.Id);
                        }
                    }
                }
            }

            return true;
        }

        #endregion
    }
}
