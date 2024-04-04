using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.ContentManagement.Repositories;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.Portal
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class StoryBookMutationExtension
    {
        public bool UpdateStoryBookAndParts(
            [Service] ContentManagementRepository contentRepo,
            List<StoryBookModel> storyBookParts,
            int storyBookContentId,
            Guid localeId,
            string currentBookPartsIds
            )
        {
            // Handle the question
            foreach (var part in storyBookParts)
            {
                Dictionary<string, object> questionDict = new Dictionary<string, object>
                {
                    { "question", part.QuestionText },
                    { "name", part.QuestionName }
                };

                // New question
                if (part.QuestionId == "")
                {
                    part.QuestionId = contentRepo.Create(part.QuestionContentTypeId, localeId, questionDict).ToString();
                }

                // Old question with change
                if (part.QuestionId != "" && part.QuestionChange)
                {
                    contentRepo.Update(int.Parse(part.QuestionId), localeId, questionDict);
                }
            }

            List<string> bookPartIds = new List<string>();
            // Handle the book parts
            foreach (var part in storyBookParts)
            {
                Dictionary<string, object> partDict = new Dictionary<string, object>
                {
                    { "storyBookPartQuestions", part.QuestionId },
                    { "partText", part.PartText },
                    { "part", part.Part.Replace("Part ", "") },
                    { "name", part.Name}
                };

                // New book part
                if (part.Id == "")
                {
                    part.Id = contentRepo.Create(part.PartContentTypeId, localeId, partDict).ToString();
                }

                // Old book part with change
                if (part.Id != "")
                {
                    contentRepo.Update(int.Parse(part.Id), localeId, partDict);
                }

                if (currentBookPartsIds.IndexOf(part.Id) == -1)
                {
                    bookPartIds.Add(part.Id);
                }
            }

            if (bookPartIds.Count > 0)
            {
                // Save list of book part ids to story book
                Dictionary<string, object> storyBookDict = new Dictionary<string, object>
                {
                    { "storyBookParts", currentBookPartsIds + "," + string.Join(",", bookPartIds) }
                };

                //update sub cat with skill ids
                contentRepo.Update(storyBookContentId, localeId, storyBookDict);
            }


            return true;
        }
    }
}
