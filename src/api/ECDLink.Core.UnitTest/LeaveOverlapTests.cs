using ECDLink.Core.Helpers;

namespace ECDLink.Core.UnitTest
{
    public class LeaveOverlapTests
    {
        private static readonly Guid ClassA = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1");
        private static readonly Guid ClassB = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2");
        private static readonly Guid Older = Guid.Parse("00000000-0000-0000-0000-000000000001");
        private static readonly Guid Newer = Guid.Parse("00000000-0000-0000-0000-000000000002");
        private static readonly Guid Third = Guid.Parse("00000000-0000-0000-0000-000000000003");

        [Fact]
        public void Decide_WithNoExistingLeave_InsertsARow()
        {
            var decision = LeaveOverlap.Decide(null, Day(1), Day(3), ClassA.ToString());

            Assert.True(decision.InsertNewRow);
            Assert.Null(decision.KeepId);
            Assert.Empty(decision.MovePeriodIds);
            Assert.Empty(decision.DeactivateIds);
            Assert.False(decision.PeriodChanged);
        }

        [Fact]
        public void Decide_WhenNewPeriodOverlapsSameClass_UpdatesThatRow()
        {
            var existing = new[]
            {
                Span(Older, ClassA, 1, 3),
            };

            var decision = LeaveOverlap.Decide(existing, Day(2), Day(5), ClassA.ToString());

            Assert.False(decision.InsertNewRow);
            Assert.Equal(Older, decision.KeepId);
            Assert.Equal(new[] { Older }, decision.MovePeriodIds);
            Assert.Empty(decision.DeactivateIds);
            Assert.True(decision.PeriodChanged);
        }

        [Fact]
        public void Decide_WhenNewPeriodCoversExisting_UpdatesThatRow()
        {
            var existing = new[]
            {
                Span(Older, ClassA, 2, 3),
            };

            var decision = LeaveOverlap.Decide(existing, Day(1), Day(6), null);

            Assert.False(decision.InsertNewRow);
            Assert.Equal(Older, decision.KeepId);
            Assert.True(decision.PeriodChanged);
        }

        [Fact]
        public void Decide_WhenExistingPeriodCoversNew_UpdatesThatRow()
        {
            var existing = new[]
            {
                Span(Older, null, 1, 10),
            };

            var decision = LeaveOverlap.Decide(existing, Day(4), Day(5), "");

            Assert.False(decision.InsertNewRow);
            Assert.Equal(Older, decision.KeepId);
            Assert.True(decision.PeriodChanged);
        }

        [Fact]
        public void Decide_WhenPeriodsOnlyShareAnEndpoint_TreatsThemAsOverlapping()
        {
            var existing = new[]
            {
                Span(Older, null, 1, 3),
            };

            var decision = LeaveOverlap.Decide(existing, Day(3), Day(4), "");

            Assert.False(decision.InsertNewRow);
            Assert.Equal(Older, decision.KeepId);
        }

        [Fact]
        public void Decide_WhenPeriodsAreAdjacent_InsertsASeparateRow()
        {
            var existing = new[]
            {
                Span(Older, ClassA, 1, 3),
            };

            var decision = LeaveOverlap.Decide(existing, Day(4), Day(6), ClassA.ToString());

            Assert.True(decision.InsertNewRow);
            Assert.Null(decision.KeepId);
            Assert.Empty(decision.MovePeriodIds);
        }

        [Fact]
        public void Decide_WhenTheSamePeriodIsLoggedAgain_KeepsTheRowWithoutANewPeriod()
        {
            var existing = new[]
            {
                Span(Older, ClassA, 1, 3),
            };

            var decision = LeaveOverlap.Decide(existing, Day(1), Day(3), ClassA.ToString());

            Assert.False(decision.InsertNewRow);
            Assert.Equal(Older, decision.KeepId);
            Assert.False(decision.PeriodChanged);
        }

