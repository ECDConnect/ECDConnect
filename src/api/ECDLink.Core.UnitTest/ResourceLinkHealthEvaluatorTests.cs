using ECDLink.Core.Services.ResourceLinkHealth;

namespace ECDLink.Core.UnitTest
{
    public class ResourceLinkHealthEvaluatorTests
    {
        [Theory]
        [InlineData("https://example.com/resource", "https://example.com/resource")]
        [InlineData("http://example.org/a", "http://example.org/a")]
        [InlineData("www.example.com/help", "https://www.example.com/help")]
        public void TryNormalizeUrl_WithValidInput_ReturnsNormalizedUrl(string input, string expected)
        {
            var result = ResourceLinkHealthEvaluator.TryNormalizeUrl(input, out var normalized);

            Assert.True(result);
            Assert.Equal(expected, normalized);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData("not a url")]
        [InlineData("javascript:alert(1)")]
        [InlineData("ftp://example.com/file")]
        [InlineData("http://localhost/resource")]
        public void TryNormalizeUrl_WithInvalidInput_ReturnsFalse(string input)
        {
            var result = ResourceLinkHealthEvaluator.TryNormalizeUrl(input, out var normalized);

            Assert.False(result);
            Assert.Null(normalized);
        }

        [Fact]
        public void Classify_SuccessAndRedirects_AreOk()
        {
            Assert.Equal(ResourceLinkHealthConstants.StatusOk, ResourceLinkHealthEvaluator.Classify(new ResourceLinkHttpCheckResult { StatusCode = 200 }).Kind);
            Assert.Equal(ResourceLinkHealthConstants.StatusOk, ResourceLinkHealthEvaluator.Classify(new ResourceLinkHttpCheckResult { StatusCode = 301 }).Kind);
        }

        [Theory]
        [InlineData(404)]
        [InlineData(410)]
        [InlineData(400)]
        public void Classify_ClientErrors_AreBroken(int statusCode)
        {
            var outcome = ResourceLinkHealthEvaluator.Classify(new ResourceLinkHttpCheckResult { StatusCode = statusCode });

            Assert.Equal(ResourceLinkHealthConstants.StatusBroken, outcome.Kind);
            Assert.Equal(statusCode, outcome.StatusCode);
        }

        [Theory]
        [InlineData(401)]
        [InlineData(403)]
        [InlineData(429)]
        public void Classify_AuthAndRateLimit_AreUnverifiable(int statusCode)
        {
            var outcome = ResourceLinkHealthEvaluator.Classify(new ResourceLinkHttpCheckResult { StatusCode = statusCode });

            Assert.Equal(ResourceLinkHealthConstants.StatusUnverifiable, outcome.Kind);
        }

        [Fact]
        public void Classify_ServerErrorAndTimeout_AreTransient()
        {
            Assert.Equal(
                ResourceLinkHealthConstants.StatusTransient,
                ResourceLinkHealthEvaluator.Classify(new ResourceLinkHttpCheckResult { StatusCode = 500 }).Kind);
            Assert.Equal(
                ResourceLinkHealthConstants.StatusTransient,
                ResourceLinkHealthEvaluator.Classify(new ResourceLinkHttpCheckResult { TimedOut = true, Error = "Timed out" }).Kind);
        }

        [Fact]
        public void Classify_NetworkErrorAndInvalidUrl_AreBroken()
        {
            Assert.Equal(
                ResourceLinkHealthConstants.StatusBroken,
                ResourceLinkHealthEvaluator.Classify(new ResourceLinkHttpCheckResult { NetworkError = true, Error = "Name or service not known" }).Kind);
            Assert.Equal(
                ResourceLinkHealthConstants.StatusBroken,
                ResourceLinkHealthEvaluator.Classify(ResourceLinkHttpCheckResult.Invalid()).Kind);
        }

        [Theory]
        [InlineData(400, true)]
        [InlineData(403, true)]
        [InlineData(405, true)]
        [InlineData(501, true)]
        [InlineData(404, false)]
        [InlineData(200, false)]
        public void ShouldFallbackToGet_MatchesExpectedCodes(int statusCode, bool expected)
        {
            Assert.Equal(expected, ResourceLinkHealthEvaluator.ShouldFallbackToGet(statusCode));
        }

