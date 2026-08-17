using ECDLink.Abstractrions.Constants;
using ECDLink.ContentManagement.Constants;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.Services.ResourceLinkHealth;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services
{
    public class ResourceLinkHealthCheckService : IResourceLinkHealthCheckService
    {
        public const string HttpClientName = "ResourceLinkHealthCheck";

        private readonly ContentManagementRepository _contentRepo;
        private readonly IGenericRepositoryFactory _repoFactory;
        private readonly ILocaleService<Language> _localeService;
        private readonly INotificationService _notificationService;
        private readonly ApplicationUserManager _userManager;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly ILogger<ResourceLinkHealthCheckService> _logger;

        public ResourceLinkHealthCheckService(
            ContentManagementRepository contentRepo,
            IGenericRepositoryFactory repoFactory,
            ILocaleService<Language> localeService,
            INotificationService notificationService,
            ApplicationUserManager userManager,
            IHttpClientFactory httpClientFactory,
            HierarchyEngine hierarchyEngine,
            ILogger<ResourceLinkHealthCheckService> logger)
        {
            _contentRepo = contentRepo;
            _repoFactory = repoFactory;
            _localeService = localeService;
            _notificationService = notificationService;
            _userManager = userManager;
            _httpClientFactory = httpClientFactory;
            _hierarchyEngine = hierarchyEngine;
            _logger = logger;
        }

        public async Task RunHealthChecksAsync(CancellationToken cancellationToken = default)
        {
            var adminUserId = _hierarchyEngine.GetAdminUserId();
            var healthRepo = _repoFactory.CreateGenericRepository<ResourceLinkHealthCheck>(userContext: adminUserId);

            var candidates = CollectResourceLinks();
            var existingRows = healthRepo.GetAll().ToList();
            var existingByKey = existingRows
                .GroupBy(x => (x.ContentType, x.ContentId, x.LocaleId))
                .ToDictionary(g => g.Key, g => g.OrderByDescending(x => x.UpdatedDate).First());

            var uniqueUrls = candidates
                .Select(x => x.NormalizedUrl)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            var checkResults = await CheckUrlsAsync(uniqueUrls, cancellationToken);

            var newlyBroken = new List<ResourceLinkCandidate>();
            var recovered = new List<ResourceLinkCandidate>();
            var stillBroken = new List<ResourceLinkCandidate>();
            var activeKeys = new HashSet<(string ContentType, int ContentId, Guid LocaleId)>();

            foreach (var candidate in candidates)
            {
                cancellationToken.ThrowIfCancellationRequested();
                activeKeys.Add((candidate.ContentType, candidate.ContentId, candidate.LocaleId));

                checkResults.TryGetValue(candidate.NormalizedUrl, out var httpResult);
                var outcome = ResourceLinkHealthEvaluator.Classify(httpResult ?? ResourceLinkHttpCheckResult.Invalid());

                existingByKey.TryGetValue(
                    (candidate.ContentType, candidate.ContentId, candidate.LocaleId),
                    out var existing);

                var transition = ResourceLinkHealthEvaluator.ApplyCheck(
                    existing?.Status,
                    existing?.ConsecutiveFailureCount ?? 0,
                    existing?.Url,
                    candidate.NormalizedUrl,
                    outcome);

                var row = existing ?? new ResourceLinkHealthCheck
                {
                    ContentType = candidate.ContentType,
                    ContentId = candidate.ContentId,
                    LocaleId = candidate.LocaleId,
                };

                row.SectionType = candidate.SectionType;
                row.Title = candidate.Title;
                row.Url = candidate.NormalizedUrl;
                row.Status = transition.ConfirmedStatus;
                row.LastCheckStatus = transition.LastCheckStatus;
                row.LastStatusCode = outcome.StatusCode;
                row.LastError = outcome.Detail;
                row.ConsecutiveFailureCount = transition.ConsecutiveFailureCount;
                row.LastCheckedDate = DateTime.Now;
                row.IsActive = true;
                row.UpdatedDate = DateTime.Now;

                if (existing == null)
                {
                    healthRepo.Insert(row);
                    existingByKey[(candidate.ContentType, candidate.ContentId, candidate.LocaleId)] = row;
                }
                else
                {
                    healthRepo.Update(row);
                }

                candidate.Detail = outcome.Detail ?? (outcome.StatusCode.HasValue ? $"HTTP {outcome.StatusCode}" : null);

                if (transition.IsNewlyBroken)
                {
                    newlyBroken.Add(candidate);
                    row.LastNotifiedDate = DateTime.Now;
                    healthRepo.Update(row);
                }
                else if (transition.IsRecovered)
                {
                    recovered.Add(candidate);
                }
                else if (transition.IsStillBroken)
                {
                    stillBroken.Add(candidate);
                }
            }

            foreach (var stale in existingRows.Where(x => x.IsActive && !activeKeys.Contains((x.ContentType, x.ContentId, x.LocaleId))))
            {
                stale.IsActive = false;
                stale.UpdatedDate = DateTime.Now;
                healthRepo.Update(stale);
            }

            _logger.LogInformation(
                "Resource link health check finished. Checked {Checked}, newly broken {NewlyBroken}, recovered {Recovered}, still broken {StillBroken}",
                candidates.Count,
                newlyBroken.Count,
                recovered.Count,
                stillBroken.Count);

            if (newlyBroken.Count > 0 || recovered.Count > 0)
            {
                await NotifyAdministratorsAsync(newlyBroken, recovered, stillBroken);
            }
        }

        private List<ResourceLinkCandidate> CollectResourceLinks()
        {
            var locales = _localeService.GetAvailableLocale()?.Where(x => x != null).ToList()
                ?? new List<Language>();
            var english = locales.FirstOrDefault(x => string.Equals(x.Locale, "en-za", StringComparison.OrdinalIgnoreCase))
                ?? locales.FirstOrDefault();

            var candidates = new List<ResourceLinkCandidate>();
            if (english == null)
            {
                _logger.LogWarning("Resource link health check skipped: no locales found");
                return candidates;
            }

            var englishUrls = new Dictionary<(string ContentType, int ContentId), string>();
            AddLocaleResources(english, true, englishUrls, candidates);

            foreach (var locale in locales.Where(x => x.Id != english.Id))
            {
                AddLocaleResources(locale, false, englishUrls, candidates);
            }

            return candidates;
        }

        private void AddLocaleResources(
            Language locale,
            bool isEnglish,
            Dictionary<(string ContentType, int ContentId), string> englishUrls,
            List<ResourceLinkCandidate> candidates)
        {
            AddContentItems(
                _contentRepo.GetByValueKey(
                    ContentTypeConstants.ClassroomBusinessResource,
                    "sectionType",
                    ResourceLinkHealthConstants.SectionClassroom,
                    locale.Id),
                ContentTypeConstants.ClassroomBusinessResource,
                ResourceLinkHealthConstants.SectionClassroom,
                locale.Id,
                isEnglish,
                englishUrls,
                candidates);

            AddContentItems(
                _contentRepo.GetByValueKey(
                    ContentTypeConstants.ClassroomBusinessResource,
                    "sectionType",
                    ResourceLinkHealthConstants.SectionBusiness,
                    locale.Id),
                ContentTypeConstants.ClassroomBusinessResource,
                ResourceLinkHealthConstants.SectionBusiness,
                locale.Id,
                isEnglish,
                englishUrls,
                candidates);

            AddContentItems(
                _contentRepo.GetAll(ContentTypeConstants.ConnectItemId, locale.Id),
                ContentTypeConstants.ConnectItem,
                ResourceLinkHealthConstants.SectionCommunity,
                locale.Id,
                isEnglish,
                englishUrls,
                candidates);
        }

        private static void AddContentItems(
            IEnumerable<object> items,
            string contentType,
            string defaultSectionType,
            Guid localeId,
            bool isEnglish,
            Dictionary<(string ContentType, int ContentId), string> englishUrls,
            List<ResourceLinkCandidate> candidates)
        {
            if (items == null)
            {
                return;
            }

            foreach (var item in items)
            {
                if (!TryReadResource(item, defaultSectionType, out var candidate))
                {
                    continue;
                }

                candidate.ContentType = contentType;
                candidate.LocaleId = localeId;

                var key = (contentType, candidate.ContentId);
                if (isEnglish)
                {
                    englishUrls[key] = candidate.NormalizedUrl;
                    candidates.Add(candidate);
                    continue;
                }

                if (englishUrls.TryGetValue(key, out var englishUrl)
                    && string.Equals(englishUrl, candidate.NormalizedUrl, StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                candidates.Add(candidate);
            }
        }

        private static bool TryReadResource(object resource, string defaultSectionType, out ResourceLinkCandidate candidate)
        {
            candidate = null;
            if (resource is not IDictionary<string, object> item)
            {
                return false;
            }

            item.TryGetValue("id", out var idObj);
            item.TryGetValue("title", out var titleObj);
            item.TryGetValue("buttonText", out var buttonObj);
            item.TryGetValue("link", out var linkObj);
            item.TryGetValue("sectionType", out var sectionObj);

            if (idObj == null || !int.TryParse(idObj.ToString(), out var contentId))
            {
                return false;
            }

            var link = linkObj?.ToString();
            if (!ResourceLinkHealthEvaluator.TryNormalizeUrl(link, out var normalizedUrl))
            {
                return false;
            }

            var title = titleObj?.ToString();
            if (string.IsNullOrWhiteSpace(title))
            {
                title = buttonObj?.ToString();
            }

            candidate = new ResourceLinkCandidate
            {
                ContentId = contentId,
                Title = string.IsNullOrWhiteSpace(title) ? $"Resource {contentId}" : title.Trim(),
                NormalizedUrl = normalizedUrl,
                SectionType = string.IsNullOrWhiteSpace(sectionObj?.ToString())
                    ? defaultSectionType
                    : sectionObj.ToString()
            };
            return true;
        }

        private async Task<Dictionary<string, ResourceLinkHttpCheckResult>> CheckUrlsAsync(
            List<string> urls,
            CancellationToken cancellationToken)
        {
            var results = new Dictionary<string, ResourceLinkHttpCheckResult>(StringComparer.OrdinalIgnoreCase);
            if (urls.Count == 0)
            {
                return results;
            }

            using var semaphore = new SemaphoreSlim(ResourceLinkHealthConstants.MaxConcurrentChecks);
            var tasks = urls.Select(async url =>
            {
                await semaphore.WaitAsync(cancellationToken);
                try
                {
                    var result = await CheckUrlAsync(url, cancellationToken);
                    lock (results)
                    {
                        results[url] = result;
                    }
                }
                finally
                {
                    semaphore.Release();
                }
            });

            await Task.WhenAll(tasks);
            return results;
        }

        private async Task<ResourceLinkHttpCheckResult> CheckUrlAsync(string url, CancellationToken cancellationToken)
        {
            var headResult = await SendAsync(HttpMethod.Head, url, cancellationToken);
            if (headResult.TimedOut)
            {
                return headResult;
            }

            if (ResourceLinkHealthEvaluator.ShouldFallbackToGet(headResult.StatusCode)
                || headResult.NetworkError
                || !headResult.StatusCode.HasValue)
            {
                return await SendAsync(HttpMethod.Get, url, cancellationToken);
            }

            return headResult;
        }

        private async Task<ResourceLinkHttpCheckResult> SendAsync(
            HttpMethod method,
            string url,
            CancellationToken cancellationToken)
        {
            var client = _httpClientFactory.CreateClient(HttpClientName);
            try
            {
                using var request = new HttpRequestMessage(method, url);
                using var response = await client.SendAsync(
                    request,
                    HttpCompletionOption.ResponseHeadersRead,
                    cancellationToken);

                return new ResourceLinkHttpCheckResult
                {
                    StatusCode = (int)response.StatusCode
                };
            }
            catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
            {
                return new ResourceLinkHttpCheckResult
                {
                    TimedOut = true,
                    Error = "Timed out"
                };
            }
            catch (HttpRequestException ex)
            {
                return new ResourceLinkHttpCheckResult
                {
                    NetworkError = true,
                    Error = string.IsNullOrWhiteSpace(ex.Message) ? "Network error" : ex.Message
                };
            }
            catch (Exception ex)
            {
                return new ResourceLinkHttpCheckResult
                {
                    NetworkError = true,
                    Error = ex.Message
                };
            }
        }

        private async Task NotifyAdministratorsAsync(
            List<ResourceLinkCandidate> newlyBroken,
            List<ResourceLinkCandidate> recovered,
            List<ResourceLinkCandidate> stillBroken)
        {
            var adminUsers = (await _userManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR))
                ?.Where(x => x != null && x.IsActive && !string.IsNullOrWhiteSpace(x.Email))
                .ToList()
                ?? new List<ApplicationUser>();

            if (adminUsers.Count == 0)
            {
                _logger.LogWarning("Resource link health check found issues but no administrator emails were available");
                return;
            }

            var replacements = new List<TagsReplacements>
            {
                new TagsReplacements { FindValue = "CheckDate", ReplacementValue = DateTime.Now.ToString("dd MMMM yyyy") },
                new TagsReplacements { FindValue = "NewlyBrokenLinks", ReplacementValue = FormatDigestSection(newlyBroken) },
                new TagsReplacements { FindValue = "RecoveredLinks", ReplacementValue = FormatDigestSection(recovered) },
                new TagsReplacements { FindValue = "StillBrokenLinks", ReplacementValue = FormatDigestSection(stillBroken) },
            };

            foreach (var adminUser in adminUsers)
            {
                await _notificationService.SendNotificationAsync(
                    null,
                    TemplateTypeConstants.NotifyAdminBrokenResourceLinks,
                    DateTime.Now.Date,
                    adminUser,
                    "",
                    MessageStatusConstants.Red,
                    replacements,
                    null,
                    false,
                    false,
                    null,
                    null,
                    null,
                    MessageTypeConstants.EMAIL);
            }
        }

        private static string FormatDigestSection(List<ResourceLinkCandidate> items)
        {
            if (items == null || items.Count == 0)
            {
                return "None";
            }

            return string.Join(
                Environment.NewLine,
                items.Select(x => ResourceLinkHealthEvaluator.FormatDigestLine(
                    x.SectionType,
                    x.Title,
                    x.NormalizedUrl,
                    x.Detail)));
        }

        private class ResourceLinkCandidate
        {
            public string ContentType { get; set; }
            public int ContentId { get; set; }
            public Guid LocaleId { get; set; }
            public string SectionType { get; set; }
            public string Title { get; set; }
            public string NormalizedUrl { get; set; }
            public string Detail { get; set; }
        }
    }
}
