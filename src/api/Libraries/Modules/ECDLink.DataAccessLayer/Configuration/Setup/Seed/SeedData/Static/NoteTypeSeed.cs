using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Notes;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Static
{
    internal static class NoteTypeSeedConstants
    {
        public static Guid ChildNote = Guid.Parse("676df657-2154-4c3a-b45c-29da7e0f1219");
        public static Guid ReportNote = Guid.Parse("87dbcfc2-b987-4242-a322-4b979e689ec5");
    }

    internal static class NoteTypeSeed<T>
        where T : NoteType, new()
    {
        internal static IList<T> GetNoteTypes()
        {
            return new List<T>()
            {
                new T
                {
                    Id = NoteTypeSeedConstants.ChildNote,
                    EnumId = NoteTypeEnum.Child,
                    Name = "child_note",
                    NormalizedName = "Child Note",
                    Description = "Note for the child"
                },
                new T
                {
                    Id = NoteTypeSeedConstants.ReportNote,
                    EnumId = NoteTypeEnum.Report,
                    Name = "child_progress_report_note",
                    NormalizedName = "Child Progress Report Note",
                    Description = "Note for the childs Progress Report"
                }
            };
        }
    }
}