        [Fact]
        public void ApplyCheck_DoesNotMarkBrokenOnFirstFailure()
        {
            var first = ResourceLinkHealthEvaluator.ApplyCheck(
                ResourceLinkHealthConstants.StatusOk,
                0,
                "https://example.com/a",
                "https://example.com/a",
                ResourceLinkCheckOutcome.Broken("HTTP 404", 404));

            Assert.Equal(ResourceLinkHealthConstants.StatusOk, first.ConfirmedStatus);
            Assert.Equal(1, first.ConsecutiveFailureCount);
            Assert.False(first.IsNewlyBroken);
            Assert.False(first.IsRecovered);
        }

        [Fact]
        public void ApplyCheck_MarksNewlyBrokenOnSecondConsecutiveFailure()
        {
            var second = ResourceLinkHealthEvaluator.ApplyCheck(
                ResourceLinkHealthConstants.StatusOk,
                1,
                "https://example.com/a",
                "https://example.com/a",
                ResourceLinkCheckOutcome.Broken("HTTP 404", 404));

            Assert.Equal(ResourceLinkHealthConstants.StatusBroken, second.ConfirmedStatus);
            Assert.Equal(2, second.ConsecutiveFailureCount);
            Assert.True(second.IsNewlyBroken);
            Assert.False(second.IsStillBroken);
        }

        [Fact]
        public void ApplyCheck_RecoversAfterSuccessfulCheck()
        {
            var recovered = ResourceLinkHealthEvaluator.ApplyCheck(
                ResourceLinkHealthConstants.StatusBroken,
                3,
                "https://example.com/a",
                "https://example.com/a",
                ResourceLinkCheckOutcome.Ok(200));

            Assert.Equal(ResourceLinkHealthConstants.StatusOk, recovered.ConfirmedStatus);
            Assert.Equal(0, recovered.ConsecutiveFailureCount);
            Assert.True(recovered.IsRecovered);
            Assert.False(recovered.IsNewlyBroken);
        }

        [Fact]
        public void ApplyCheck_UnverifiableDoesNotIncrementFailures()
        {
            var result = ResourceLinkHealthEvaluator.ApplyCheck(
                ResourceLinkHealthConstants.StatusOk,
                1,
                "https://example.com/a",
                "https://example.com/a",
                ResourceLinkCheckOutcome.Unverifiable("HTTP 403", 403));

            Assert.Equal(ResourceLinkHealthConstants.StatusUnverifiable, result.ConfirmedStatus);
            Assert.Equal(1, result.ConsecutiveFailureCount);
            Assert.False(result.IsNewlyBroken);
        }

        [Fact]
        public void ApplyCheck_UnverifiableKeepsPreviouslyBrokenStatus()
        {
            var result = ResourceLinkHealthEvaluator.ApplyCheck(
                ResourceLinkHealthConstants.StatusBroken,
                2,
                "https://example.com/a",
                "https://example.com/a",
                ResourceLinkCheckOutcome.Unverifiable("HTTP 403", 403));

            Assert.Equal(ResourceLinkHealthConstants.StatusBroken, result.ConfirmedStatus);
            Assert.True(result.IsStillBroken);
            Assert.False(result.IsNewlyBroken);
        }

        [Fact]
        public void ApplyCheck_UrlChangeResetsFailureHistory()
        {
            var result = ResourceLinkHealthEvaluator.ApplyCheck(
                ResourceLinkHealthConstants.StatusBroken,
                4,
                "https://example.com/old",
                "https://example.com/new",
                ResourceLinkCheckOutcome.Broken("HTTP 404", 404));

            Assert.Equal(ResourceLinkHealthConstants.StatusOk, result.ConfirmedStatus);
            Assert.Equal(1, result.ConsecutiveFailureCount);
            Assert.False(result.IsNewlyBroken);
            Assert.False(result.IsRecovered);
        }

        [Fact]
        public void ApplyCheck_StillBrokenAfterConfirmedFailure()
        {
            var result = ResourceLinkHealthEvaluator.ApplyCheck(
                ResourceLinkHealthConstants.StatusBroken,
                2,
                "https://example.com/a",
                "https://example.com/a",
                ResourceLinkCheckOutcome.Broken("HTTP 410", 410));

            Assert.Equal(ResourceLinkHealthConstants.StatusBroken, result.ConfirmedStatus);
            Assert.True(result.IsStillBroken);
            Assert.False(result.IsNewlyBroken);
        }

        [Fact]
        public void FormatDigestLine_IncludesSectionTitleUrlAndDetail()
        {
            var line = ResourceLinkHealthEvaluator.FormatDigestLine(
                ResourceLinkHealthConstants.SectionClassroom,
                "Story cards",
                "https://example.com/stories",
                "HTTP 404");

            Assert.Equal("- [Classroom] Story cards: https://example.com/stories (HTTP 404)", line);
        }
    }
}
