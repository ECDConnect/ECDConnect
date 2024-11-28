using EcdLink.Api.CoreApi.Services;
using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.Services;
using ECDLink.ContentManagement.Repositories;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class PortalCMSQueryTypeExtension
    {
        public PortalCMSQueryTypeExtension()
        {
        }
        private class Category
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string ImageUrl { get; set; }
            public string Color { get; set; }
            public int[] SubCategoryIds { get; set; }
            public List<SubCategory> SubCategories { get; set; }
        }

        private class SubCategory
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string ImageUrl { get; set; }
            public int[] SkillIds { get; set; }
            public List<Skill> Skills { get; set; }
        }
        private class Skill
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public Category Category { get; set; }
            public SubCategory SubCateogry { get; set; }
        }


        // To be deleted after testing
        public async Task<FileModel> GetCMSCategoryData([Service] IFileGenerationService fileService, 
                                                        [Service] ContentManagementRepository _contentRepo,
                                                        IGenericRepositoryFactory repoFactory)
        {
            var languageRepo = repoFactory.CreateRepository<Language>();
            var languages = languageRepo.GetAll().ToList();

            var templateHeaderSheet = $"CMS Category Data";
            var templateHeaders = new List<List<string>>()
            {
                new List<string>
                {
                    "Category",
                    "Sub-Category",
                    "Skills",
                }
            };

            var spreadSheets = new Dictionary<string, List<List<string>>>() {
                { templateHeaderSheet, templateHeaders }
            };

            foreach (var language in languages)
            {
                var categoryData = FetchCategoryData(language.Id, _contentRepo);

                if (categoryData.Count > 0)
                {
                    foreach (var cat in categoryData)
                    {
                        foreach (var subCat in cat.SubCategories)
                        {
                            foreach (var skill in subCat.Skills)
                            {
                                templateHeaders.Add(
                                    new List<string>
                                    {
                                        language.Description,
                                        cat.Id.ToString(),
                                        cat.Name,
                                        subCat.Id.ToString(),
                                        subCat.Name,
                                        skill.Id.ToString(),
                                        skill.Name
                                    });
                            }
                        }

                    }
                }
            }

            


            var fileName = templateHeaderSheet.Replace(" ", "_");
            return await fileService.DictionaryToExcelTemplate(spreadSheets, fileName);
        }


        private List<Category> FetchCategoryData(Guid languageId, [Service] ContentManagementRepository _contentRepo)
        {
            var skillMap = new Dictionary<int, Skill>();
            var categories = new List<Category>();
            var cats = _contentRepo.GetAll((int)ProgressContentTypeEnum.Category, languageId).ToList<dynamic>();
            foreach (var cat in cats)
            {
                var item = (IDictionary<string, object>)cat;
                item.TryGetValue("id", out var id);
                item.TryGetValue("name", out var name);
                item.TryGetValue("imageUrl", out var imageUrl);
                item.TryGetValue("color", out var color);
                item.TryGetValue("subCategories", out var subCategories);

                if (name == null)
                {
                    name = "No name for language";
                }
                if (imageUrl == null)
                {
                    imageUrl = "No imageUrl for language";
                }
                if (color == null)
                {
                    color = "No color for language";
                }
                if (subCategories == null)
                {
                    subCategories = "0";
                }


                var category = new Category()
                {
                    Id = int.Parse(id.ToString()),
                    Name = name.ToString(),
                    ImageUrl = imageUrl.ToString(),
                    Color = color.ToString(),
                    SubCategoryIds = (subCategories as string).Split(",").Select(i => int.Parse(i)).ToArray()
                };
                category.SubCategories = GetSubCategories(category, languageId, _contentRepo, skillMap);
                categories.Add(category);
            }
            return categories;
        }

        private List<SubCategory> GetSubCategories(Category category, Guid languageId, [Service] ContentManagementRepository _contentRepo, Dictionary<int, Skill> skillMap)
        {
            var subCategories = new List<SubCategory>();
            var subCats = _contentRepo.GetByIds(5, languageId, category.SubCategoryIds).ToList<dynamic>();
            foreach (var subCat in subCats)
            {

                var item = (IDictionary<string, object>)subCat;
                item.TryGetValue("id", out var id);
                item.TryGetValue("name", out var name);
                item.TryGetValue("imageUrl", out var imageUrl);
                item.TryGetValue("skills", out var skills);

                if (name == null)
                {
                    name = "No name for language";
                }
                if (imageUrl == null)
                {
                    imageUrl = "No imageUrl for language";
                }
                if (skills == null)
                {
                    skills = "0";
                }

                var subCategory = new SubCategory()
                {
                    Id = int.Parse(id.ToString()),
                    Name = name.ToString(),
                    ImageUrl = imageUrl.ToString(),
                    SkillIds = (skills as string).Split(",").Select(i => int.Parse(i)).ToArray()
                };
                subCategory.Skills = GetSkills(category, subCategory, languageId, _contentRepo, skillMap);
                subCategories.Add(subCategory);
            }
            return subCategories;
        }

        private List<Skill> GetSkills(Category category, SubCategory subCategory, Guid languageId, [Service] ContentManagementRepository _contentRepo, Dictionary<int, Skill> skillMap)
        {
            var data = _contentRepo.GetByIds(7, languageId, subCategory.SkillIds).ToList<dynamic>();
            var list = new List<Skill>();

            foreach (var skill in data)
            {
                var item = (IDictionary<string, object>)skill;
                item.TryGetValue("id", out var id);
                item.TryGetValue("name", out var name);

                if (name == null)
                {
                    name = "No name for language";
                }
                list.Add(new Skill
                {
                    Id = int.Parse(id.ToString()),
                    Name = name.ToString(),
                    Category = category,
                    SubCateogry = subCategory
                });
            }
            list.ForEach(s => skillMap.Add(s.Id, s));
            return list;
        }


    }
}
