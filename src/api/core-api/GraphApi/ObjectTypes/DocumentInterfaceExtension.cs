using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.ObjectTypes
{
    [ExtendObjectType(typeof(IDocumentQueryable))]
    public class DocumentInterfaceExtension
    {
        [Permission(PermissionGroups.DOCUMENTS, GraphActionEnum.View)]
        public IEnumerable<Document> FilterDocumentsByType(
          [Parent] IDocumentQueryable post,
          [Service] AuthenticationDbContext context,
          FileTypeEnum type)
        {
            var filterDocuments = context.Documents
                                    .Include(x => x.DocumentType)
                                    .Where(dt => dt.DocumentType.EnumId == type);

            return filterDocuments;
        }
    }
}