        [Fact]
        public void Decide_WhenTheNewLeaveIsForAnotherClass_KeepsTheOldClassAndInserts()
        {
            var existing = new[]
            {
                Span(Older, ClassA, 1, 3),
            };

            var decision = LeaveOverlap.Decide(existing, Day(2), Day(5), ClassB.ToString());

            Assert.True(decision.InsertNewRow);
            Assert.Null(decision.KeepId);
            Assert.Equal(new[] { Older }, decision.MovePeriodIds);
            Assert.Empty(decision.DeactivateIds);
            Assert.True(decision.PeriodChanged);
        }

        [Fact]
        public void Decide_WhenSeveralClassesOverlap_MovesEveryClassOntoTheNewPeriod()
        {
            var existing = new[]
            {
                Span(Older, ClassA, 1, 3, updatedDay: 1),
                Span(Newer, ClassB, 1, 3, updatedDay: 2),
            };

            var decision = LeaveOverlap.Decide(existing, Day(2), Day(6), ClassA.ToString());

            Assert.False(decision.InsertNewRow);
            Assert.Equal(Older, decision.KeepId);
            Assert.Equal(new[] { Newer, Older }, decision.MovePeriodIds);
            Assert.Empty(decision.DeactivateIds);
        }

        [Fact]
        public void Decide_WhenTheSameClassWasLoggedTwice_DropsTheOlderDuplicate()
        {
            var existing = new[]
            {
                Span(Older, ClassA, 1, 4, updatedDay: 1),
                Span(Newer, ClassA, 2, 5, updatedDay: 2),
            };

            var decision = LeaveOverlap.Decide(existing, Day(3), Day(6), ClassA.ToString());

            Assert.False(decision.InsertNewRow);
            Assert.Equal(Newer, decision.KeepId);
            Assert.Equal(new[] { Newer }, decision.MovePeriodIds);
            Assert.Equal(new[] { Older }, decision.DeactivateIds);
        }

        [Fact]
        public void Decide_WhenNoClassIsGiven_OverwritesTheLatestOverlappingRow()
        {
            var existing = new[]
            {
                Span(Older, ClassA, 1, 3, updatedDay: 1),
                Span(Newer, ClassB, 2, 4, updatedDay: 2),
            };

            var decision = LeaveOverlap.Decide(existing, Day(3), Day(8), "  ");

            Assert.False(decision.InsertNewRow);
            Assert.Equal(Newer, decision.KeepId);
            Assert.Contains(Older, decision.MovePeriodIds);
            Assert.Contains(Newer, decision.MovePeriodIds);
        }

        [Fact]
        public void Decide_WhenAClassIsAddedOverAClasslessLeave_DropsTheClasslessRow()
        {
            var existing = new[]
            {
                Span(Older, null, 1, 3),
            };

            var decision = LeaveOverlap.Decide(existing, Day(2), Day(5), ClassA.ToString());

            Assert.True(decision.InsertNewRow);
            Assert.Empty(decision.MovePeriodIds);
            Assert.Equal(new[] { Older }, decision.DeactivateIds);
            Assert.True(decision.PeriodChanged);
        }

        [Fact]
        public void Decide_IgnoresProgrammeRemovalAndInactiveRows()
        {
            var existing = new[]
            {
                Span(Older, ClassA, 1, 5, removal: true),
                Span(Newer, ClassA, 1, 5, active: false),
                Span(Third, ClassB, 1, 2),
            };

            var decision = LeaveOverlap.Decide(existing, Day(1), Day(2), ClassA.ToString());

            Assert.True(decision.InsertNewRow);
            Assert.Equal(new[] { Third }, decision.MovePeriodIds);
            Assert.DoesNotContain(Older, decision.MovePeriodIds);
            Assert.DoesNotContain(Newer, decision.MovePeriodIds);
        }

        private static LeaveSpan Span(
            Guid id,
            Guid? reassignedClass,
            int startDay,
            int endDay,
            int updatedDay = 1,
            bool removal = false,
            bool active = true)
        {
            return new LeaveSpan
            {
                Id = id,
                ReassignedClass = reassignedClass?.ToString(),
                Start = Day(startDay),
                End = Day(endDay),
                UpdatedDate = Day(updatedDay),
                IsActive = active,
                IsProgrammeRemoval = removal,
            };
        }

        private static DateTime Day(int day)
        {
            return new DateTime(2026, 6, day, 12, 0, 0);
        }
    }
}
