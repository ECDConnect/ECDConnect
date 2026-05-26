using ECDLink.ContentManagement.Constants;
using ECDLink.ContentManagement.Entities;
using ECDLink.ContentManagement.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.ContentManagement.Repositories
{
    public class ThemeRepository
    {
        private const string StoryBook = "StoryBook";
        private const string SmallActivity = "SmallActivity";
        private const string LargeActivity = "LargeActivity";
        private const string StoryActivity = "StoryActivity";
        private readonly ContentManagementRepository _contentRepo;
        private ContentManagementDbContext _context;

        public class ContentItem
        {
            public string ContentId { get; set; }
            public string Value { get; set; }

            public ContentItem(ContentValue record)
            {
                ContentId = record.ContentId.ToString();
                Value = record.Value;
            }
        }

        public ThemeRepository(ContentManagementRepository contentRepo, ContentManagementDbContext context)
        {
            _contentRepo = contentRepo;
            _context = context;
        }

        public void CreateDefaultNatureTheme(Guid englishId, Guid oaTenantId, int oaContentId)
        {
            // first make sure all theme activities and story books exists for the tenant - use OA as primary source
            ValidateNatureThemeChildren(englishId, oaTenantId);

            // now we need to build the 20 days for the new theme
            var themeDayIds = CreateNatureThemeDays(englishId);

            // Get OA theme and add new one for tenant
            var animalNature = new ThemeModel(_contentRepo.GetById(oaContentId, englishId, oaTenantId), "DefaultNature");

            Dictionary<string, object> newDict = new Dictionary<string, object>
            {
                { "name", animalNature.Name},
                { "color", animalNature.Color },
                { "imageUrl", animalNature.ImageUrl },
                { "themeDays", themeDayIds },
                { "shareContent", animalNature.ShareContent },
                { "themeLogo", animalNature.ThemeLogo },
                { "defaultName", animalNature.DefaultName },
            };
            _contentRepo.Create(ContentTypeConstants.ThemeId, englishId, newDict);
            // Invalidate the validation cache so the next GetThemeRecords call sees the
            // newly created theme instead of the cached null and trying to create it again.
            _contentRepo.InvalidateValidateCache(ContentTypeConstants.ThemeId, englishId, "DefaultNature", TenantExecutionContext.Tenant.Id);
        }
        public void CreateDefaultAnimalTheme(Guid englishId, Guid oaTenantId, int oaContentId)
        {
            // first make sure all theme activities and story books exists for the tenant
            ValidateAnimalThemeChildren(englishId, oaTenantId);

            // now we need to build the 20 days for the new theme
            var themeDayIds = CreateAnimalThemeDays(englishId);

            // Get OA theme and add new one for tenant
            var animalTheme = new ThemeModel(_contentRepo.GetById(oaContentId, englishId, oaTenantId), "DefaultAnimal");

            Dictionary<string, object> newDict = new Dictionary<string, object>
            {
                { "name", animalTheme.Name},
                { "color", animalTheme.Color },
                { "imageUrl", animalTheme.ImageUrl },
                { "themeDays", themeDayIds },
                { "shareContent", animalTheme.ShareContent },
                { "themeLogo", animalTheme.ThemeLogo },
                { "defaultName", animalTheme.DefaultName },
            };
            _contentRepo.Create(ContentTypeConstants.ThemeId, englishId, newDict);
            _contentRepo.InvalidateValidateCache(ContentTypeConstants.ThemeId, englishId, "DefaultAnimal", TenantExecutionContext.Tenant.Id);
        }
        public string CreateNatureThemeDays(Guid englishId)
        {
            var smallActivities = GetNatureTheme(SmallActivity);
            var largeActivities = GetNatureTheme(LargeActivity);
            var storyActivities = GetNatureTheme(StoryActivity);
            var storyBooks = GetNatureTheme(StoryBook);

            var existingActivities = GetExistingActivities(englishId);
            var existingStoryBooks = GetExistingStoryBooks(englishId);

            // Determine max days based on smallest list length
            int dayCount = new[] { smallActivities.Count, largeActivities.Count, storyActivities.Count, storyBooks.Count }
                        .Min();
            dayCount = Math.Min(dayCount, 20); // Optional: Cap at 20

            var allThemeDays = _contentRepo.GetAll(ContentTypeConstants.ThemeDayId, englishId)
                                .Select(x => new ThemeDayModel(x)).Where(x => x.TenantId == TenantExecutionContext.Tenant.Id.ToString()).ToList();

            var themeDayContentIds = new List<string>();

            for (int i = 0; i < dayCount; i++)
            {
                var daySmall = existingActivities.FirstOrDefault(x => x.Value == smallActivities[i]);
                var dayLarge = existingActivities.FirstOrDefault(x => x.Value == largeActivities[i]);
                var dayStory = existingActivities.FirstOrDefault(x => x.Value == storyActivities[i]);
                var dayBook = existingStoryBooks.FirstOrDefault(x => x.Value == storyBooks[i]);

                var day = (i + 1).ToString();
                var name = $"Day {(i + 1)}";

                var itemExists = allThemeDays.FirstOrDefault(x => x.Day == day
                                                            && x.Name == name
                                                            && x.SmallGroupActivity == daySmall.ContentId
                                                            && x.LargeGroupActivity == dayLarge.ContentId
                                                            && x.StoryActivity == dayStory.ContentId
                                                            && x.StoryBook == dayBook.ContentId);
                if (itemExists == null)
                {
                    var newDict = new Dictionary<string, object>
                    {
                        { "name", $"Day {i + 1}" },
                        { "day", (i + 1).ToString() },
                        { "smallGroupActivity", daySmall.ContentId },
                        { "largeGroupActivity", dayLarge.ContentId },
                        { "storyBook", dayBook.ContentId },
                        { "storyActivity", dayStory.ContentId }
                    };

                    var newRecordId = _contentRepo.Create(ContentTypeConstants.ThemeDayId, englishId, newDict);
                    themeDayContentIds.Add(newRecordId.ToString());
                }
                else
                {
                    themeDayContentIds.Add(itemExists.ContentId);
                }
            }
            return string.Join(",", themeDayContentIds);
        }
        public string CreateAnimalThemeDays(Guid englishId)
        {
            var smallActivities = GetAnimalTheme(SmallActivity);
            var largeActivities = GetAnimalTheme(LargeActivity);
            var storyActivities = GetAnimalTheme(StoryActivity);
            var storyBooks = GetAnimalTheme(StoryBook);

            var existingActivities = GetExistingActivities(englishId);
            var existingStoryBooks = GetExistingStoryBooks(englishId);

            // Determine max days based on smallest list length
            int dayCount = new[] { smallActivities.Count, largeActivities.Count, storyActivities.Count, storyBooks.Count }
                        .Min();
            dayCount = Math.Min(dayCount, 20); // Optional: Cap at 20

            var allThemeDays = _contentRepo.GetAll(ContentTypeConstants.ThemeDayId, englishId)
                                .Select(x => new ThemeDayModel(x)).Where(x => x.TenantId == TenantExecutionContext.Tenant.Id.ToString()).ToList();

            var themeDayContentIds = new List<string>();

            for (int i = 0; i < dayCount; i++)
            {
                var daySmall = existingActivities.FirstOrDefault(x => x.Value == smallActivities[i]);
                var dayLarge = existingActivities.FirstOrDefault(x => x.Value == largeActivities[i]);
                var dayStory = existingActivities.FirstOrDefault(x => x.Value == storyActivities[i]);
                var dayBook = existingStoryBooks.FirstOrDefault(x => x.Value == storyBooks[i]);

                var day = (i + 1).ToString();
                var name = $"Day {(i + 1)}";

                var itemExists = allThemeDays.FirstOrDefault(x => x.Day == day
                                                            && x.Name == name
                                                            && x.SmallGroupActivity == daySmall.ContentId
                                                            && x.LargeGroupActivity == dayLarge.ContentId
                                                            && x.StoryActivity == dayStory.ContentId
                                                            && x.StoryBook == dayBook.ContentId);
                if (itemExists == null)
                {
                    var newDict = new Dictionary<string, object>
                    {
                        { "name", $"Day {i + 1}" },
                        { "day", (i + 1).ToString() },
                        { "smallGroupActivity", daySmall.ContentId },
                        { "largeGroupActivity", dayLarge.ContentId },
                        { "storyBook", dayBook.ContentId },
                        { "storyActivity", dayStory.ContentId }
                    };

                    var newRecordId = _contentRepo.Create(ContentTypeConstants.ThemeDayId, englishId, newDict);
                    themeDayContentIds.Add(newRecordId.ToString());
                }
                else
                {
                   themeDayContentIds.Add(itemExists.ContentId); 
                }
            }

            return string.Join(",", themeDayContentIds);
        }
        public void ValidateNatureThemeChildren(Guid englishId, Guid oaTenantId)
        {
            var existingActivities = GetExistingActivities(englishId);
            var existingStoryBooks = GetExistingStoryBooks(englishId);

            ValidateItems(GetNatureTheme(SmallActivity).Distinct(), existingActivities,
                ContentTypeConstants.Activity, englishId, oaTenantId,
                (x, id) => new ActivityModel(x, id));

            ValidateItems(GetNatureTheme(LargeActivity).Distinct(), existingActivities,
                ContentTypeConstants.Activity, englishId, oaTenantId,
                (x, id) => new ActivityModel(x, id));

            ValidateItems(GetNatureTheme(StoryActivity).Distinct(), existingActivities,
                ContentTypeConstants.Activity, englishId, oaTenantId,
                (x, id) => new ActivityModel(x, id));

            ValidateItems(GetNatureTheme(StoryBook).Distinct(), existingStoryBooks,
                ContentTypeConstants.StoryBook, englishId, oaTenantId,
                (x, id) => new StoryBookModel(x, id));
        }
        public void ValidateAnimalThemeChildren(Guid englishId, Guid oaTenantId)
        {
            var existingActivities = GetExistingActivities(englishId);
            var existingStoryBooks = GetExistingStoryBooks(englishId);

            ValidateItems(GetAnimalTheme(SmallActivity).Distinct(), existingActivities,
                ContentTypeConstants.Activity, englishId, oaTenantId,
                (x, id) => new ActivityModel(x, id));

            ValidateItems(GetAnimalTheme(LargeActivity).Distinct(), existingActivities,
                ContentTypeConstants.Activity, englishId, oaTenantId,
                (x, id) => new ActivityModel(x, id));

            ValidateItems(GetAnimalTheme(StoryActivity).Distinct(), existingActivities,
                ContentTypeConstants.Activity, englishId, oaTenantId,
                (x, id) => new ActivityModel(x, id));

            ValidateItems(GetAnimalTheme(StoryBook).Distinct(), existingStoryBooks,
                ContentTypeConstants.StoryBook, englishId, oaTenantId,
                (x, id) => new StoryBookModel(x, id));
        }

        private void ValidateItems(
            IEnumerable<string> items,
            IEnumerable<ContentItem> existingItems,
            string contentType,
            Guid englishId,
            Guid oaTenantId,
            Func<object, Guid, object> modelFactory)
        {
            foreach (var item in items)
            {
                var itemExists = existingItems.Any(x => x.Value == item);
                if (!itemExists)
                {
                    var oaItem = _contentRepo.GetByValueKey(contentType, "name", item, englishId, oaTenantId)
                                        .Select(x => modelFactory(x, englishId))
                                        .FirstOrDefault();
                                        
                    if (contentType == ContentTypeConstants.Activity)
                    {
                        AddActivity(englishId, oaItem as ActivityModel);
                    }
                    else
                    {
                        AddStoryBook(englishId, oaItem as StoryBookModel);
                    }
                }
            }
        }

        public void AddActivity(Guid englishId, ActivityModel contentRecord)
        {
            Dictionary<string, object> newDict = new Dictionary<string, object>
                {
                    { "availableLanguages", contentRecord.AvailableLanguages },
                    { "description", contentRecord.Description },
                    { "image", contentRecord.Image },
                    { "materials", contentRecord.Materials },
                    { "name", contentRecord.Name },
                    { "notes", contentRecord.Notes },
                    { "subType", contentRecord },
                    { "subCategories", contentRecord.SubCategories },
                    { "type", contentRecord.Type },
                };
            _contentRepo.Create(ContentTypeConstants.ActivityId, englishId, newDict);
            
        }
        public void AddStoryBook(Guid englishId, StoryBookModel contentRecord)
        {
            Dictionary<string, object> newDict = new Dictionary<string, object>
                {
                    { "name", contentRecord.Name },
                    { "type", contentRecord.Type },
                    { "author", contentRecord.Author },
                    { "authorsAuthorization", contentRecord.AuthorsAuthorization },
                    { "illustrator", contentRecord.Illustrator },
                    { "translator", contentRecord.Translator },
                    { "bookLocation", contentRecord.BookLocation },
                    { "bookLocationLink", contentRecord.BookLocationLink },
                    { "keywords", contentRecord.Keywords },
                    { "storyBookParts", contentRecord.StoryBookParts },
                    { "shareContent", contentRecord.ShareContent },
                    { "themes", contentRecord.Themes },
                    { "availableLanguages", contentRecord.AvailableLanguages },
                };
            _contentRepo.Create(ContentTypeConstants.StoryBookId, englishId, newDict);
        }
        public static List<string> GetAnimalTheme(string storyType)
        {
            if (storyType == SmallActivity)
            {
                return new List<string>()
                    {
                        ContentTypeConstants.FingerPaintTree,
                        ContentTypeConstants.NaturePuzzle,
                        ContentTypeConstants.TallTree,
                        ContentTypeConstants.BigMediumSmall,
                        ContentTypeConstants.FloatSink,
                        ContentTypeConstants.FloatSink,
                        ContentTypeConstants.BubbleClouds,
                        ContentTypeConstants.RubbingTextures,
                        ContentTypeConstants.NaturePicture,
                        ContentTypeConstants.BlowToMove,
                        ContentTypeConstants.SortingSeeds,
                        ContentTypeConstants.FieldsOfFlowers,
                        ContentTypeConstants.TreasureBox,
                        ContentTypeConstants.CurlySnake,
                        ContentTypeConstants.OwlOwl,
                        ContentTypeConstants.ColourfulButterflies,
                        ContentTypeConstants.BuildingCreatures,
                        ContentTypeConstants.AnimalHouses,
                        ContentTypeConstants.AnimalStandUp,
                        ContentTypeConstants.StoryDrawing,
                    };
            }
            else if (storyType == LargeActivity)
            {
                return new List<string>()
                    {
                        ContentTypeConstants.WalkingInTheJungle,
                        ContentTypeConstants.ObstacleCourse,
                        ContentTypeConstants.NatureHunt,
                        ContentTypeConstants.PlantingSeedSong,
                        ContentTypeConstants.HandTree,
                        ContentTypeConstants.HandTree,
                         ContentTypeConstants.GoingUnder,
                        ContentTypeConstants.SimonSays,
                        ContentTypeConstants.WalkingInTheJungle,
                        ContentTypeConstants.PinTheTailOnTheCow,
                        ContentTypeConstants.ThreeLeggedRace,
                        ContentTypeConstants.JumpingHorse,
                        ContentTypeConstants.SpiderWebGame,
                        ContentTypeConstants.FollowTheLeader,
                        ContentTypeConstants.NatureMoves,
                        ContentTypeConstants.PassTheBall,
                        ContentTypeConstants.MakingMusic,
                        ContentTypeConstants.WakeUpAnimals,
                        ContentTypeConstants.TheAntMarchSong,
                        ContentTypeConstants.PinTheTailOnTheCow
                    };
            }
            else if (storyType == StoryBook)
            {
                return new List<string>()
                    {
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.MakeOrChooseYourOwnStory,
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.MakeOrChooseYourOwnStory,
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.MakeOrChooseYourOwnStory,
                        ContentTypeConstants.MakeOrChooseYourOwnStory,
                        ContentTypeConstants.TheSkyIsFallingDown,
                        ContentTypeConstants.TheSkyIsFallingDown,
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.TheSkyIsFallingDown,
                        ContentTypeConstants.MakeOrChooseYourOwnStory,
                        ContentTypeConstants.TheSkyIsFallingDown,
                        ContentTypeConstants.TheElephantWhoLikedToDance,
                        ContentTypeConstants.TheElephantWhoLikedToDance,
                        ContentTypeConstants.MakeOrChooseYourOwnStory,
                        ContentTypeConstants.MakeOrChooseYourOwnStory
                    };
            }
            else if (storyType == StoryActivity)
            {
                return new List<string>()
                    {
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.ShareStoryAndLearn,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StoryAct,
                        ContentTypeConstants.MakeAStory,
                        ContentTypeConstants.MakeAStory,
                         ContentTypeConstants.StorySharing,
                        ContentTypeConstants.PuppetStory,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.PuppetStory,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.ShareStoryAndLearn,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StoryCards
                    };
            }
            return new List<string>();
        }
        public static List<string> GetNatureTheme(string storyType)
        {
            if (storyType == SmallActivity)
            {
                return new List<string>()
                    {
                        ContentTypeConstants.FingerPaintTree,
                        ContentTypeConstants.NaturePuzzle,
                        ContentTypeConstants.TallTree,
                        ContentTypeConstants.BigMediumSmall,
                        ContentTypeConstants.MakingFlowers,
                        ContentTypeConstants.FloatSink,
                        ContentTypeConstants.BubbleClouds,
                        ContentTypeConstants.RubbingTextures,
                        ContentTypeConstants.NaturePicture,
                        ContentTypeConstants.BlowToMove,
                        ContentTypeConstants.SortingSeeds,
                        ContentTypeConstants.FieldsOfFlowers,
                        ContentTypeConstants.TreasureBox,
                        ContentTypeConstants.CurlySnake,
                        ContentTypeConstants.OwlOwl,
                        ContentTypeConstants.ColourfulButterflies,
                        ContentTypeConstants.DrawingBirds,
                        ContentTypeConstants.AnimalStandUp,
                        ContentTypeConstants.LittleBird,
                        ContentTypeConstants.ElephantTrunk,
                    };
            }
            else if (storyType == LargeActivity)
            {
                return new List<string>()
                    {
                        ContentTypeConstants.WalkingInTheJungle,
                        ContentTypeConstants.ObstacleCourse,
                        ContentTypeConstants.NatureHunt,
                        ContentTypeConstants.PlantingSeedSong,
                        ContentTypeConstants.WalkingInTheJungle,
                        ContentTypeConstants.HandTree,
                        ContentTypeConstants.GoingUnder,
                        ContentTypeConstants.SimonSays,
                        ContentTypeConstants.WalkingInTheJungle,
                        ContentTypeConstants.PinTheTailOnTheCow,
                        ContentTypeConstants.ThreeLeggedRace,
                        ContentTypeConstants.JumpingHorse,
                        ContentTypeConstants.SpiderWebGame,
                        ContentTypeConstants.FollowTheLeader,
                        ContentTypeConstants.NatureMoves,
                        ContentTypeConstants.PassTheBall,
                        ContentTypeConstants.FoxyFoxy,
                        ContentTypeConstants.MakingMusic,
                        ContentTypeConstants.RedLightGreenLight,
                        ContentTypeConstants.DressUpDancing,
                    };
            }
            else if (storyType == StoryBook)
            {
                return new List<string>()
                    {
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.MakeOrChooseYourOwnStory,
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.MakeOrChooseYourOwnStory,
                        ContentTypeConstants.TheSkyIsFallingDown,
                        ContentTypeConstants.TheSkyIsFallingDown,
                        ContentTypeConstants.TheSkyIsFallingDown,
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.TheSkyIsFallingDown,
                        ContentTypeConstants.Serapana,
                        ContentTypeConstants.TheSkyIsFallingDown,
                        ContentTypeConstants.MakeOrChooseYourOwnStory,
                        ContentTypeConstants.TheSkyIsFallingDown,
                        ContentTypeConstants.MakeOrChooseYourOwnStory,
                        ContentTypeConstants.MakeOrChooseYourOwnStory,
                        ContentTypeConstants.ThereWasAnOldWoman,
                        ContentTypeConstants.ThereWasAnOldWoman,
                    };
            }
            else if (storyType == StoryActivity)
            {
                return new List<string>()
                    {
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.ShareStoryAndLearn,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StoryCards,
                        ContentTypeConstants.StoryAct,
                        ContentTypeConstants.MakeAStory,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.PuppetStory,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.PuppetStory,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.ShareStoryAndLearn,
                        ContentTypeConstants.StorySharing,
                        ContentTypeConstants.StoryCards,
                    };
            }
            return new List<string>();
        }

        private List<ContentItem> GetExistingActivities(Guid englishId)
        {
            return _context.ContentValues
                            .Include(x => x.Content)
                            .Include(x => x.ContentTypeField)
                            .Where(x => x.Content.ContentTypeId == ContentTypeConstants.ActivityId
                                        && x.Content.IsActive
                                        && x.LocaleId == englishId
                                        && x.TenantId == TenantExecutionContext.Tenant.Id
                                        && x.ContentTypeField.FieldName == "name"
                                        && !string.IsNullOrEmpty(x.Value))
                                        .Select(x => new ContentItem(x)).ToList();
        }

        private List<ContentItem> GetExistingStoryBooks(Guid englishId)
        {
            return _context.ContentValues
                            .Include(x => x.Content)
                            .Include(x => x.ContentTypeField)
                            .Where(x => x.Content.ContentTypeId == ContentTypeConstants.StoryBookId
                                    && x.Content.IsActive
                                    && x.LocaleId == englishId
                                    && x.TenantId == TenantExecutionContext.Tenant.Id
                                    && x.ContentTypeField.FieldName == "name"
                                    && !string.IsNullOrEmpty(x.Value))
                                    .Select(x => new ContentItem(x)).ToList();
        }
    }
}
