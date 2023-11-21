using ECDLink.PDFGenerator.Enums;
using ECDLink.PDFGenerator.Models;
using ECDLink.SmartStart.Reports.ChildProgressReport.Documents.Tags;
using iTextSharp.text;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.SmartStart.Reports.ChildProgressReport
{
    public class ChildProgressReportTemplate
    {
        public static Dictionary<string, PdfFieldDescriptor> GetFieldTemplate(
            ChildProgressReportDetailedModel model, 
            DataAccessLayer.Entities.Users.Practitioner practitioner,
            string currentProfileImageUrl)
        {
            var desc = new Dictionary<string, PdfFieldDescriptor>();

            AddCoverPage(desc, model);
            AddIntroPage(desc, model);
            AddClosingPage(desc, model, practitioner, currentProfileImageUrl);

            AddHeadings(desc, model);
            AddSupplimentrySections(desc, model);

            AddSocialDevelopment(desc, model);
            AddLanguageDevelopment(desc, model);
            AddCognitiveDevelopment(desc, model);
            AddPhysicalDevelopment(desc, model);

            return desc;
        }

        private static void AddSupplimentrySections(Dictionary<string, PdfFieldDescriptor> desc, ChildProgressReportDetailedModel model)
        {
            desc.Add(ChildProgressReportTags.SkillsSummary, new PdfFieldDescriptor
            {
                IsDuplicateKey = false,
                Type = PdfFieldTypeEnum.Text,
                Value = $"By the time {model.ChildFirstname} starts Grade R, they should be able to do most of these things."
            });
        }

        private static void AddHeadings(Dictionary<string, PdfFieldDescriptor> desc, ChildProgressReportDetailedModel model)
        {
            desc.Add(ChildProgressReportTags.TogetherHeader, new PdfFieldDescriptor
            {
                IsDuplicateKey = false,
                Type = PdfFieldTypeEnum.Text,
                Value = $"Together with you we can help {model.ChildFirstname} to do these soon:"
            });

            desc.Add(ChildProgressReportTags.SkillsHeading, new PdfFieldDescriptor
            {
                IsDuplicateKey = false,
                Type = PdfFieldTypeEnum.Text,
                Value = $"{model.ChildFirstname} will build these skills and behaviours in future:"
            });

            desc.Add(ChildProgressReportTags.DoingWellHeader, new PdfFieldDescriptor
            {
                IsDuplicateKey = false,
                Type = PdfFieldTypeEnum.Text,
                Value = $"{model.ChildFirstname} is doing really well in these areas:"
            });
        }

        private static void AddPhysicalDevelopment(Dictionary<string, PdfFieldDescriptor> desc, ChildProgressReportDetailedModel model)
        {
            var category = model.Categories.Where(x => x.CategoryId == Constants.Categories.Physical).FirstOrDefault();

            var tasks = GetCategoryTasks(category);
            var missingTasks = GetCategoryMissingTasks(category);

            if (missingTasks.Any())
            {
                desc.Add(ChildProgressReportTags.PDText, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.TextListBulletPoints,
                    Value = missingTasks.Select(x => x.Description)
                });
            }
            else
            {
                desc.Add(ChildProgressReportTags.PDText, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Value = $"{model.ChildFirstname} can do all of things in this area!"
                });
            }

            if (category.SupportingTask != null)
            {
                desc.Add(ChildProgressReportTags.PDHeader, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Alignment = Element.ALIGN_MIDDLE,
                    Value = $"{category.SupportingTask.TaskDescription}"
                });

                desc.Add(ChildProgressReportTags.PDFooter, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Value = $"<b>Together, we can support {model.ChildFirstname} by:</b> {category.SupportingTask.TodoText}"
                });
            }
            else
            {
                desc.Add(ChildProgressReportTags.PDHeader, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Alignment = Element.ALIGN_MIDDLE,
                    Value = $"{model.ChildFirstname} can do all of things in this area!"
                });
            }

            if (!tasks.Any())
            {
                desc.Add(ChildProgressReportTags.PDParagraphFallaback, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Value = $"{model.ChildFirstname} is still working to build their skills and behaviour in this area"
                });
            }
            else
            {
                desc.Add(ChildProgressReportTags.PDParagraph, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.TextColumnSplit,
                    Value = tasks.Select(x => x.Description)
                });
            }
        }

        private static void AddCognitiveDevelopment(Dictionary<string, PdfFieldDescriptor> desc, ChildProgressReportDetailedModel model)
        {
            var category = model.Categories.Where(x => x.CategoryId == Constants.Categories.CognitiveAndNumeracy).FirstOrDefault();

            var tasks = GetCategoryTasks(category);
            var missingTasks = GetCategoryMissingTasks(category);

            if (missingTasks.Any())
            {
                desc.Add(ChildProgressReportTags.CDText, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.TextListBulletPoints,
                    Value = missingTasks.Select(x => x.Description)
                });
            }
            else
            {
                desc.Add(ChildProgressReportTags.CDText, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Value = $"{model.ChildFirstname} can do all of things in this area!"
                });
            }

            if (category.SupportingTask != null)
            {
                desc.Add(ChildProgressReportTags.CDHeader, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Alignment = Element.ALIGN_MIDDLE,
                    Value = $"{category.SupportingTask.TaskDescription}"
                });

                desc.Add(ChildProgressReportTags.CDFooter, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Value = $"<b>Together, we can support {model.ChildFirstname} by:</b> {category.SupportingTask.TodoText}"
                });
            }
            else
            {
                desc.Add(ChildProgressReportTags.CDHeader, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Alignment = Element.ALIGN_MIDDLE,
                    Value = $"{model.ChildFirstname} can do all of things in this area!"
                });
            }

            if (!tasks.Any())
            {
                desc.Add(ChildProgressReportTags.CDParagraphFallback, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Value = $"{model.ChildFirstname} is still working to build their skills and behaviour in this area"
                });
            }
            else
            {
                desc.Add(ChildProgressReportTags.CDParagraph, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.TextColumnSplit,
                    Value = tasks.Select(x => x.Description)
                });
            }
        }

        private static void AddLanguageDevelopment(Dictionary<string, PdfFieldDescriptor> desc, ChildProgressReportDetailedModel model)
        {
            var category = model.Categories.Where(x => x.CategoryId == Constants.Categories.LanguageAndLiteracy).FirstOrDefault();

            if (category.SupportingTask != null)
            {
                desc.Add(ChildProgressReportTags.LDHeader, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Alignment = Element.ALIGN_MIDDLE,
                    Value = $"{category.SupportingTask.TaskDescription}"
                });

                desc.Add(ChildProgressReportTags.LDFooter, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Value = $"<b>Together, we can support {model.ChildFirstname} by:</b> {category.SupportingTask.TodoText}"
                });
            }
            else
            {
                desc.Add(ChildProgressReportTags.LDHeader, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Alignment = Element.ALIGN_MIDDLE,
                    Value = $"{model.ChildFirstname} can do all of things in this area!"
                });
            }

            var tasks = GetCategoryTasks(category);
            var missingTasks = GetCategoryMissingTasks(category);

            if (!tasks.Any())
            {
                desc.Add(ChildProgressReportTags.LDParagraphFallback, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Value = $"{model.ChildFirstname} is still working to build their skills and behaviour in this area"
                });
            }
            else
            {
                desc.Add(ChildProgressReportTags.LDParagraph, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.TextColumnSplit,
                    Value = tasks.Select(x => x.Description)
                });
            }

            if (missingTasks.Any())
            {
                desc.Add(ChildProgressReportTags.LDText, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.TextListBulletPoints,
                    Value = missingTasks.Select(x => x.Description)
                });
            }
            else
            {
                desc.Add(ChildProgressReportTags.LDText, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Value = $"{model.ChildFirstname} can do all of things in this area!"
                });
            }
        }

        private static IEnumerable<CategoryTask> GetCategoryTasks(ObservationCategory category)
        {
            var tasks = category.Tasks.Where(x => x.Value == "Yes").ToList();
            return tasks;
        }

        private static IEnumerable<CategoryTask> GetCategoryMissingTasks(ObservationCategory category)
        {
            var noTasks = category.Tasks.Where(x => x.Value != "Yes");
            var missingTasks = new List<CategoryTask>();
            missingTasks.AddRange(category.MissingTasks);
            foreach (var noTask in noTasks)
            {
                if (missingTasks.Find(x => x.SkillId == noTask.SkillId) == null)
                {
                    missingTasks.Add(noTask);
                }
            }
            return missingTasks;
        }


        private static void AddSocialDevelopment(Dictionary<string, PdfFieldDescriptor> desc, ChildProgressReportDetailedModel model)
        {
            var category = model.Categories.Where(x => x.CategoryId == Constants.Categories.SocialAndEmotional).FirstOrDefault();

            if (category == default)
            {
                return;
            }

            if (category.SupportingTask != null)
            {
                desc.Add(ChildProgressReportTags.SEDHeader, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Alignment = Element.ALIGN_MIDDLE,
                    Value = $"{category.SupportingTask.TaskDescription}"
                });

                desc.Add(ChildProgressReportTags.SEDFooter, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Value = $"<b>Together, we can support {model.ChildFirstname} by:</b> {category.SupportingTask.TodoText}"
                });
            }
            else
            {
                desc.Add(ChildProgressReportTags.SEDHeader, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Alignment = Element.ALIGN_MIDDLE,
                    Value = $"{model.ChildFirstname} can do all of things in this area!"
                });
            }

            var tasks = GetCategoryTasks(category);
            var missingTasks = GetCategoryMissingTasks(category);

            if (!tasks.Any())
            {
                desc.Add(ChildProgressReportTags.SEDParagraphFallback, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Value = $"{model.ChildFirstname} is still working to build their skills and behaviour in this area"
                });
            }
            else
            {
                desc.Add(ChildProgressReportTags.SEDParagraph, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.TextColumnSplit,
                    Value = tasks.Select(x => x.Description)
                });
            }

            if (missingTasks.Any())
            {
                desc.Add(ChildProgressReportTags.SEDText, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.TextListBulletPoints,
                    Value = missingTasks.Select(x => x.Description)
                });
            }
            else
            {
                desc.Add(ChildProgressReportTags.SEDText, new PdfFieldDescriptor
                {
                    IsDuplicateKey = false,
                    Type = PdfFieldTypeEnum.Text,
                    Value = $"{model.ChildFirstname} can do all of things in this area!"
                });
            }
        }

        private static void AddClosingPage(Dictionary<string, PdfFieldDescriptor> desc, 
            ChildProgressReportDetailedModel model, 
            DataAccessLayer.Entities.Users.Practitioner practitioner,
            string currentProfileImageUrl
            )
        {
            desc.Add(ChildProgressReportTags.ClosingHeading, new PdfFieldDescriptor
            {
                IsDuplicateKey = false,
                Type = PdfFieldTypeEnum.Text,
                Value = $"Thank you for trusting us to help {model.ChildFirstname} grow and learn this year."
            });

            desc.Add(ChildProgressReportTags.PractitionerFirstName, new PdfFieldDescriptor
            {
                IsDuplicateKey = false,
                Type = PdfFieldTypeEnum.Text,
                Value = model.PractitionerFirstname
            });

            desc.Add(ChildProgressReportTags.PractitionerSurname, new PdfFieldDescriptor
            {
                IsDuplicateKey = false,
                Type = PdfFieldTypeEnum.Text,
                Value = model.PractitionerSurname
            });


            var usePhotoInReport = practitioner != null && !string.IsNullOrEmpty(practitioner.UsePhotoInReport) && practitioner.UsePhotoInReport.EndsWith("-yes");
            desc.Add(ChildProgressReportTags.PractitionerPhoto, new PdfFieldDescriptor
            {
                IsDuplicateKey = false,
                Type = PdfFieldTypeEnum.Base64Image,
                Value = usePhotoInReport ? (!string.IsNullOrEmpty(currentProfileImageUrl) ? currentProfileImageUrl : model.PractitionerPhotoUrl) : ""
            });
        }

        private static void AddIntroPage(Dictionary<string, PdfFieldDescriptor> desc, ChildProgressReportDetailedModel model)
        {
            desc.Add(ChildProgressReportTags.IntroHeader, new PdfFieldDescriptor
            {
                IsDuplicateKey = false,
                Type = PdfFieldTypeEnum.Text,
                Value = $"How {model.ChildFirstname} is progressing"
            });

            desc.Add(ChildProgressReportTags.ProgressOpeningParagraph, new PdfFieldDescriptor
            {
                IsDuplicateKey = false,
                Type = PdfFieldTypeEnum.Text,
                Value = $"We have enjoyed working with {model.ChildFirstname} at {model.ClassroomName} over the last few months."
            });

            desc.Add(ChildProgressReportTags.ProgressSummary, new PdfFieldDescriptor
            {
                IsDuplicateKey = false,
                Type = PdfFieldTypeEnum.TextListBulletPoints,
                Value = new List<string>
        {
          $"<b>{model.ChildFirstname} enjoys:</b> {model.ChildEnjoys}",
          $"<b>{model.ChildFirstname} has made good progress with:</b> {model.ChildProgressedWith}",
          $"<b>As a caregiver, you can support your child’s learning by:</b> {model.HowCanCaregiverHelpChild}"
        }
            });
        }

        private static void AddCoverPage(Dictionary<string, PdfFieldDescriptor> desc, ChildProgressReportDetailedModel model)
        {
            desc.Add(ChildProgressReportTags.ChildName, new PdfFieldDescriptor
            {
                IsDuplicateKey = true,
                Type = PdfFieldTypeEnum.Text,
                Value = $"{model.ChildFirstname} {model.ChildSurname}"
            });

            desc.Add(ChildProgressReportTags.ReportDate, new PdfFieldDescriptor
            {
                IsDuplicateKey = true,
                Type = PdfFieldTypeEnum.Text,
                Value = $"{model.ReportingPeriod} {DateTime.Parse(model.ReportingDate).Year}"
            });

            desc.Add(ChildProgressReportTags.ClassroomGroup, new PdfFieldDescriptor
            {
                IsDuplicateKey = true,
                Type = PdfFieldTypeEnum.Text,
                Value = model.ClassroomName
            });
        }
    }
}
