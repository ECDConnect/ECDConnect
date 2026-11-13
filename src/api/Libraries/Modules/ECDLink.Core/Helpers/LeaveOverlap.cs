using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.Core.Helpers
{
    /// <summary>
    /// One active leave row for a practitioner. Several rows can share a period
    /// when each row reassigns a different class.
    /// </summary>
    public sealed class LeaveSpan
    {
        public Guid Id { get; set; }
        public string ReassignedClass { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsProgrammeRemoval { get; set; }
    }

    /// <summary>
    /// How a newly logged leave should land on leave that is already stored.
    /// </summary>
    public sealed class LeaveOverlapDecision
    {
        public bool InsertNewRow { get; set; }
        public Guid? KeepId { get; set; }
        public IReadOnlyList<Guid> MovePeriodIds { get; set; } = Array.Empty<Guid>();
        public IReadOnlyList<Guid> DeactivateIds { get; set; } = Array.Empty<Guid>();
        public bool PeriodChanged { get; set; }
    }

    /// <summary>
    /// Decides whether a new leave period replaces leave that is already stored
    /// for the same practitioner. Overlap includes a new period that sits inside
    /// an existing one and a new period that covers an existing one.
    /// Rows for different classes stay, but they all take the latest dates.
    /// A second row for the same class is dropped.
    /// Programme removals are left untouched.
    /// </summary>
    public static class LeaveOverlap
    {
        public const string ProgrammeRemovalReason = "Practitioner removed from programme";

        public static DateTime NormalizeEnd(DateTime start, DateTime? end)
        {
            if (end.HasValue && end.Value >= start)
            {
                return end.Value;
            }

            return start.Date;
        }

        public static bool RangesOverlap(DateTime start, DateTime end, DateTime otherStart, DateTime otherEnd)
        {
            return start.Date <= otherEnd.Date && otherStart.Date <= end.Date;
        }

        public static string NormalizeClass(string reassignedClass)
        {
            return string.IsNullOrWhiteSpace(reassignedClass)
                ? string.Empty
                : reassignedClass.Trim();
        }

        public static LeaveOverlapDecision Decide(
            IEnumerable<LeaveSpan> existing,
            DateTime newStart,
            DateTime newEnd,
            string newClass)
        {
            var normalizedEnd = NormalizeEnd(newStart, newEnd);
            var normalizedClass = NormalizeClass(newClass);
            var overlapping = (existing ?? Enumerable.Empty<LeaveSpan>())
                .Where(row => row.IsActive && !row.IsProgrammeRemoval)
                .Where(row => RangesOverlap(newStart, normalizedEnd, row.Start, NormalizeEnd(row.Start, row.End)))
                .OrderByDescending(row => row.UpdatedDate)
                .ThenByDescending(row => row.Id)
                .ToList();

            if (overlapping.Count == 0)
            {
                return new LeaveOverlapDecision
                {
                    InsertNewRow = true,
                };
            }

            var deactivate = new List<Guid>();
            var seenClasses = new HashSet<string>();
            foreach (var row in overlapping)
            {
                var rowClass = NormalizeClass(row.ReassignedClass);
                if (!seenClasses.Add(rowClass))
                {
                    deactivate.Add(row.Id);
                }
            }

            // A row with no class is the whole leave, not a class assignment.
            // Once a class is named, that classless row would sit beside the new
            // one as a second entry for the same days.
            if (normalizedClass.Length > 0)
            {
                foreach (var row in overlapping)
                {
                    if (NormalizeClass(row.ReassignedClass).Length == 0 && !deactivate.Contains(row.Id))
                    {
                        deactivate.Add(row.Id);
                    }
                }
            }

            var match = overlapping.FirstOrDefault(row => NormalizeClass(row.ReassignedClass) == normalizedClass);
            var insertNewRow = match == null && normalizedClass.Length > 0;
            var keep = insertNewRow ? null : match ?? overlapping[0];
            var deactivateSet = new HashSet<Guid>(deactivate);

            return new LeaveOverlapDecision
            {
                InsertNewRow = insertNewRow,
                KeepId = keep?.Id,
                MovePeriodIds = overlapping
                    .Where(row => !deactivateSet.Contains(row.Id))
                    .Select(row => row.Id)
                    .ToList(),
                DeactivateIds = deactivate,
                PeriodChanged = overlapping.Any(row =>
                    row.Start.Date != newStart.Date || NormalizeEnd(row.Start, row.End).Date != normalizedEnd.Date),
            };
        }
    }
}
