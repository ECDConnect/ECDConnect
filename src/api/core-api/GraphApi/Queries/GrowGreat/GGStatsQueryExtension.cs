using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Clinics;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using static EcdLink.Api.CoreApi.Constants;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class GGStatsQueryExtension
    {
        public async Task<FileModel> DownloadGGStatsFile(
            [Service] IFileGenerationService fileService,
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            DateTime startDate,
            DateTime endDate,
            List<string> clinicSearch = null,
            List<Guid> provinceSearch = null,
            List<Guid> districtSearch = null,
            List<Guid> subDistrictSearch = null
            )
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var clinicRepo = repoFactory.CreateGenericRepository<Clinic>(userContext: uId);
            var infantRepo = repoFactory.CreateGenericRepository<Infant>(userContext: uId);

            var sheet1Name = $"Client Case Summary";
            var sheet2Name = $"Maternal Health & Nutrition";
            var sheet3Name = $"Child Health & Nutrition";
            var sheet4Name = $"Referrals";
            var sheet5Name = $"Other";

            var quarterText =
                endDate.Month >= 1 && endDate.Month <= 3 ? "1"
                : endDate.Month >= 4 && endDate.Month <= 6 ? "2"
                : endDate.Month >= 7 && endDate.Month <= 9 ? "3"
                : "4";

            var clinics = clinicRepo.GetAll()
                                    .Where(x => x.IsActive && x.HealthCareWorkers.Count > 0)
                                    .Include(x => x.TeamLeads.Where(p => p.IsActive))
                                    .Include(x => x.HealthCareWorkers.Where(h => h.IsActive))
                                    .Include(x => x.Leagues.Where(l => l.IsActive)).ToList();

            if (clinicSearch != null && clinicSearch.Any())
            {
                clinics = clinics.Where(x => clinicSearch.Contains(x.Name)).ToList();
            }
            if (provinceSearch != null && provinceSearch.Any())
            {
                clinics = clinics.Where(x => provinceSearch.Contains(x.SubDistrict.District.ProvinceId)).ToList();
            }
            if (districtSearch != null && districtSearch.Any())
            {
                clinics = clinics.Where(x => districtSearch.Contains(x.SubDistrict.DistrictId)).ToList();
            }
            if (subDistrictSearch != null && subDistrictSearch.Any())
            {
                clinics = clinics.Where(x => subDistrictSearch.Contains((Guid)x.SubDistrictId)).ToList();
            }

            var clinicNames = clinics.Select(x => x.Name).Distinct().ToList();
            var healthCareWorkers = clinics.SelectMany(x => x.HealthCareWorkers).Distinct().OrderBy(x => x.User.FullName).ToList();
            var allCaregivers = healthCareWorkers.Where(x => x.Caregivers.Count > 0).SelectMany(x => x.Caregivers).Distinct().ToList();
            var caregiverIds = allCaregivers.Select(x => x.Id).ToList();
            var allInfants = infantRepo.GetAll().Where(x => caregiverIds.Contains((Guid)x.CaregiverId)).ToList();
            var allMothers = healthCareWorkers.Where(x => x.Mothers.Count > 0).SelectMany(x => x.Mothers.Where(x => x.IsActive)).Distinct().ToList();

            var spreadSheets = new Dictionary<string, List<List<string>>>()
            {
               {
                    sheet1Name, GetClientCaseSummary(uId, repoFactory, healthCareWorkers, allInfants, startDate.Date, endDate.Date, quarterText)
               },
               {
                    sheet2Name, GetMaternalHealthSummary(uId, repoFactory, healthCareWorkers, allMothers, startDate.Date, endDate.Date, quarterText)
               },
               {
                    sheet3Name, GetChildHealthSummary(uId, repoFactory, healthCareWorkers, allInfants, startDate.Date, endDate.Date, quarterText)
               },
               {
                    sheet4Name, GetReferralSummary(uId, repoFactory, healthCareWorkers, allInfants, startDate.Date, endDate.Date, quarterText)
               },
               {
                    sheet5Name, GetOtherSummary(uId, repoFactory, healthCareWorkers, allInfants, startDate.Date, endDate.Date, quarterText)
               }
            };

            var fileName = $"GGC_Monthly_Stats_Report_" + startDate.Date.ToString("dd-MM-yyyy") + " to " + endDate.Date.ToString("dd-MM-yyyy") + "_" + (clinicNames.Count > 1 ? "multiple" : string.Join("_", clinicNames));

            return await fileService.DictionaryToExcelTemplate(spreadSheets, fileName);
        }

        private List<List<string>> GetClientCaseSummary(
            Guid applicationUserId,
            IGenericRepositoryFactory repoFactory,
            List<HealthCareWorker> healthCareWorkers,
            List<Infant> allInfants,
            DateTime startDate,
            DateTime endDate,
            string quarterText)
        {
            var auditRepo = repoFactory.CreateGenericRepository<IntegrationAudit>(userContext: applicationUserId);

            var femaleGuid = new Guid("2505d06f-d3cb-4544-abf8-f984fbe78505");
            var maleGuid = new Guid("61791dd5-2563-4a45-9d66-03be48d50e28");

            var ids = healthCareWorkers.Select(x => x.Id).ToList();

            var allActiveInfants = allInfants.Where(x => x.IsActive).ToList();
            var allArchiveInfants = allInfants.Where(x => !x.IsActive).ToList();
            var infantUserIds = allInfants.Select(x => x.UserId).ToList();

            var allAudits = auditRepo.GetAll().Where(x => infantUserIds.Contains(x.UserId) &&
                                                     x.Property == "Child" &&
                                                     x.ValueBefore == "True" &&
                                                     x.ValueAfter == "False" &&
                                                     x.InsertedDate.Date >= startDate.Date &&
                                                     x.InsertedDate.Date <= endDate.Date).Select(x => x.UserId).ToList();

            var sheetHeaderData = new List<List<string>>
            {
                new List<string>
                {
                    "Start Date", "End Date", "Quarter", "League type", "Province", "District", "Sub-district", "Clinic", "TL", "CHW",
                    "Total Clients", "Total Clients under 2 years", "Total Pregnant Clients", "New Clients All", "New Clients under 2 years",
                    "New Pregnant clients", "New Births", "Exited children over 2 years", "Pregnant Women's Average Age", "Mothers Average Age",
                    "Child Gender", "Child age averages"
                }
            };

            foreach (var item in healthCareWorkers)
            {
                var hcwCaregiverIds = item.Caregivers.Select(x => x.Id).ToList();
                var careGiverActiveInfants = allActiveInfants.Where(x => hcwCaregiverIds.Contains((Guid)x.CaregiverId)).Distinct().ToList();
                var careGiverInfantUserIds = allInfants.Where(x => hcwCaregiverIds.Contains((Guid)x.CaregiverId)).Select(x => x.UserId).Distinct().ToList();
                var hcwAudits = allAudits.Where(x => careGiverInfantUserIds.Contains(x)).ToList();
                var otlNames = item.Clinic.TeamLeads.Select(x => x.TeamLead.User.FullName).Distinct().ToList();
                var leagueTypes = item.Clinic.Leagues.Select(x => x.League.LeagueType.Name).Distinct().ToList();

                //1
                var totalClients = 0;// careGiverActiveInfants.Where(x => x.AgeMonths < 24).Count() + item.Mothers.Count();
                //2
                var totalClientsUnder2 = 0;// careGiverActiveInfants.Where(x => x.AgeMonths < 24).Count();
                //3
                var totalPregnantClients = item.Mothers.Count().ToString();
                //4
                var totalNewClients = careGiverActiveInfants.Where(x => x.InsertedDate.Date >= startDate.Date && x.InsertedDate.Date <= endDate.Date ).Count() +
                                                item.Mothers.Where(x => x.InsertedDate.Date >= startDate.Date && x.InsertedDate.Date <= endDate.Date).Count();
                //5
                var totalNewClientsUnder2 = careGiverActiveInfants.Where(x => x.InsertedDate.Date >= startDate.Date && x.InsertedDate.Date <= endDate.Date).Count();
                //6
                var totalNewPregnantClients = item.Mothers.Where(x => x.InsertedDate.Date >= startDate.Date && x.InsertedDate.Date <= endDate.Date).Count();
                //7
                var totalNewBirths = item.Mothers.Where(x => x.ExpectedDateOfDelivery.HasValue && x.ExpectedDateOfDelivery.Value.Date >= startDate.Date && x.ExpectedDateOfDelivery.Value.Date <= endDate.Date).Count();
                //8
                var totalExitedChildrenOver2Years = hcwAudits.Where(x => careGiverInfantUserIds.Contains(x)).Count();
                //9
                var allPregnantMotherAges = item.Mothers.Where(x => x.Age != null && x.ExpectedDateOfDelivery.HasValue && x.ExpectedDateOfDelivery.Value.Date > DateTime.Now.Date).Select(x => int.Parse(x.Age)).ToList();
                var allPregnantMotherAvgAges = allPregnantMotherAges.Count == 0 ? 0 : allPregnantMotherAges.Average();
                var totalPregnantMothersAvgAges = Math.Round(allPregnantMotherAvgAges);
                //10
                var allMotherAges = item.Mothers.Where(x => x.Age != null).Select(x => int.Parse(x.Age)).ToList();
                var avgMotherAges = allMotherAges.Count == 0 ? 0 : allMotherAges.Average();
                var totalMothersAvgAges = Math.Round(avgMotherAges);
                // 11
                var totalFemales = careGiverActiveInfants.Where(x => x.GenderId.HasValue && x.GenderId == femaleGuid).Count();
                var totalMales = careGiverActiveInfants.Where(x => x.GenderId.HasValue && x.GenderId == maleGuid).Count();
                // 12
                var childrenAgesAvg = 0.0;// careGiverActiveInfants.Count > 0 ? careGiverActiveInfants.Select(x => x.AgeMonths).Average() : 0.0;
                var childrenAgesAnswer = Math.Round(childrenAgesAvg);

                sheetHeaderData.Add(
                    new List<string>
                    {
                        startDate.ToString("dd-MM-yyyy"),
                        endDate.ToString("dd-MM-yyyy"),
                        quarterText,
                        string.Join(", ", leagueTypes.Distinct()),
                        item.Clinic.SubDistrict.District.Province.Description,
                        item.Clinic.SubDistrict.District.Name,
                        item.Clinic.SubDistrict.Name,
                        item.Clinic.Name,
                        string.Join(", ", otlNames.Distinct()),
                        item.User.FullName,
                        totalClients.ToString(),
                        totalClientsUnder2.ToString(),
                        totalPregnantClients.ToString(),
                        totalNewClients.ToString(),
                        totalNewClientsUnder2.ToString(),
                        totalNewPregnantClients.ToString(),
                        totalNewBirths.ToString(),
                        totalExitedChildrenOver2Years.ToString(),
                        totalPregnantMothersAvgAges.ToString(),
                        totalMothersAvgAges.ToString(),
                        totalFemales.ToString() + " vs " + totalMales.ToString(),
                        childrenAgesAnswer.ToString()
                    });
            }

            return sheetHeaderData;
        }

        private List<List<string>> GetMaternalHealthSummary(
            Guid applicationUserId,
            IGenericRepositoryFactory repoFactory,
            List<HealthCareWorker> healthCareWorkers,
            List<Mother> allMothers,
            DateTime startDate,
            DateTime endDate,
            string quarterText)
        {
            var visitDataRepo = repoFactory.CreateGenericRepository<VisitData>(userContext: applicationUserId);
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);

            var allMotherIds = allMothers.Select(x => x.Id).Distinct().ToList();
            var allVisitData = visitDataRepo.GetAll().Where(x => allMotherIds.Contains((Guid)x.Visit.MotherId)
                                                            && x.Visit.Attended
                                                            && x.InsertedDate.Date >= startDate.Date
                                                            && x.InsertedDate.Date <= endDate.Date
                                                            && (x.Question == "Is {client} HIV positive?" ||
                                                                x.Question == "Had thoughts and plans to harm yourself or commit suicide?" ||
                                                                x.Question == "Felt down, depressed or hopeless?" ||
                                                                x.Question == "Felt unable to stop worrying or thinking too much?" ||
                                                                x.Question == "What is {client} mid-upper arm circumference (MUAC) today?")
                                                                ).Distinct().ToList();

            var allVisits = visitRepo.GetAll().Where(x => x.MotherId.HasValue && allMotherIds.Contains((Guid)x.MotherId)
                                                     && x.Attended
                                                     && x.ActualVisitDate.HasValue
                                                     && x.ActualVisitDate.Value.Date >= startDate.Date
                                                     && x.ActualVisitDate.Value.Date <= endDate.Date).Distinct().ToList();

            var sheetHeaderData = new List<List<string>>
            {
                new List<string>
                {
                    "Start Date", "End Date", "Quarter", "League type", "Province", "District", "Sub-district", "Clinic", "TL", "CHW",
                    "Maternal HIV Status", "", "Early ANC clinic visit", "","Maternal Mental Health", "","Malnourished pregnant women", "","Malnourished new mothers"
                },
                new List<string>
                {
                    "", "", "", "", "", "", "", "", "","",
                    "Nr", "%", "Nr", "%","Nr", "%","Nr", "%","Nr", "%",
                },
            };

            foreach (var item in healthCareWorkers)
            {
                var otlNames = item.Clinic.TeamLeads.Select(x => x.TeamLead.User.FullName).Distinct().ToList();
                var leagueTypes = item.Clinic.Leagues.Select(x => x.League.LeagueType.Name).Distinct().ToList();

                var hcwMotherIds = item.Mothers.Where(x => x.IsActive).Select(x => x.Id).Distinct().ToList();
                var hcwVisitData = allVisitData.Where(x => hcwMotherIds.Contains((Guid)x.Visit.MotherId)).Distinct().ToList();
                var hcwVisits = allVisits.Where(x => hcwMotherIds.Contains((Guid)x.MotherId)).Distinct().ToList();

                //1 Maternal HIV Status - Number & Proportion (%) of mothers who are HIV positive
                var maternalHIVStatusTrueStatusCount = hcwVisitData.Where(x => x.Question == "Is {client} HIV positive?" && x.QuestionAnswer == "true").Select(x => x.Visit.MotherId).Distinct().Count();
                var maternalHIVStatusAvg = hcwMotherIds.Count != 0 ? ((double)maternalHIVStatusTrueStatusCount / (double)hcwMotherIds.Count * 100) : 0.0;
                var maternalHIVStatusAnswer = Math.Round(maternalHIVStatusAvg);

                //2 Early ANC clinic visit - Number & Proportion (%) of pregnant women who visited the clinic before 20 weeks
                var firstVisits = hcwVisits
                                .Where(x => hcwMotherIds.Contains((Guid)x.MotherId)).GroupBy(l => l.MotherId)
                                .Select(g => g.OrderBy(c => c.PlannedVisitDate).FirstOrDefault())
                                .ToList();
                var allVisitsBefore20WeeksCount = firstVisits.Where(x => hcwMotherIds.Contains((Guid)x.MotherId) &&
                                                             x.Mother.ExpectedDateOfDelivery.HasValue &&
                                                             x.PlannedVisitDate <= x.Mother.ExpectedDateOfDelivery.Value.AddDays(-280)).Select(x => x.MotherId).Distinct().Count();
                var earlyVisitsAvg = hcwMotherIds.Count != 0 ? ((double)allVisitsBefore20WeeksCount / (double)hcwMotherIds.Count * 100) : 0.0;
                var earlyVisitsAnswer = Math.Round(earlyVisitsAvg);

                //3 Maternal Mental Health - Number & Proportion (%) of mothers who failed Maternal Distress screening
                var allMaternalDistressData = hcwVisitData.Where(x => x.VisitSection == "Maternal distress screening").Distinct().ToList();
                var maternalDistressFailedCount = allMaternalDistressData.Where(x => x.Question == "Had thoughts and plans to harm yourself or commit suicide?" && x.QuestionAnswer == "true").Count() +
                                                  allMaternalDistressData.Where(x => x.Question == "Had thoughts and plans to harm yourself or commit suicide?" && x.QuestionAnswer == "false" &&
                                                                              (x.Question == "Felt down, depressed or hopeless?" && x.QuestionAnswer == "true" ||
                                                                               x.Question == "Felt unable to stop worrying or thinking too much?" && x.QuestionAnswer == "true")
                                                                              ).Select(x => x.Visit.MotherId).Distinct().Count();
                var allMaternalDistressFailedAvg = hcwMotherIds.Count != 0 ? ((double)maternalDistressFailedCount / (double)hcwMotherIds.Count * 100) : 0.0;
                var allMaternalDistressFailedAnswer = Math.Round(allMaternalDistressFailedAvg);

                var muacData = hcwVisitData.Where(x => x.Question == "What is {client} mid-upper arm circumference (MUAC) today?" && int.Parse(x.QuestionAnswer) < 22).ToList();

                // 4 Malnourished pregnant women - Number & Proportion (%) of pregnant women identified as malnourished in the past month (MUAC less than 22)
                var malnourishedPregnantWomenCount = muacData.Select(x => x.Visit.MotherId).Distinct().Count();
                var malnourishedPregnantWomenAvg = hcwMotherIds.Count != 0 ? ((double)malnourishedPregnantWomenCount / (double)hcwMotherIds.Count * 100) : 0.0;
                var malnourishedPregnantWomenAnswer = Math.Round(malnourishedPregnantWomenAvg);

                // 5 Malnourished new mothers - Number & Proportion (%) of mothers identified as malnourished in the past month (MUAC less than 22)
                var malnourishedNewMothersCount = muacData.Where(x => x.Visit.Mother.InsertedDate.Date >= startDate.Date && x.Visit.Mother.InsertedDate.Date <= endDate.Date).Select(x => x.Visit.MotherId).Distinct().Count();
                var malnourishedNewMothersAvg = hcwMotherIds.Count != 0 ? ((double)malnourishedNewMothersCount / (double)hcwMotherIds.Count * 100) : 0.0;
                var malnourishedNewMothersAnswer = Math.Round(malnourishedNewMothersAvg);

                sheetHeaderData.Add(
                    new List<string>
                    {
                        startDate.ToString("dd-MM-yyyy"),
                        endDate.ToString("dd-MM-yyyy"),
                        quarterText,
                        string.Join(", ", leagueTypes.Distinct()),
                        item.Clinic.SubDistrict.District.Province.Description,
                        item.Clinic.SubDistrict.District.Name,
                        item.Clinic.SubDistrict.Name,
                        item.Clinic.Name,
                        string.Join(", ", otlNames.Distinct()),
                        item.User.FullName,
                        maternalHIVStatusTrueStatusCount.ToString(),
                        maternalHIVStatusAnswer.ToString(),
                        allVisitsBefore20WeeksCount.ToString(),
                        earlyVisitsAnswer.ToString(),
                        maternalDistressFailedCount.ToString(),
                        allMaternalDistressFailedAnswer.ToString(),
                        malnourishedPregnantWomenCount.ToString(),
                        malnourishedPregnantWomenAnswer.ToString(),
                        malnourishedNewMothersCount.ToString(),
                        malnourishedNewMothersAnswer.ToString()
                    });
            }
            return sheetHeaderData;
        }

        private List<List<string>> GetChildHealthSummary(Guid applicationUserId,
                                                        IGenericRepositoryFactory repoFactory,
                                                        List<HealthCareWorker> healthCareWorkers,
                                                        List<Infant> allInfants,
                                                        DateTime startDate,
                                                        DateTime endDate,
                                                        string quarterText)
        {

            var visitDataRepo = repoFactory.CreateGenericRepository<VisitData>(userContext: applicationUserId);
            var visitDataStatusRepo = repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: applicationUserId);
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var breastFeedingRepo = repoFactory.CreateGenericRepository<BreastFeedingClub>(userContext: applicationUserId);

            var allHCWIds = healthCareWorkers.Select(x => x.Id).Distinct().ToList();
            var allCaregivers = healthCareWorkers.Where(x => x.Caregivers.Count > 0).SelectMany(x => x.Caregivers).Distinct().ToList();
            var allCaregiversIds = allCaregivers.Select(x => x.Id).Distinct().ToList();

            var allInfantIds = allInfants.Select(x => x.Id).Distinct().ToList();

            var infantVisits = visitRepo.GetAll().Where(x => x.IsActive && x.InfantId.HasValue && allInfantIds.Contains((Guid)x.InfantId) &&
                                                             x.DueDate.Value.Date >= startDate.Date && x.DueDate.Value <= endDate.Date).Select(x => x.InfantId);

            var allVisitData = visitDataRepo.GetAll().Where(x => allInfantIds.Contains((Guid)x.Visit.InfantId)
                                                            && x.Visit.Attended
                                                            && x.InsertedDate.Date >= startDate.Date
                                                            && x.InsertedDate.Date <= endDate.Date
                                                            && (x.Question == "Is {client} receiving the CSG?" ||
                                                                x.Question == "What did you give {client} to eat or drink in the last 24 hours?" ||
                                                                x.Question == "What is {client} mid-upper arm circumference (MUAC) today?") ||
                                                                x.Question == "Length" ||
                                                                x.Question == "Weight" ||
                                                                x.Question == "Is deworming up to date?" ||
                                                                x.Question == "Is Vitamin A up to date?"
                                                            ).Distinct().ToList();

            var allVisitDataStatus = visitDataStatusRepo.GetAll().Where(x => allInfantIds.Contains((Guid)x.VisitData.Visit.InfantId)
                                                                        && x.VisitData.Visit.Attended
                                                                        && x.InsertedDate.Date >= startDate.Date
                                                                        && x.InsertedDate.Date <= endDate.Date).Distinct().ToList();

            var allClubData = breastFeedingRepo.GetAll().Where(x => allHCWIds.Contains(x.HealthCareWorkerId)
                                                               && x.MeetingDate.Date >= startDate.Date
                                                               && x.MeetingDate.Date >= endDate.Date).Select(x => x.Id).Distinct().ToList();

            var sheetHeaderData = new List<List<string>>
            {
                new List<string>
                {
                   "Start Date", "End Date", "Quarter", "League type", "Province", "District", "Sub-district", "Clinic", "TL", "CHW",
                    "Low Birth Weight", "", "Early Child Support Grant(CSG) access", "", "Breastfeeding Clubs",
                    "Child Dietary Diversity", "", "Child Stunting","",  "Child Stunting-Severe", "", "Moderate Acute Malnutrition", "", "Severe Acute Malnutrition","",
                    "Length Measurements","",  "Weight Measurements","",  "MUAC Measurements","",  "Up-to-date Deworming","",  "Administered Deworming","",  "Up-to-date Vitamin A","",
                    "Administered Vitamin A", "", "Exclusive Breastfeeding under 6 months", ""
                },
                new List<string>
                {
                    "", "", "", "", "", "", "", "", "","",
                    "Nr", "%", "Nr", "%", "Nr", 
                    "Nr", "%", "Nr", "%", "Nr", "%", "Nr", "%", "Nr", "%",
                    "Nr", "%", "Nr", "%", "Nr", "%", "Nr", "%", "Nr", "%", "Nr", "%",
                    "Nr", "%", "Nr", "%"
                }
            };

            foreach (var item in healthCareWorkers)
            {
                var otlNames = item.Clinic.TeamLeads.Select(x => x.TeamLead.User.FullName).Distinct().ToList();
                var leagueTypes = item.Clinic.Leagues.Select(x => x.League.LeagueType.Name).Distinct().ToList();

                var hcwCaregiverIds = item.Caregivers.Where(x => x.IsActive).Select(x => x.Id).Distinct().ToList();
                var hcwInfants = allInfants.Where(x => hcwCaregiverIds.Contains((Guid)x.CaregiverId)).Distinct().ToList();
                var hcwInfantIds = hcwInfants.Select(x => x.Id).Distinct().ToList();
                // this count is looking to all visits that should have taken place for the given period
                var hcwInfantVisitsCount = infantVisits.Where(x => hcwInfantIds.Contains((Guid)x)).Count();
                var hcwInfantsUnder6MonthsIds = 0;// hcwInfants.Where(x => x.AgeMonths <= 6).Select(x => x.Id).ToList();

                var hcwVisitData = allVisitData.Where(x => hcwInfantIds.Contains((Guid)x.Visit.InfantId)).ToList();
                var hcwVisitDataStatus = allVisitDataStatus.Where(x => hcwInfantIds.Contains((Guid)x.VisitData.Visit.InfantId)).ToList();
                var hcwClubData = allClubData.Where(x => x == item.Id).ToList();

                // 1 Low Birth Weight - Number & Proportion (%) of children with birth weight less than 2500g
                var visitBirthWeights = hcwVisitData.Where(x => x.Question == "Weight" && x.QuestionAnswer != "" && x.QuestionAnswer != "undefined").Select(x => decimal.Parse(x.QuestionAnswer, CultureInfo.InvariantCulture)).ToList();
                var lowBirthWeightCount = hcwInfants.Where(x => x.WeightAtBirth.HasValue && x.WeightAtBirth.Value < (decimal)2.5).Count() + visitBirthWeights.Where(x => x < (decimal)2.5).Count();
                var lowBirthWeightAvg = hcwInfants.Count != 0 ? (lowBirthWeightCount / hcwInfants.Count * 100) : 0.0;
                var lowBirthWeightAnswer = Math.Round(lowBirthWeightAvg);

                // 2 Early Child Support Grant (CSG) access - Number & Proportion (%) of children who received the Child Support Grant before 12 months of age
                var infantsBelow12monthsIds = hcwInfants.Where(x => x.User.Age < 1).Select(x => x.Id).Distinct().ToList();
                var csgDataCount = hcwVisitData.Where(x => infantsBelow12monthsIds.Contains((Guid)x.Visit.InfantId) && x.Question == "Is {client} receiving the CSG?" && x.QuestionAnswer == "true").Select(x => x.Visit.InfantId).Distinct().Count();
                var csgDataAvg = hcwInfants.Count != 0 ? ((double)csgDataCount / (double)hcwInfants.Count * 100) : 0.0;
                var csgDataAnswer = Math.Round(csgDataAvg);

                // 3 Breastfeeding Clubs - Number of Breastfeeding clubs hosted this month
                var breastfeedingClubCount = hcwClubData.Count();

                // 4 Child Dietary Diversity - Number and Proportion (%) of children over 6 months of age who consumed 5 or more food groups in the past 24 hours
                var infantsOver6monthsIds = hcwInfants.Select(x => x.Id).Distinct().ToList();
                var childDietaryDiversityData = hcwVisitData.Where(x => infantsOver6monthsIds.Contains((Guid)x.Visit.InfantId) && x.Question == "What did you give {client} to eat or drink in the last 24 hours?").Distinct().ToList();
                var childDietaryDiversityDict = new Dictionary<string, int>();
                foreach (var vData in childDietaryDiversityData)
                {
                    var answers = 0;
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_1) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_2) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_3) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_4) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_5) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_6) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_7) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_8) != -1)
                    {
                        answers++;
                    }
                    if (answers > 4)
                    {
                        if (!childDietaryDiversityDict.ContainsKey(vData.Visit.InfantId.ToString()))
                        {
                            childDietaryDiversityDict.Add(vData.Visit.InfantId.ToString(), answers);
                        }
                    }
                }
                var childDietaryDiversityCount = childDietaryDiversityDict.Count;
                var childDietaryDiversityAvg = hcwInfants.Count != 0 ? ((double)childDietaryDiversityCount / (double)hcwInfants.Count * 100) : 0.0;
                var childDietaryDiversityAnswer = Math.Round(childDietaryDiversityAvg);

                // 5 Child Stunting - Number and Proportion (%) of children stunted (< -2SD)
                var childStuntedCount = hcwVisitDataStatus.Where(x => hcwInfantIds.Contains((Guid)x.VisitData.Visit.InfantId) && x.Comment == "Stunted" && x.VisitData.Question == "Length").Select(x => x.VisitData.Visit.InfantId).Distinct().Count();
                var childStuntedAvg = hcwInfants.Count != 0 ? ((double)childStuntedCount / (double)hcwInfants.Count * 100) : 0.0;
                var childStuntedAnswer = Math.Round(childStuntedAvg);

                // 6 Child Stunting - Severe Number and Proportion (%) of children severely stunted (<- 3SD)
                var childStuntedSevereCount = hcwVisitDataStatus.Where(x => hcwInfantIds.Contains((Guid)x.VisitData.Visit.InfantId) && x.Comment == "Severely stunted" && x.VisitData.Question == "Length").Select(x => x.VisitData.Visit.InfantId).Distinct().Count();
                var childStuntedSevereAvg = hcwInfants.Count != 0 ? ((double)childStuntedSevereCount / (double)hcwInfants.Count * 100) : 0.0;
                var childStuntedSevereAnswer = Math.Round(childStuntedSevereAvg);

                // 7 Moderate Acute Malnutrition - Number and Proportion (%) of children with moderate acute malnutrition (MUAC is between 11.5-12.4)
                var moderateAcuteMalnutritionCount = hcwVisitData.Where(x => hcwInfantIds.Contains((Guid)x.Visit.InfantId) && x.Question == "What is {client} mid-upper arm circumference (MUAC) today?" && int.Parse(x.QuestionAnswer) >= 11.5 && int.Parse(x.QuestionAnswer) <= 12.4).Select(x => x.Visit.InfantId).Distinct().Count();
                var moderateAcuteMalnutritionAvg = hcwInfants.Count != 0 ? ((double)moderateAcuteMalnutritionCount / (double)hcwInfants.Count * 100) : 0.0;
                var moderateAcuteMalnutritionAnswer = Math.Round(moderateAcuteMalnutritionAvg);

                // 8 Severe Acute Malnutrition - Number and Proportion (%) of children with severe acute malnutrition (MUAC is less than 11.5)
                var severeAcuteMalnutritionCount = hcwVisitData.Where(x => hcwInfantIds.Contains((Guid)x.Visit.InfantId) && x.Question == "What is {client} mid-upper arm circumference (MUAC) today?" && int.Parse(x.QuestionAnswer) < 11.5).Select(x => x.Visit.InfantId).Distinct().Count();
                var severeAcuteMalnutritionAvg = hcwInfants.Count != 0 ? ((double)severeAcuteMalnutritionCount / (double)hcwInfants.Count * 100) : 0.0;
                var severeAcuteMalnutritionAnswer = Math.Round(severeAcuteMalnutritionAvg);

                // 9 Length Measurements - Number and Proportion (%) of children whose length was measured
                var lengthMeasuredCount = hcwVisitData.Where(x => hcwInfantIds.Contains((Guid)x.Visit.InfantId) && x.VisitSection == "Growth monitoring (Weight & length)" && x.Question == "Length").Select(x => x.Visit.InfantId).Distinct().Count();
                var lengthMeasuredAvg = hcwInfants.Count != 0 ? ((double)lengthMeasuredCount / (double)hcwInfants.Count * 100) : 0.0;
                var lengthMeasuredAnswer = Math.Round(lengthMeasuredAvg);

                // 10 Weight Measurments - Number and Proportion (%) of children whose height was measured
                var weightMeasuredCount = hcwVisitData.Where(x => hcwInfantIds.Contains((Guid)x.Visit.InfantId) && x.VisitSection == "Growth monitoring (Weight & length)" && x.Question == "Weight").Select(x => x.Visit.InfantId).Distinct().Count();
                var weightMeasuredAvg = hcwInfants.Count != 0 ? ((double)weightMeasuredCount / (double)hcwInfants.Count * 100) : 0.0;
                var weightMeasuredAnswer = Math.Round(weightMeasuredAvg);

                // 11 MUAC Measurments - Number and Proportion (%) of children whose MUAC was measured
                var muacMeasurementsCount = hcwVisitData.Where(x => hcwInfantIds.Contains((Guid)x.Visit.InfantId) && x.Question == "What is {client} mid-upper arm circumference (MUAC) today?").Select(x => x.Visit.InfantId).Distinct().Count();
                var muacMeasurementsAvg = hcwInfants.Count != 0 ? ((double)muacMeasurementsCount / (double)hcwInfants.Count * 100) : 0.0;
                var muacMeasurementsAnswer = Math.Round(muacMeasurementsAvg);

                // 12 Up-to-date Deworming - Number and Proportion (%) of children are up to date with their deworming dosages
                var dewormingCount = hcwVisitData.Where(x => hcwInfantIds.Contains((Guid)x.Visit.InfantId) && x.Question == "Is deworming up to date?" && x.QuestionAnswer == "true").Select(x => x.Visit.InfantId).Distinct().Count();
                var dewormingAvg = hcwInfants.Count != 0 ? ((double)dewormingCount / (double)hcwInfants.Count * 100) : 0.0;
                var dewormingAnswer = Math.Round(dewormingAvg);

                // 13 Administered Deworming - Number of deworming dosages administeredby CHWs this past month
                // total visits completed for deworming / total children visits that should have taken place during the month 
                var adminDewormingCount = hcwVisitData.Where(x => hcwInfantIds.Contains((Guid)x.Visit.InfantId) && x.Question == "Is deworming up to date?").Select(x => x.VisitId).Distinct().Count();
                var adminDewormingAvg = hcwInfantVisitsCount != 0 ? ((double)adminDewormingCount / (double)hcwInfantVisitsCount * 100) : 0.0;
                var adminDewormingAnswer = Math.Round(adminDewormingAvg);

                // 14 Up-to-date Vitamin A - Number and Proportion (%) of children are up to date with their Vitamin A dosages
                var vitaminACount = hcwVisitData.Where(x => hcwInfantIds.Contains((Guid)x.Visit.InfantId) && x.Question == "Is Vitamin A up to date?" && x.QuestionAnswer == "true").Select(x => x.Visit.InfantId).Distinct().Count();
                var vitaminAAvg = hcwInfants.Count != 0 ? ((double)vitaminACount / (double)hcwInfants.Count * 100) : 0.0;
                var vitaminAAnswer = Math.Round(vitaminAAvg);

                // 15 Administered Vitamin A - Number of Vitamin A dosages administeredby CHWs this past month
                // total visits completed for deworming / total children visits that should have taken place during the month 
                var adminVitaminACount = hcwVisitData.Where(x => hcwInfantIds.Contains((Guid)x.Visit.InfantId) && x.Question == "Is Vitamin A up to date?").Select(x => x.Visit.InfantId).Distinct().Count();
                var adminVitaminAAvg = hcwInfantVisitsCount != 0 ? ((double)adminVitaminACount / (double)hcwInfantVisitsCount * 100) : 0.0;
                var adminVitaminAnswer = Math.Round(adminVitaminAAvg);

                // 16 Exclusive Breastfeeding under 6 months - Children under 6 months who where exclusively breastfeed
                var breastfeedUnder6MonthsCount = 0;
                //var breastfeedUnder6MonthsCount = hcwVisitData.Where(x => hcwInfantsUnder6MonthsIds.Contains((Guid)x.Visit.InfantId) 
                //                                                    && x.Question == "What did you give {client} to eat or drink in the last 24 hours?"
                //                                                     && x.QuestionAnswer == "Breast milk only").Select(x => x.Visit.InfantId).Distinct().Count();
                // var breastfeedUnder6MonthsAvg = hcwInfantsUnder6MonthsIds.Count != 0 ? ((double)breastfeedUnder6MonthsCount / (double)hcwInfantsUnder6MonthsIds.Count * 100) : 0.0; 
                var breastfeedUnder6MonthsAnswer = "";//Math.Round(breastfeedUnder6MonthsAvg);

                sheetHeaderData.Add(
                    new List<string>
                    {
                        startDate.ToString("dd-MM-yyyy"),
                        endDate.ToString("dd-MM-yyyy"),
                        quarterText,
                        string.Join(", ", leagueTypes.Distinct()),
                        item.Clinic.SubDistrict.District.Province.Description,
                        item.Clinic.SubDistrict.District.Name,
                        item.Clinic.SubDistrict.Name,
                        item.Clinic.Name,
                        string.Join(", ", otlNames.Distinct()),
                        item.User.FullName,
                        lowBirthWeightCount.ToString(),
                        lowBirthWeightAnswer.ToString(),
                        csgDataCount.ToString(),
                        csgDataAnswer.ToString(),
                        breastfeedingClubCount.ToString(),
                        childDietaryDiversityCount.ToString(),
                        childDietaryDiversityAnswer.ToString(),
                        childStuntedCount.ToString(),
                        childStuntedAnswer.ToString(),
                        childStuntedSevereCount.ToString(),
                        childStuntedSevereAnswer.ToString(),
                        moderateAcuteMalnutritionCount.ToString(),
                        moderateAcuteMalnutritionAnswer.ToString(),
                        severeAcuteMalnutritionCount.ToString(),
                        severeAcuteMalnutritionAnswer.ToString(),
                        lengthMeasuredCount.ToString(),
                        lengthMeasuredAnswer.ToString(),
                        weightMeasuredCount.ToString(),
                        weightMeasuredAnswer.ToString(),
                        muacMeasurementsCount.ToString(),
                        muacMeasurementsAnswer.ToString(),
                        dewormingCount.ToString(),
                        dewormingAnswer.ToString(),
                        adminDewormingCount.ToString(),
                        adminDewormingAnswer.ToString(),
                        vitaminACount.ToString(),
                        vitaminAAnswer.ToString(),
                        adminVitaminACount.ToString(),
                        adminVitaminAnswer.ToString(),
                        breastfeedUnder6MonthsCount.ToString(),
                        breastfeedUnder6MonthsAnswer.ToString()
                    });
            }
            return sheetHeaderData;
        }

        private List<List<string>> GetReferralSummary(Guid applicationUserId,
                                                        IGenericRepositoryFactory repoFactory,
                                                        List<HealthCareWorker> healthCareWorkers,
                                                        List<Infant> allInfants,
                                                        DateTime startDate,
                                                        DateTime endDate,
                                                        string quarterText)
        {

            var visitReferralTypeRepo = repoFactory.CreateGenericRepository<VisitDataStatusReferralType>(userContext: applicationUserId);
            var backReferralTypeRepo = repoFactory.CreateGenericRepository<VisitBackReferral>(userContext: applicationUserId);
            var visitDataRepo = repoFactory.CreateGenericRepository<VisitData>(userContext: applicationUserId);
            var visitDataStatusRepo = repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: applicationUserId);

            var allCaregivers = healthCareWorkers.Where(x => x.Caregivers.Count > 0).SelectMany(x => x.Caregivers).Distinct().ToList();
            var allCaregiversIds = allCaregivers.Select(x => x.Id).Distinct().ToList();
            var allInfantIds = allInfants.Select(x => x.Id).Distinct().ToList();

            var allInfantVisitReferrals = visitReferralTypeRepo.GetAll().Where(x => allInfantIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.InfantId) &&
                                                                        x.VisitDataStatus.VisitData.Visit.Attended &&
                                                                        x.VisitDataStatus.VisitData.InsertedDate.Date >= startDate.Date &&
                                                                        x.VisitDataStatus.VisitData.InsertedDate.Date <= endDate.Date).Distinct().ToList();

            var allMothers = healthCareWorkers.Where(x => x.Mothers.Count > 0).SelectMany(x => x.Mothers).Distinct().ToList();
            var allMotherIds = allMothers.Select(x => x.Id).Distinct().ToList();

            var allMotherVisitReferrals = visitReferralTypeRepo.GetAll().Where(x => allMotherIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.MotherId) &&
                                                                                x.VisitDataStatus.VisitData.Visit.Attended &&
                                                                                x.VisitDataStatus.VisitData.InsertedDate.Date >= startDate.Date &&
                                                                                x.VisitDataStatus.VisitData.InsertedDate.Date <= endDate.Date).Distinct().ToList();

            var allBreastfeedingReferrals = visitDataRepo.GetAll().Where(x => allMotherIds.Contains((Guid)x.Visit.InfantId)
                                                            && x.Visit.Attended
                                                            && x.InsertedDate.Date >= startDate.Date
                                                            && x.InsertedDate.Date <= endDate.Date
                                                            && x.Question == "Would you like to join a breastfeeding club?").Distinct().ToList();

            var sheetHeaderData = new List<List<string>>
            {
                new List<string>
                {
                    "Start Date", "End Date", "Quarter", "League type", "Province", "District", "Sub-district", "Clinic", "TL", "CHW",
                    "Pregnancy / ANC Referrals", "", "Maternal Distress Referrals",  "","Maternal Malnutrition Referrals", "",
                    "Substance Abuse Referrals",  "","Child Support Grant Referrals", "", "Breastfeeding Club Referrals", "",
                    "Developmental Delay Referrals", "", "Growth Faltering Referrals",  "","Vitamin A Referrals", "",
                    "Deworming Referrals", "", "Back Referrals", ""
                },
                new List<string>
                {
                    "", "", "", "", "", "", "", "", "","",
                    "Nr", "%", "Nr", "%", "Nr", "%",
                    "Nr", "%", "Nr", "%", "Nr", "%",
                    "Nr", "%", "Nr", "%", "Nr", "%",
                    "Nr", "%", "Nr", "%"
                }
            };

            foreach (var item in healthCareWorkers)
            {
                var otlNames = item.Clinic.TeamLeads.Select(x => x.TeamLead.User.FullName).Distinct().ToList();
                var leagueTypes = item.Clinic.Leagues.Select(x => x.League.LeagueType.Name).Distinct().ToList();

                var hcwCaregiverIds = item.Caregivers.Where(x => x.IsActive).Select(x => x.Id).Distinct().ToList();
                var hcwInfants = allInfants.Where(x => hcwCaregiverIds.Contains((Guid)x.CaregiverId)).Distinct().ToList();
                var hcwInfantIds = hcwInfants.Select(x => x.Id).Distinct().ToList();
                var hcwMotherIds = item.Mothers.Select(x => x.Id).Distinct().ToList();

                var hcwMotherVisitReferrals = allMotherVisitReferrals.Where(x => hcwMotherIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.MotherId)).ToList();
                var hcwInfantVisitReferrals = allInfantVisitReferrals.Where(x => hcwInfantIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.InfantId)).ToList();

                var hcwBackReferrals = hcwInfantVisitReferrals.Where(x => x.VisitDataStatus.BackReferralCompleted == true).Select(x => x.VisitDataStatus).ToList();
                hcwBackReferrals.AddRange(hcwMotherVisitReferrals.Where(x => x.VisitDataStatus.BackReferralCompleted == true).Select(x => x.VisitDataStatus).ToList());

                // 1 Pregnancy/ANC Referrals - Number and Proportion (%) of referrals for Early Identification of Pregnancy
                var pregnancyReferralsCount = hcwMotherVisitReferrals.Where(x => x.ReferralType.Name == "Early identification of pregnancy" &&
                                                                             hcwMotherIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.MotherId))
                                                                     .Select(x => x.VisitDataStatus.VisitData.Visit.MotherId).Distinct().Count();
                var pregnancyReferralsAvg = hcwMotherVisitReferrals.Count != 0 ? ((double)pregnancyReferralsCount / (double)hcwMotherVisitReferrals.Count * 100) : 0.0;
                var pregnancyReferralsAnswer = Math.Round(pregnancyReferralsAvg);

                // 2 Maternal Distress Referrals - Number and Proportion (%) of referrals made for Maternal distress
                var maternalDistressCount = hcwMotherVisitReferrals.Where(x => x.ReferralType.Name == "Maternal distress" &&
                                                                             hcwMotherIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.MotherId))
                                                                   .Select(x => x.VisitDataStatus.VisitData.Visit.MotherId).Distinct().Count();
                var maternalDistressAvg = hcwMotherVisitReferrals.Count != 0 ? ((double)maternalDistressCount / (double)hcwMotherVisitReferrals.Count * 100) : 0.0;
                var maternalDistressAnswer = Math.Round(maternalDistressAvg);

                // 3 Maternal Malnutrition Referrals - Number and Proportion (%) of referrals made for Maternal Malnutrition
                var maternalMalnutritionCount = hcwMotherVisitReferrals.Where(x => x.ReferralType.Name == "Maternal malnutrition" &&
                                                                             hcwMotherIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.MotherId))
                                                                        .Select(x => x.VisitDataStatus.VisitData.Visit.MotherId).Distinct().Count();
                var maternalMalnutritionAvg = hcwMotherVisitReferrals.Count != 0 ? ((double)maternalMalnutritionCount / (double)hcwMotherVisitReferrals.Count * 100) : 0.0;
                var maternalMalnutritionAnswer = Math.Round(maternalMalnutritionAvg);

                // 4 Substance Abuse Referrals - Number and Proportion (%) of referrals  made for Substance Abuse
                var substanceAbuseCount = hcwMotherVisitReferrals.Where(x => x.ReferralType.Name == "Substance abuse" &&
                                                                             hcwMotherIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.MotherId))
                                                                 .Select(x => x.VisitDataStatus.VisitData.Visit.MotherId).Distinct().Count();
                var substanceAbuseAvg = hcwMotherVisitReferrals.Count != 0 ? ((double)substanceAbuseCount / (double)hcwMotherVisitReferrals.Count * 100) : 0.0;
                var substanceAbuseAnswer = Math.Round(substanceAbuseAvg);

                // 5 Child Support Grant Referrals - Number and Proportion (%) of referrals were made for Child Support Grants
                var childSupportCount = hcwInfantVisitReferrals.Where(x => x.ReferralType.Name == "Child support grant" &&
                                                                             hcwInfantIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.InfantId))
                                                                .Select(x => x.VisitDataStatus.VisitData.Visit.InfantId).Distinct().Count();
                var childSupportAvg = hcwInfantVisitReferrals.Count != 0 ? ((double)childSupportCount / (double)hcwInfantVisitReferrals.Count * 100) : 0.0;
                var childSupportAnswer = Math.Round(childSupportAvg);

                // 6 Breastfeeding Club Referrals - Number and Proportion (%) of referrals made to a breastfeeding support club
                var breastfeedClubReferralCount = allBreastfeedingReferrals.Where(x => hcwMotherIds.Contains((Guid)x.Visit.MotherId)
                                                                                  && x.QuestionAnswer == "true").Select(x => x.Visit.MotherId).Distinct().Count();
                var breastfeedClubReferralAvg = allBreastfeedingReferrals.Count != 0 ? ((double)breastfeedClubReferralCount / (double)allBreastfeedingReferrals.Count * 100) : 0.0;
                var breastfeedClubReferralAnswer = Math.Round(breastfeedClubReferralAvg);

                // 7 Developmental Delay Referrals -Number and Proportion (%) of referrals made for developmental delays
                var developmentalDelayCount = hcwInfantVisitReferrals.Where(x => x.ReferralType.Name == "Developmental delays" &&
                                                                             hcwInfantIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.InfantId))
                                                                        .Select(x => x.VisitDataStatus.VisitData.Visit.InfantId).Distinct().Count();
                var developmentalDelayAvg = hcwInfantVisitReferrals.Count != 0 ? ((double)developmentalDelayCount / (double)hcwInfantVisitReferrals.Count * 100) : 0.0;
                var developmentalDelayAnswer = Math.Round(developmentalDelayAvg);

                // 8 Growth Faltering Referrals - Number and Proportion (%) of referrals made for growth faltering
                var growthFalteringCount = hcwInfantVisitReferrals.Where(x => x.ReferralType.Name == "Growth faltering" &&
                                                                             hcwInfantIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.InfantId))
                                                                    .Select(x => x.VisitDataStatus.VisitData.Visit.InfantId).Distinct().Count();
                var growthFalteringAvg = hcwInfantVisitReferrals.Count != 0 ? ((double)growthFalteringCount / (double)hcwInfantVisitReferrals.Count * 100) : 0.0;
                var growthFalteringAnswer = Math.Round(growthFalteringAvg);

                // 9 Vitamin A Referrals - Number and Proportion (%) of referrals made for vitamin A
                var vitaminACount = hcwInfantVisitReferrals.Where(x => x.ReferralType.Name == "Vitamin A not up to date" &&
                                                                             hcwInfantIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.InfantId))
                                                            .Select(x => x.VisitDataStatus.VisitData.Visit.InfantId).Distinct().Count();
                var vitaminAAvg = allInfantVisitReferrals.Count != 0 ? ((double)vitaminACount / (double)allInfantVisitReferrals.Count * 100) : 0.0;
                var vitaminAAverage = Math.Round(vitaminAAvg);

                // 10 Deworming Referrals - Number and Proportion (%) of referrals made for deworming
                var dewormingCount = hcwInfantVisitReferrals.Where(x => x.ReferralType.Name == "Deworming not up to date" &&
                                                                             hcwInfantIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.InfantId))
                                                            .Select(x => x.VisitDataStatus.VisitData.Visit.InfantId).Distinct().Count();
                var dewormingAvg = hcwInfantVisitReferrals.Count != 0 ? ((double)dewormingCount / (double)hcwInfantVisitReferrals.Count * 100) : 0.0;
                var dewormingAverage = Math.Round(dewormingAvg);

                // 11 Back Referrals - Number and Proportion (%) of back referrals did this team receive
                var backReferralsCount = hcwBackReferrals.Where(x => x.VisitData.Visit.MotherId.HasValue && hcwMotherIds.Contains((Guid)x.VisitData.Visit.MotherId) ||
                                                                  x.VisitData.Visit.InfantId.HasValue && hcwInfantIds.Contains((Guid)x.VisitData.Visit.InfantId)).Count();
                var totalReferrals = hcwMotherVisitReferrals.Count + hcwInfantVisitReferrals.Count;
                var backReferralsAvg = totalReferrals != 0 ? ((double)backReferralsCount / (double)totalReferrals * 100) : 0.0;
                var backReferralsAnswer = Math.Round(backReferralsAvg);

                sheetHeaderData.Add(
                    new List<string>
                    {
                        startDate.ToString("dd-MM-yyyy"),
                        endDate.ToString("dd-MM-yyyy"),
                        quarterText,
                        string.Join(", ", leagueTypes.Distinct()),
                        item.Clinic.SubDistrict.District.Province.Description,
                        item.Clinic.SubDistrict.District.Name,
                        item.Clinic.SubDistrict.Name,
                        item.Clinic.Name,
                        string.Join(", ", otlNames.Distinct()),
                        item.User.FullName,
                        pregnancyReferralsCount.ToString(),
                        pregnancyReferralsAnswer.ToString(),
                        maternalDistressCount.ToString(),
                        maternalDistressAnswer.ToString(),
                        maternalMalnutritionCount.ToString(),
                        maternalMalnutritionAnswer.ToString(),
                        substanceAbuseCount.ToString(),
                        substanceAbuseAnswer.ToString(),
                        childSupportCount.ToString(),
                        childSupportAnswer.ToString(),
                        breastfeedClubReferralCount.ToString(),
                        breastfeedClubReferralAnswer.ToString(),
                        developmentalDelayCount.ToString(),
                        developmentalDelayAnswer.ToString(),
                        growthFalteringCount.ToString(),
                        growthFalteringAnswer.ToString(),
                        vitaminACount.ToString(),
                        vitaminAAverage.ToString(),
                        dewormingCount.ToString(),
                        dewormingAverage.ToString(),
                        backReferralsCount.ToString(),
                        backReferralsAnswer.ToString()
                    });
            }
            return sheetHeaderData;
        }

        private List<List<string>> GetOtherSummary(Guid applicationUserId,
                                                    IGenericRepositoryFactory repoFactory,
                                                    List<HealthCareWorker> healthCareWorkers,
                                                    List<Infant> allInfants,
                                                    DateTime startDate,
                                                    DateTime endDate,
                                                    string quarterText)
        {
            var visitDataRepo = repoFactory.CreateGenericRepository<VisitData>(userContext: applicationUserId);
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var visitReferralTypeRepo = repoFactory.CreateGenericRepository<VisitDataStatusReferralType>(userContext: applicationUserId);

            var allMothers = healthCareWorkers.Where(x => x.Mothers.Count > 0).SelectMany(x => x.Mothers.Where(x => x.IsActive)).Distinct().ToList();
            var allMotherIds = allMothers.Select(x => x.Id).Distinct().ToList();
            var allCaregivers = healthCareWorkers.Where(x => x.Caregivers.Count > 0).SelectMany(x => x.Caregivers.Where(x => x.IsActive)).Distinct().ToList();
            var allCaregiversIds = allCaregivers.Select(x => x.Id).Distinct().ToList();

            var allInfantIds = allInfants.Select(x => x.Id).Distinct().ToList();

            var allVisitData = visitDataRepo.GetAll().Where(x => (allInfantIds.Contains((Guid)x.Visit.InfantId) || allMotherIds.Contains((Guid)x.Visit.MotherId))
                                                            && x.Visit.Attended
                                                            && x.InsertedDate.Date >= startDate.Date
                                                            && x.InsertedDate.Date <= endDate.Date
                                                            && (x.Question == "Is {client} HIV positive?" ||
                                                                x.Question == "Does {client} have an ID document?" ||
                                                                x.Question == "Does {client} have a birth certificate?" ||
                                                                x.Question == "Does the caregiver have {client}'s Road to Health Book?" ||
                                                                x.Question == "Tick the danger signs {client} is experiencing:" ||
                                                                x.Question == "What did {client} eat or drink in the last 24 hours?" ||
                                                                x.Question == "Did the baby have the {age} immunisation?" ||
                                                                x.Question == "Did the baby have the 6 month immunisation?" ||
                                                                x.Question == "Does {client} qualify for CSG??" ||
                                                                x.Question == "Has {client} applied for a CSG?" ||
                                                                x.Question == "Why has {client} not applied for a CSG?" ||
                                                                x.Question == "What did {client} eat?")
                                                                ).Distinct().ToList();

            var developmentScreeningData = visitDataRepo.GetAll().Where(x => (allInfantIds.Contains((Guid)x.Visit.InfantId))
                                                            && x.Visit.Attended
                                                            && x.InsertedDate.Date >= startDate.Date
                                                            && x.InsertedDate.Date <= endDate.Date
                                                            && x.VisitSection == "Developmental screening").Distinct().ToList();

            var allVisits = visitRepo.GetAll().Where(x => x.IsActive && x.Attended && (allInfantIds.Contains((Guid)x.InfantId) || allMotherIds.Contains((Guid)x.MotherId))).Distinct().ToList();

            var allInfantVisitReferrals = visitReferralTypeRepo.GetAll().Where(x => x.VisitDataStatus.VisitData.Visit.InfantId.HasValue &&
                                                                        allInfantIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.InfantId) &&
                                                                       x.VisitDataStatus.VisitData.Visit.Attended &&
                                                                       x.VisitDataStatus.VisitData.InsertedDate.Date >= startDate.Date &&
                                                                       x.VisitDataStatus.VisitData.InsertedDate.Date <= endDate.Date
                                                                       && (x.ReferralType.Name == "Child birth certificate" ||
                                                                            x.ReferralType.Name == "Child support grant" ||
                                                                            x.ReferralType.Name == "Clinic visits not up to date" ||
                                                                            x.ReferralType.Name == "Danger signs - child" ||
                                                                            x.ReferralType.Name == "Developmental delays" ||
                                                                            x.ReferralType.Name == "Deworming not up to date" ||
                                                                            x.ReferralType.Name == "Early identification of pregnancy" ||
                                                                            x.ReferralType.Name == "Growth faltering" ||
                                                                            x.ReferralType.Name == "Immunisation not up to date" ||
                                                                            x.ReferralType.Name == "Low birth length" ||
                                                                            x.ReferralType.Name == "Low birth weight" ||
                                                                            x.ReferralType.Name == "Moderate acute malnutrition" ||
                                                                            x.ReferralType.Name == "Obese" ||
                                                                            x.ReferralType.Name == "Overweight" ||
                                                                            x.ReferralType.Name == "Severe acute malnutrition" ||
                                                                            x.ReferralType.Name == "Severely stunted" ||
                                                                            x.ReferralType.Name == "Severely underweight" ||
                                                                            x.ReferralType.Name == "Stunted" ||
                                                                            x.ReferralType.Name == "Underweight" ||
                                                                            x.ReferralType.Name == "Vitamin A not up to date")).Distinct().ToList();

            var allMotherVisitReferrals = visitReferralTypeRepo.GetAll().Where(x => x.VisitDataStatus.VisitData.Visit.MotherId.HasValue &&
                                                                                allMotherIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.MotherId) &&
                                                                                x.VisitDataStatus.VisitData.Visit.Attended &&
                                                                                x.VisitDataStatus.VisitData.InsertedDate.Date >= startDate.Date &&
                                                                                x.VisitDataStatus.VisitData.InsertedDate.Date <= endDate.Date &&
                                                                                (x.ReferralType.Name == "Caregiver ID book" ||
                                                                                    x.ReferralType.Name == "Clinic visits not up to date" ||
                                                                                    x.ReferralType.Name == "Danger signs - child's mother" ||
                                                                                    x.ReferralType.Name == "Danger signs - pregnant mom" ||
                                                                                    x.ReferralType.Name == "Maternal distress" ||
                                                                                    x.ReferralType.Name == "Maternal malnutrition" ||
                                                                                    x.ReferralType.Name == "Substance abuse")
                                                                                ).Distinct().ToList();


            var sheetHeaderData = new List<List<string>>
            {
                new List<string>
                {
                    "Start Date", "End Date", "Quarter", "League type", "Province", "District", "Sub-district", "Clinic", "TL", "CHW",
                    "Scheduled visits", "",
                    "Completed visits", "",
                    "Child HIV number & proportion", "",
                    "Mother has ID", "",
                    "Child has birth certificate", "",
                    "Child has Road to Health booklet", "",
                    "Danger signs: child & mother", "",
                    "Child feeding: formula, mixed feeding", "",
                    "Maternal Diet", "",
                    "Child clinic visits", "",
                    "Age relevant Immunizations up to date", "",
                    "ANC visit completed", "",
                    "Child development screening", "",
                    "Child Support Grant: qualified", "",
                    "Child Support Grant: applied", "",
                    "Child Support Grant: reasons for not applying",
                    "Child Referrals", "",
                    "Mother Referrals", ""
                },
                new List<string>
                {
                    "", "", "", "", "", "", "", "", "","",
                    "Nr", "%", "Nr", "%","Nr", "%","Nr", "%",
                    "Nr", "%","Nr", "%","Nr", "%","Nr", "%",
                    "Nr", "%","Nr", "%","Nr", "%","Nr", "%",
                    "Nr", "%",
                    "Nr", "%",
                    "Nr", "%",
                    "Reasons", "Nr", "%","Nr", "%",
                }
            };

            foreach (var item in healthCareWorkers)
            {
                var otlNames = item.Clinic.TeamLeads.Select(x => x.TeamLead.User.FullName).Distinct().ToList();
                var leagueTypes = item.Clinic.Leagues.Select(x => x.League.LeagueType.Name).Distinct().ToList();

                var hcwMothersIds = item.Mothers.Where(x => x.IsActive).Select(x => x.Id).Distinct().ToList();
                var hcwCaregiverIds = item.Caregivers.Where(x => x.IsActive).Select(x => x.Id).Distinct().ToList();
                var hcwInfants = allInfants.Where(x => x.IsActive && hcwCaregiverIds.Contains((Guid)x.CaregiverId)).Distinct().ToList();
                var hcwInfantIds = hcwInfants.Select(x => x.Id).Distinct().ToList();

                var hcwVisitData = allVisitData.Where(x => (x.Visit.InfantId.HasValue && hcwInfantIds.Contains((Guid)x.Visit.InfantId) ||
                                                            x.Visit.MotherId.HasValue && hcwMothersIds.Contains((Guid)x.Visit.MotherId))
                                                            ).Distinct().ToList();
                var hcwVisits = allVisits.Where(x => x.InfantId.HasValue && hcwInfantIds.Contains((Guid)x.InfantId) || x.MotherId.HasValue && hcwMothersIds.Contains((Guid)x.MotherId)).Distinct().ToList();
                var hcwDevelopmentScreeningData = developmentScreeningData.Where(x => (x.Visit.InfantId.HasValue && hcwInfantIds.Contains((Guid)x.Visit.InfantId))
                                                            ).Distinct().ToList();

                var hcwInfantVisitReferrals = allInfantVisitReferrals.Where(x => hcwInfantIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.InfantId)).ToList();
                var hcwMotherVisitReferrals = allMotherVisitReferrals.Where(x => hcwMothersIds.Contains((Guid)x.VisitDataStatus.VisitData.Visit.MotherId)).ToList();


                // 1 Scheduled visits: Total, overdue, upcoming
                var scheduledVisitsCount = hcwVisits.Where(x => !x.Attended && x.DueDate.Value > DateTime.Now.Date).Distinct().Count();
                var scheduledVisitsAvg = hcwVisits.Count != 0 ? ((double)scheduledVisitsCount / (double)hcwVisits.Count * 100) : 0.0;
                var scheduledVisitsAnswer = Math.Round(scheduledVisitsAvg);

                // 2 Completed visits: Total, answered questions
                var completedVisitsCount = hcwVisits.Where(x => x.Attended).Distinct().Count();
                var completedVisitsAvg = hcwVisits.Count != 0 ? ((double)completedVisitsCount / (double)hcwVisits.Count * 100) : 0.0;
                var completedVisitsAnswer = Math.Round(completedVisitsAvg);

                // 3 Child HIV number & proportion
                var allChildHIVCount = hcwVisitData.Where(x => x.Question == "Is {client} HIV positive?").Select(x => x.Visit.InfantId).Distinct().Count();
                var childHIVCount = hcwVisitData.Where(x => x.Question == "Is {client} HIV positive?" && x.QuestionAnswer == "true").Select(x => x.Visit.InfantId).Distinct().Count();
                var childHIVAvg = allChildHIVCount != 0 ? ((double)childHIVCount / (double)allChildHIVCount * 100) : 0.0;
                var childHIVAnswer = Math.Round(childHIVAvg);

                // 4 Mother has ID
                var allMotherIDCount = hcwVisitData.Where(x => x.Question == "Does {client} have an ID document?").Select(x => x.Visit.MotherId).Distinct().Count();
                var motherIDCount = hcwVisitData.Where(x => x.Question == "Does {client} have an ID document?" && x.QuestionAnswer == "true").Select(x => x.Visit.MotherId).Distinct().Count();
                var motherIdAvg = allMotherIDCount != 0 ? ((double)motherIDCount / (double)allMotherIDCount * 100) : 0.0;
                var motherIdAnswer = Math.Round(motherIdAvg);

                // 5 "Child has birth certificate",
                var allChildBirthCount = hcwVisitData.Where(x => x.Question == "Does {client} have a birth certificate?").Select(x => x.Visit.InfantId).Distinct().Count();
                var childBirthCount = hcwVisitData.Where(x => x.Question == "Does {client} have a birth certificate?" && x.QuestionAnswer == "true").Select(x => x.Visit.InfantId).Distinct().Count();
                var childBirthAvg = allChildBirthCount != 0 ? ((double)childBirthCount / (double)allChildBirthCount * 100) : 0.0;
                var childBirthAnswer = Math.Round(childBirthAvg);

                // 6 "Child has Road to Health booklet",
                var allHealthBookletCount = hcwVisitData.Where(x => x.Question == "Does the caregiver have {client}'s Road to Health Book?").Select(x => x.Visit.InfantId).Distinct().Count();
                var healthBookletCount = hcwVisitData.Where(x => x.Question == "Does the caregiver have {client}'s Road to Health Book?" && x.QuestionAnswer == "true").Select(x => x.Visit.InfantId).Distinct().Count();
                var healthBookletAvg = allHealthBookletCount != 0 ? ((double)healthBookletCount / (double)allHealthBookletCount * 100) : 0.0;
                var healthBookletAnswer = Math.Round(healthBookletAvg);

                // 7 "Danger signs: child & mother",
                var allDangerSignsCount = hcwVisitData.Where(x => x.Question == "Tick the danger signs {client} is experiencing:").Select(x => x.VisitId).Distinct().Count();
                var dangerSignsCount = hcwVisitData.Where(x => x.Question == "Tick the danger signs {client} is experiencing:" && x.QuestionAnswer != "None of the above").Select(x => x.VisitId).Distinct().Count();
                var dangerSignsAvg = allDangerSignsCount != 0 ? ((double)dangerSignsCount / (double)allDangerSignsCount * 100) : 0.0;
                var dangerSignsAnswer = Math.Round(dangerSignsAvg);

                // 8 "Child feeding: formula, mixed feeding",
                var allChildFeedingCount = hcwVisitData.Where(x => x.Question == "What did {client} eat or drink in the last 24 hours?").Select(x => x.Visit.InfantId).Distinct().Count();
                var childFeedingCount = hcwVisitData.Where(x => x.Question == "What did {client} eat or drink in the last 24 hours?" && (x.QuestionAnswer == "Formula milk only" || x.QuestionAnswer == "Mixed feeding")).Select(x => x.Visit.InfantId).Distinct().Count();
                var childFeedingAvg = allChildFeedingCount != 0 ? ((double)childFeedingCount / (double)allChildBirthCount * 100) : 0.0;
                var childFeedingAnswer = Math.Round(childFeedingAvg);

                // 9 "Maternal Diet"
                var maternalDietData = hcwVisitData.Where(x => x.Question == "What did {client} eat?").ToList();
                var maternalDietDict = new Dictionary<string, int>();
                foreach (var vData in maternalDietData)
                {
                    var answers = 0;
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_2) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_3) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_4) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_5) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_6) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_7) != -1)
                    {
                        answers++;
                    }
                    if (vData.QuestionAnswer.IndexOf(GGSettings.p1_8) != -1)
                    {
                        answers++;
                    }
                    if (answers > 4)
                    {
                        if (!maternalDietDict.ContainsKey(vData.Visit.MotherId.ToString()))
                        {
                            maternalDietDict.Add(vData.Visit.MotherId.ToString(), answers);
                        }
                    }
                }
                var maternalDietCount = maternalDietDict.Count;
                var maternalDietAvg = hcwMothersIds.Count != 0 ? ((double)maternalDietCount / (double)hcwMothersIds.Count * 100) : 0.0;
                var maternalDietAnswer = Math.Round(maternalDietAvg);

                // 10 "Child clinic visits",
                var childClinicVisitCount = hcwVisits.Where(x => x.Attended && x.InfantId.HasValue && hcwInfantIds.Contains((Guid)x.InfantId)).Select(x => x.InfantId).Distinct().Count();
                var childClinicVisitAvg = hcwInfants.Count != 0 ? ((double)childClinicVisitCount / (double)hcwInfants.Count * 100) : 0.0;
                var childClinicVisitAnswer = Math.Round(childClinicVisitAvg);

                // 11 "Age relevant Immunizations up to date",
                var allImmunisationsCount = hcwVisitData.Where(x => (x.Question == "Did the baby have the {age} immunisation?" || x.Question == "Did the baby have the 6 month immunisation?")).Select(x => x.Visit.InfantId).Distinct().Count();
                var immunisationsCount = hcwVisitData.Where(x => (x.Question == "Did the baby have the {age} immunisation?" || x.Question == "Did the baby have the 6 month immunisation?") && x.QuestionAnswer == "true").Select(x => x.Visit.InfantId).Distinct().Count();
                var immunisationsAvg = allImmunisationsCount != 0 ? ((double)immunisationsCount / (double)allImmunisationsCount * 100) : 0.0;
                var immunisationsAnswer = Math.Round(immunisationsAvg);

                // 12 "ANC visit completed",
                var ANCVisitCompletedCount = hcwVisits.Where(x => x.Attended && x.MotherId.HasValue && hcwMothersIds.Contains((Guid)x.MotherId)).Select(x => x.MotherId).Distinct().Count();
                var ANCVisitCompletedAvg = hcwMothersIds.Count != 0 ? ((double)ANCVisitCompletedCount / (double)hcwMothersIds.Count * 100) : 0.0;
                var ANCVisitCompletedAnswer = Math.Round(ANCVisitCompletedAvg);

                // 13 "Child development screening",
                var childDevelopmentScreeningCount = hcwDevelopmentScreeningData.Select(x => x.Visit.InfantId).Distinct().Count();
                var childDevelopmentScreeningAvg = hcwInfants.Count != 0 ? ((double)childDevelopmentScreeningCount / (double)hcwInfants.Count * 100) : 0.0;
                var childDevelopmentScreeningAnswer = Math.Round(childDevelopmentScreeningAvg);

                // 14 "Child Support Grant: qualified",
                var allCSGQualifiedCount = hcwVisitData.Where(x => x.Question == "Does {client} qualify for CSG?").Select(x => x.Visit.InfantId).Distinct().Count();
                var cSGQualifiedCount = hcwVisitData.Where(x => x.Question == "Does {client} qualify for CSG?" && x.QuestionAnswer == "true").Select(x => x.Visit.InfantId).Distinct().Count();
                var cSGQualifiedAvg = allCSGQualifiedCount != 0 ? ((double)cSGQualifiedCount / (double)allCSGQualifiedCount * 100) : 0.0;
                var cSGQualifiedAnswer = Math.Round(cSGQualifiedAvg);

                // 15 "Child Support Grant: applied",
                var allCSGAppliedCount = hcwVisitData.Where(x => x.Question == "Has {client} applied for a CSG?").Select(x => x.Visit.InfantId).Distinct().Count();
                var cSGAppliedCount = hcwVisitData.Where(x => x.Question == "Has {client} applied for a CSG?" && x.QuestionAnswer == "true").Select(x => x.Visit.InfantId).Distinct().Count();
                var cSGAppliedAvg = allCSGAppliedCount != 0 ? ((double)cSGAppliedCount / (double)allCSGAppliedCount * 100) : 0.0;
                var cSGAppliedAnswer = Math.Round(cSGAppliedAvg);

                // 16 "Child Support Grant: reasons for not applying",
                //var allCSGReasonsCount = hcwVisitData.Where(x => x.Question == "Why has {client} not applied for a CSG?").Select(x => x.Visit.InfantId).Distinct().Count();
                //var cSGReasonCount = hcwVisitData.Where(x => x.Question == "Why has {client} not applied for a CSG?" && x.QuestionAnswer != "").Select(x => x.Visit.InfantId).Distinct().Count();
                //var cSGReasonAvg = allCSGReasonsCount != 0 ? ((double)cSGReasonCount / (double)allCSGReasonsCount * 100) : 0.0;
                //var cSGReasonAnswer = Math.Round(cSGReasonAvg);
                var cSGReasonAnswer = hcwVisitData.Where(x => x.Question == "Why has {client} not applied for a CSG?" && x.QuestionAnswer != "").Select(x => x.QuestionAnswer).Distinct().ToList();

                // 17 "Child Referrals: Birth certificate, Clinic check up, danger signs, immunizations",
                var childReferralsCount = hcwInfantVisitReferrals.Select(x => x.Id).Distinct().Count();
                var childReferralsAvg = hcwInfants.Count != 0 ? ((double)childReferralsCount / (double)hcwInfants.Count * 100) : 0.0;
                var childReferralsAnswer = Math.Round(childReferralsAvg);

                // 18 "Mother Referrals: clinic visit, danger signs, ID document, MUAC"
                var motherReferralsCount = hcwMotherVisitReferrals.Select(x => x.Id).Distinct().Count();
                var motherReferralsAvg = hcwMothersIds.Count != 0 ? ((double)motherReferralsCount / (double)hcwMothersIds.Count * 100) : 0.0;
                var motherReferralsAnswer = Math.Round(motherReferralsAvg);

                sheetHeaderData.Add(
                    new List<string>
                    {
                        startDate.ToString("dd-MM-yyyy"),
                        endDate.ToString("dd-MM-yyyy"),
                        quarterText,
                        string.Join(", ", leagueTypes.Distinct()),
                        item.Clinic.SubDistrict.District.Province.Description,
                        item.Clinic.SubDistrict.District.Name,
                        item.Clinic.SubDistrict.Name,
                        item.Clinic.Name,
                        string.Join(", ", otlNames.Distinct()),
                        item.User.FullName,
                        scheduledVisitsCount.ToString(),
                        scheduledVisitsAnswer.ToString(),
                        completedVisitsCount.ToString(),
                        completedVisitsAnswer.ToString(),
                        childHIVCount.ToString(),
                        childHIVAnswer.ToString(),
                        motherIDCount.ToString(),
                        motherIdAnswer.ToString(),
                        childBirthCount.ToString(),
                        childBirthAnswer.ToString(),
                        healthBookletCount.ToString(),
                        healthBookletAnswer.ToString(),
                        dangerSignsCount.ToString(),
                        dangerSignsAnswer.ToString(),
                        childFeedingCount.ToString(),
                        childFeedingAnswer.ToString(),
                        maternalDietCount.ToString(),
                        maternalDietAnswer.ToString(),
                        childClinicVisitCount.ToString(),
                        childClinicVisitAnswer.ToString(),
                        immunisationsCount.ToString(),
                        immunisationsAnswer.ToString(),
                        ANCVisitCompletedCount.ToString(),
                        ANCVisitCompletedAnswer.ToString(),
                        childDevelopmentScreeningCount.ToString(),
                        childDevelopmentScreeningAnswer.ToString(),
                        cSGQualifiedCount.ToString(),
                        cSGQualifiedAnswer.ToString(),
                        cSGAppliedCount.ToString(),
                        cSGAppliedAnswer.ToString(),
                        string.Join(", ", cSGReasonAnswer),
                        childReferralsCount.ToString(),
                        childReferralsAnswer.ToString(),
                        motherReferralsCount.ToString(),
                        motherReferralsAnswer.ToString()
                    });
            }
            return sheetHeaderData;
        }


    }
}
