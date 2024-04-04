using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.ContentManagement.Repositories;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ProgressTrackingSubCategoryMutationExtension
    {
        public bool BulkUpdateProgressTrackingSubCategoryImages(
            [Service] ContentManagementRepository contentRepo,
            int contentId,
            int contentTypeId,
            Guid localeId,
            string imageUrl
            )
        {
            if (contentId == 0)
            {
                return false;
            }
            
            var languages = contentRepo.GetAllLanguagesForContentId(contentId, contentTypeId);

            foreach (var id in languages)
            {
                if (id != localeId)
                {
                    Dictionary<string, object> connectDict = new Dictionary<string, object>
                    {
                        { "imageUrl", imageUrl },
                    };
                    contentRepo.Update(contentId, id, connectDict);
                }
            }

            return true;
        }

        public bool UpdateSubCategorySkills(
            [Service] ContentManagementRepository contentRepo,
            List<ProgressSubCategoryModel> subCategories,
            Guid localeId
            )
        {
            foreach (var subCat in subCategories)
            {
                var skillIds = new List<string>();

                foreach (var skill in subCat.Skills)
                {
                    if (skill.Id == "")
                    {
                        Dictionary<string, object> skillDict = new Dictionary<string, object>
                        {
                            { "level", skill.Level.ToString() },
                            { "name", skill.Name }
                        };
                        // insert skill
                        skill.Id = contentRepo.Create(skill.ContentTypeId, localeId, skillDict).ToString();
                    } else
                    {
                        Dictionary<string, object> skillDict = new Dictionary<string, object>
                        {
                            { "level", skill.Level.ToString() },
                            { "name", skill.Name }
                        };
                        // update skill
                        contentRepo.Update(int.Parse(skill.Id), localeId, skillDict);
                    }

                    skillIds.Add(skill.Id);

                }
                Dictionary<string, object> subCatDict = new Dictionary<string, object>
                {
                    { "skills", string.Join(",", skillIds) }
                };

                //update sub cat with skill ids
                contentRepo.Update(subCat.SubCatId, localeId, subCatDict);
            }
            

            return true;
        }
    }
}
