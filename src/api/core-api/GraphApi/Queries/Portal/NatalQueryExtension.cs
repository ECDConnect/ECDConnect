using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.ContentManagement.Repositories;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.Portal
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class NatalQueryExtension
    {
        [GraphQLType("[Natal]!")]
        public List<PortalNatalModel> GetNatalRecordsForType(
           [Service] ContentManagementRepository contentRepo,
           string type,
           string localeId)
        {
            return new List<PortalNatalModel>();
            //return contentRepo.GetByValueKey("VisitVideos", "section", section, localeId);
        }

        public bool TransferVisitVideosToNatalVideos([Service] ContentManagementRepository contentRepo)
        {
            // NatalVideos
            //1   title   1   true
            //2   section 1   true
            //3   type    4   true    NatalType
            //4   video   7   true

            // Fieldname transfer
            // 1. visit TO title
            // 2. section TO section
            // 3. type TO type
            // 4. video TO video

            var ctVisitVideoId = 17;
            var ctNatalVideoId = 31;

            var localeId = new System.Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var postnatalId = GetPostnatalId(contentRepo, localeId);
            var antenatalId = GetAntenatalId(contentRepo, localeId);

            // VisitVideos
            var visitVideos = contentRepo.GetAll(ctVisitVideoId, localeId);
            foreach (var visitVideo in visitVideos)
            {
                var video = (IDictionary<string, object>)visitVideo;
                video.TryGetValue("visit", out var visitValue);
                video.TryGetValue("section", out var sectionValue);
                video.TryGetValue("type", out var typeValue);
                video.TryGetValue("video", out var videoValue);

                if (Convert.ToString(typeValue) == "postnatal" || Convert.ToString(typeValue) == "antenatal")
                {
                    Dictionary<string, object> dataDict = new Dictionary<string, object>
                    {
                        { "title", Convert.ToString(visitValue) },
                        { "section", Convert.ToString(sectionValue) },
                        { "type", Convert.ToString(typeValue) == "postnatal" ? postnatalId : antenatalId },
                        { "video", Convert.ToString(videoValue) },
                        { "availableLanguages", Convert.ToString(localeId) },
                    };

                    contentRepo.Create(ctNatalVideoId, localeId, dataDict);
                }
            }
            return true;
        }

        public bool TransferInfoGraphicsToNatalGraphics([Service] ContentManagementRepository contentRepo)
        {
            // NatalGraphics
            // title
            // section
            // type
            // image

            // Fieldname transfer
            // 1. visit TO title
            // 2. section TO section
            // 3. type TO type
            // 4. there are not images at the time of transfer

            var ctInfographicsId = 18;
            var ctNatalGraphicId = 32;
            var localeId = new System.Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var postnatalId = GetPostnatalId(contentRepo, localeId);
            var antenatalId = GetAntenatalId(contentRepo, localeId);

            var infoGraphics = contentRepo.GetAll(ctInfographicsId, localeId);
            foreach (var infoGraphic in infoGraphics)
            {
                var info = (IDictionary<string, object>)infoGraphic;
                info.TryGetValue("visit", out var visitValue);
                info.TryGetValue("section", out var sectionValue);
                info.TryGetValue("type", out var typeValue);

                if (Convert.ToString(typeValue) == "postnatal" || Convert.ToString(typeValue) == "antenatal")
                {
                    Dictionary<string, object> dataDict = new Dictionary<string, object>
                    {
                        { "title", Convert.ToString(visitValue) },
                        { "section", Convert.ToString(sectionValue) },
                        { "type", Convert.ToString(typeValue) == "postnatal" ? postnatalId : antenatalId },
                        { "image", ""},
                        { "availableLanguages", Convert.ToString(localeId) },
                    };
                    contentRepo.Create(ctNatalGraphicId, localeId, dataDict);
                }
            }
            return true;
        }

        public bool TransferHealthPromotionToNatalHealth([Service] ContentManagementRepository contentRepo)
        {
            // NatalHealth
            // title
            // section
            // type
            // discussionA
            // discussionB
            // discussionC
            // discussionD
            // discussionE
            // discussionF
            // discussionG
            // discussionH
            // discussionI
            // discussionJ

            // Fieldname transfer
            // 1. visit TO title
            // 2. section TO section
            // 3. type TO type
            // 4. description TO discussionA

            var ctHealthPromotionId = 16;
            var ctNatalHealthId = 33;
            var localeId = new System.Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var postnatalId = GetPostnatalId(contentRepo, localeId);
            var antenatalId = GetAntenatalId(contentRepo, localeId); ;

            var healthData = contentRepo.GetAll(ctHealthPromotionId, localeId);
            foreach (var healthD in healthData)
            {
                var health = (IDictionary<string, object>)healthD;
                health.TryGetValue("visit", out var visitValue);
                health.TryGetValue("section", out var sectionValue);
                health.TryGetValue("type", out var typeValue);
                health.TryGetValue("description", out var descValue);

                if (Convert.ToString(typeValue) == "postnatal" || Convert.ToString(typeValue) == "antenatal")
                {
                    Dictionary<string, object> dataDict = new Dictionary<string, object>
                    {
                        { "title", Convert.ToString(visitValue) },
                        { "section", Convert.ToString(sectionValue) },
                        { "type", Convert.ToString(typeValue) == "postnatal" ? postnatalId : antenatalId },
                        { "discussionA", Convert.ToString(descValue)},
                        { "discussionB", ""},
                        { "discussionC", ""},
                        { "discussionD", ""},
                        { "discussionE", ""},
                        { "discussionF", ""},
                        { "discussionG", ""},
                        { "discussionH", ""},
                        { "discussionI", ""},
                        { "discussionJ", ""},
                        { "availableLanguages", Convert.ToString(localeId) },
                    };
                    contentRepo.Create(ctNatalHealthId, localeId, dataDict);
                }
            }

            return true;
        }

        public bool TransferMoreInformationToNatalInfo([Service] ContentManagementRepository contentRepo)
        {
            // NatalInfo
            // title
            // section
            // type
            // pollyTipText
            // pollyTipContent
            // contentSectionA
            // lightBulbSectionA
            // contentSectionB
            // lightBulbSectionB
            // contentSectionC
            // lightBulbSectionC

            // Fieldname transfer
            // 1. visit TO title
            // 2. section TO section
            // 3. type TO type
            // 4. 

            var ctMoreInformationId = 15;
            var ctNatalInfoId = 30;
            var localeId = new System.Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var postnatalId = GetPostnatalId(contentRepo, localeId);
            var antenatalId = GetAntenatalId(contentRepo, localeId);

            var moreInfoData = contentRepo.GetAll(ctMoreInformationId, localeId);
            foreach (var moreInfo in moreInfoData)
            {
                var more = (IDictionary<string, object>)moreInfo;
                more.TryGetValue("visit", out var visitValue);
                more.TryGetValue("section", out var sectionValue);
                more.TryGetValue("type", out var typeValue);
                more.TryGetValue("infoBoxTitle", out var infoTitleValue);
                more.TryGetValue("infoBoxDescription", out var infoDescriptionValue);
                more.TryGetValue("headerA", out var headerAValue);
                more.TryGetValue("descriptionA", out var descriptionAValue);
                more.TryGetValue("headerB", out var headerBValue);
                more.TryGetValue("descriptionB", out var descriptionBValue);
                more.TryGetValue("headerC", out var headerCValue);
                more.TryGetValue("descriptionC", out var descriptionCValue);
                more.TryGetValue("headerD", out var headerDValue);
                more.TryGetValue("descriptionD", out var descriptionDValue);
                more.TryGetValue("descriptionE", out var descriptionEValue);

                if (Convert.ToString(typeValue) == "postnatal" || Convert.ToString(typeValue) == "antenatal")
                {
                    var contentSectionA = "<p>" + Convert.ToString(headerAValue) + "</p>" + Convert.ToString(descriptionAValue);
                    var lightBulbSectionA = "<p>" + Convert.ToString(headerBValue) + "</p>" + Convert.ToString(descriptionBValue);
                    var contentSectionB = "<p>" + Convert.ToString(headerCValue) + "</p>" + Convert.ToString(descriptionCValue);
                    var lightBulbSectionB = "<p>" + Convert.ToString(headerDValue) + "</p>" + Convert.ToString(descriptionDValue);

                    Dictionary<string, object> dataDict = new Dictionary<string, object>
                    {
                        { "title", Convert.ToString(visitValue) },
                        { "section", Convert.ToString(sectionValue) },
                        { "type", Convert.ToString(typeValue) == "postnatal" ? postnatalId : antenatalId },
                        { "pollyTipText", Convert.ToString(infoTitleValue)},
                        { "pollyTipContent", Convert.ToString(infoDescriptionValue)},
                        { "contentSectionA", contentSectionA},
                        { "lightBulbSectionA", lightBulbSectionA},
                        { "contentSectionB", contentSectionB},
                        { "lightBulbSectionB", lightBulbSectionB},
                        { "contentSectionC", Convert.ToString(descriptionEValue)},
                        { "lightBulbSectionC", ""},
                        { "availableLanguages", Convert.ToString(localeId) },
                    };
                    contentRepo.Create(ctNatalInfoId, localeId, dataDict);
                }
            }

            return true;
        }

        public bool TransferMoreInformationToNatal([Service] ContentManagementRepository contentRepo)
        {
            //title
            //section
            //type
            //info
            //video
            //graphic
            //health

            var localeId = new System.Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var postnatalId = GetPostnatalId(contentRepo, localeId);
            var antenatalId = GetAntenatalId(contentRepo, localeId);
            var natalId = 29;

            //var pillar1Data = GetPillar1Data(postnatalId, localeId);
            //var pillar2Data = GetPillar2Data(postnatalId, localeId);
            //var pillar3Data = GetPillar3Data(postnatalId, localeId);
            //var pillar5Data = GetPillar5Data(postnatalId, localeId);
           // var careForMomData = GetCareForMomData(postnatalId, localeId);
            //var careForBabyData = GetCareForBabyData(postnatalId, localeId);

            var pregnancyCareData = GetPregnancyCareData(antenatalId, localeId);
            var healthCareData = GetHealthCareData(antenatalId, localeId);
            var nutritionCareData = GetNutritionData(antenatalId, localeId);

            foreach (var item in pregnancyCareData)
            {
                var natal = (IDictionary<string, object>)item;
                natal.TryGetValue("title", out var titleValue);
                natal.TryGetValue("section", out var sectionValue);
                natal.TryGetValue("type", out var typeValue);

                natal.TryGetValue("info", out var infoValue);
                natal.TryGetValue("video", out var videoValue);
                natal.TryGetValue("graphic", out var graphicValue);
                natal.TryGetValue("health", out var healthValue);


                Dictionary<string, object> dataDict = new Dictionary<string, object>
                {
                    { "title", Convert.ToString(titleValue) },
                    { "section", Convert.ToString(sectionValue) },
                    { "type", Convert.ToString(typeValue) },
                    { "info", Convert.ToString(infoValue) },
                    { "video", Convert.ToString(videoValue) },
                    { "graphic", Convert.ToString(graphicValue) },
                    { "health", Convert.ToString(healthValue) },
                    { "availableLanguages", Convert.ToString(localeId) },
                };
                contentRepo.Create(natalId, localeId, dataDict);
            }


            return true;
        }

        private string GetPostnatalId([Service] ContentManagementRepository contentRepo, Guid localeId)
        {
            var postnatal = (IDictionary<string, object>)contentRepo.GetByValueKey("NatalType", "name", "Postnatal", localeId).FirstOrDefault();
            postnatal.TryGetValue("id", out var value);
            return Convert.ToString(value);
        }

        private string GetAntenatalId([Service] ContentManagementRepository contentRepo, Guid localeId)
        {
            var antenatal = (IDictionary<string, object>)contentRepo.GetByValueKey("NatalType", "name", "Antenatal", localeId).FirstOrDefault();
            antenatal.TryGetValue("id", out var value);
            return Convert.ToString(value);
        }

        private List<Dictionary<string, object>> GetCareForMomData(string postnatalId, Guid localeId)
        {
            return new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    { "title", "Care for mom" },
                    { "section", "Care for mom" },
                    { "type", postnatalId },
                    { "info", "1917" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Clinic check-ups" },
                    { "section", "Care for mom" },
                    { "type", postnatalId },
                    { "health", "1898" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Self care" },
                    { "section", "Care for mom" },
                    { "type", postnatalId },
                    { "health", "1899" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Self care & support" },
                    { "section", "Care for mom" },
                    { "type", postnatalId },
                    { "health", "1900" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Maternal distress" },
                    { "section", "Care for mom" },
                    { "type", postnatalId },
                    { "video", "1886" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Maternal distress" },
                    { "section", "Care for mom" },
                    { "type", postnatalId },
                    { "info", "1918" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Newborn care" },
                    { "section", "Care for mom" },
                    { "type", postnatalId },
                    { "health", "1901" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
            };
        }

        private List<Dictionary<string, object>> GetPillar1Data(string postnatalId, Guid localeId)
        {
            return new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    { "title", "Breast milk only" },
                    { "section", "Pillar 1: Nutrition" },
                    { "type", postnatalId },
                    { "health", "1902" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Formula milk only" },
                    { "section", "Pillar 1: Nutrition (every visit)" },
                    { "type", postnatalId },
                    { "health", "1903" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Formula milk only" },
                    { "section", "Pillar 1: Nutrition (first visit)" },
                    { "type", postnatalId },
                    { "health", "1904" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Formula milk only" },
                    { "section", "Pillar 1: Nutrition (day 7-48)" },
                    { "type", postnatalId },
                    { "health", "1905" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Mixed feeding" },
                    { "section", "Pillar 1: Nutrition" },
                    { "type", postnatalId },
                    { "health", "1906" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Benefits of breastfeeding" },
                    { "section", "Pillar 1: Nutrition - Breast milk only" },
                    { "type", postnatalId },
                    { "video", "1888" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "How breastfeeding works" },
                    { "section", "Pillar 1: Nutrition - Breast milk only" },
                    { "type", postnatalId },
                    { "video", "1891" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Breastfeeding challenges" },
                    { "section", "Pillar 1: Nutrition - Breast milk only" },
                    { "type", postnatalId },
                    { "video", "1889" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Unsafe feeding practices" },
                    { "section", "Pillar 1: Nutrition - Breast milk only" },
                    { "type", postnatalId },
                    { "video", "1892" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Breastfeeding in the workplace" },
                    { "section", "Pillar 1: Nutrition - Breast milk only" },
                    { "type", postnatalId },
                    { "video", "1894" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Benefits of breastfeeding" },
                    { "section", "Pillar 1: Nutrition - Formula milk only" },
                    { "type", postnatalId },
                    { "video", "1937" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "How breastfeeding works" },
                    { "section", "Pillar 1: Nutrition - Formula milk only" },
                    { "type", postnatalId },
                    { "video", "1940" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Unsafe feeding practices" },
                    { "section", "Pillar 1: Nutrition - Formula milk only" },
                    { "type", postnatalId },
                    { "video", "1941" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Benefits of breastfeeding" },
                    { "section", "Pillar 1: Nutrition - Mixed feeding" },
                    { "type", postnatalId },
                    { "video", "1939" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "How breastfeeding works" },
                    { "section", "Pillar 1: Nutrition - Mixed feeding" },
                    { "type", postnatalId },
                    { "video", "1880" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Unsafe feeding practices" },
                    { "section", "Pillar 1: Nutrition - Mixed feeding" },
                    { "type", postnatalId },
                    { "video", "1942" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "First foods" },
                    { "section", "Pillar 1: Nutrition - Mixed feeding" },
                    { "type", postnatalId },
                    { "video", "1890" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Complementary feeding" },
                    { "section", "Pillar 1: Nutrition - Mixed feeding" },
                    { "type", postnatalId },
                    { "video", "1883" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Food groups" },
                    { "section", "Pillar 1: Nutrition - Complementary feeding" },
                    { "type", postnatalId },
                    { "info", "1944" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Egg" },
                    { "section", "Pillar 1: Nutrition - Complementary feeding" },
                    { "type", postnatalId },
                    { "info", "1945" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
            };
        }

        private List<Dictionary<string, object>> GetPillar2Data(string postnatalId, Guid localeId)
        {
            return new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    { "title", "Developmental screening" },
                    { "section", "Pillar 2: Love, play and talk" },
                    { "type", postnatalId },
                    { "info", "1919" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "14 week developmental screening" },
                    { "section", "Pillar 2: Love, play and talk" },
                    { "type", postnatalId },
                    { "info", "1927" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "6 month developmental screening" },
                    { "section", "Pillar 2: Love, play and talk" },
                    { "type", postnatalId },
                    { "info", "1923" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "9 month developmental screening" },
                    { "section", "Pillar 2: Love, play and talk" },
                    { "type", postnatalId },
                    { "info", "1924" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "12 month developmental screening" },
                    { "section", "Pillar 2: Love, play and talk" },
                    { "type", postnatalId },
                    { "info", "1925" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "18 month developmental screening" },
                    { "section", "Pillar 2: Love, play and talk" },
                    { "type", postnatalId },
                    { "info", "1926" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Bonding" },
                    { "section", "Pillar 2: Love, play and talk" },
                    { "type", postnatalId },
                    { "video", "1887" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
            };
        }

        private List<Dictionary<string, object>> GetPillar3Data(string postnatalId, Guid localeId)
        {
            return new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    { "title", "Immunisation" },
                    { "section", "Pillar 3: Protection - Immunisations" },
                    { "type", postnatalId },
                    { "video", "1885" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
            };
        }

        private List<Dictionary<string, object>> GetPillar5Data(string postnatalId, Guid localeId)
        { 
            return new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    { "title", "HIV care & medication" },
                    { "section", "Pillar 5: Extra care" },
                    { "type", postnatalId },
                    { "health", "1907" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
            };
        }
        
        private List<Dictionary<string, object>> GetCareForBabyData(string postnatalId, Guid localeId)
        {
            return new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    { "title", "Kangaroo Mother Care" },
                    { "section", "Care for baby" },
                    { "type", postnatalId },
                    { "video", "1875" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
            };
        }

        private List<Dictionary<string, object>> GetPregnancyCareData(string antenatalId, Guid localeId)
        {
            return new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    { "title", "Maternal distress" },
                    { "section", "Pregnancy care" },
                    { "type", antenatalId },
                    { "info", "1920" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Pregnancy care" },
                    { "section", "Pregnancy care" },
                    { "type", antenatalId },
                    { "health", "1910" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Drug or alcohol use" },
                    { "section", "Pregnancy care" },
                    { "type", antenatalId },
                    { "health", "1911" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Alcohol use" },
                    { "section", "Pregnancy care" },
                    { "type", antenatalId },
                    { "health", "1912" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "HIV care & medication" },
                    { "section", "Pregnancy care (first visit)" },
                    { "type", antenatalId },
                    { "health", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "HIV care & medication" },
                    { "section", "Pregnancy care (client HIV positive)" },
                    { "type", antenatalId },
                    { "health", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Birth preparation & emergency planning" },
                    { "section", "Pregnancy care" },
                    { "type", antenatalId },
                    { "health", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Infant care" },
                    { "section", "Pregnancy care" },
                    { "type", antenatalId },
                    { "health", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Infant care" },
                    { "section", "Pregnancy care (video)" },
                    { "type", antenatalId },
                    { "health", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Maternal Distress" },
                    { "section", "Pregnancy care" },
                    { "type", antenatalId },
                    { "video", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Substance Abuse" },
                    { "section", "Pregnancy care" },
                    { "type", antenatalId },
                    { "video", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Benefits of Breastfeeding 1" },
                    { "section", "Pregnancy care" },
                    { "type", antenatalId },
                    { "video", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Benefits of Breastfeeding 2" },
                    { "section", "Pregnancy care" },
                    { "type", antenatalId },
                    { "video", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
            };
        }

        private List<Dictionary<string, object>> GetHealthCareData(string antenatalId, Guid localeId)
        {
            return new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    { "title", "Clinic visits" },
                    { "section", "Healthcare (first antenatal visit)" },
                    { "type", antenatalId },
                    { "health", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Clinic visits" },
                    { "section", "Healthcare (after first visit)" },
                    { "type", antenatalId },
                    { "health", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Antenatal Clinic" },
                    { "section", "Healthcare" },
                    { "type", antenatalId },
                    { "video", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
            };
        }

        private List<Dictionary<string, object>> GetNutritionData(string antenatalId, Guid localeId)
        {
            return new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    { "title", "Healthy eating" },
                    { "section", "Nutrition" },
                    { "type", antenatalId },
                    { "info", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },
                new Dictionary<string, object>
                {
                    { "title", "Nutrition During Pregnancy" },
                    { "section", "Nutrition" },
                    { "type", antenatalId },
                    { "video", "" },
                    { "availableLanguages", Convert.ToString(localeId) },
                },

            };
        }



    }
}
