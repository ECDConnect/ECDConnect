using HotChocolate;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;
using System;
using System.Reflection;

namespace ECDLink.EGraphQL.Registration
{
    /// <summary>
    /// Pins field naming to the Hot Chocolate 12 spelling.
    ///
    /// Hot Chocolate 13 changed how runs of consecutive capitals are camel-cased: the classic
    /// example is IPAddress, which produced iPAddress under v12 and produces ipAddress from v13
    /// onwards. That is a fix, but for this schema it is a breaking API change - 31 fields are
    /// spelled the v12 way, among them cTAText, pQARatings, prePQASiteVisits, pointsYTD,
    /// statementsIncomeExpensesPDFData and createPQARating. Renaming them would break the 222
    /// persisted operations, the admin portal's ad-hoc queries, and the generated types in
    /// @ecdlink/graphql, all of which would have to ship in lockstep with the API.
    ///
    /// This convention takes the casing decision back so the upgrade does not touch the public
    /// schema. It is applied globally rather than with per-property [GraphQLName] attributes
    /// because it also covers fields nobody has enumerated - most of the 31 appear in no
    /// persisted operation - and any field added later.
    ///
    /// The proof that it is faithful is schema.graphql: the snapshot was captured on v12 before
    /// this convention existed, and ECDLink.SchemaSnapshot --check must still pass with it in
    /// place. It should keep passing across every Hot Chocolate major.
    ///
    /// Removing this is a deliberate, breaking API change requiring a coordinated API and client
    /// release - not upgrade cleanup.
    /// </summary>
    public class LegacyNamingConventions : DefaultNamingConventions
    {
        private const string GetPrefix = "Get";
        private const string AsyncSuffix = "Async";

        public override string GetMemberName(MemberInfo member, MemberKind kind)
        {
            // An explicit [GraphQLName] is an author's decision, not a convention's - leave it be.
            if (member.IsDefined(typeof(GraphQLNameAttribute), inherit: true))
            {
                return base.GetMemberName(member, kind);
            }

            var name = member.Name;

            // Hot Chocolate trims these before casing, and has done so consistently across
            // versions; only the casing rule changed in v13.
            if (member is MethodInfo)
            {
                if (name.Length > GetPrefix.Length
                    && name.StartsWith(GetPrefix, StringComparison.Ordinal)
                    && char.IsUpper(name[GetPrefix.Length]))
                {
                    name = name.Substring(GetPrefix.Length);
                }

                if (name.Length > AsyncSuffix.Length
                    && name.EndsWith(AsyncSuffix, StringComparison.Ordinal))
                {
                    name = name.Substring(0, name.Length - AsyncSuffix.Length);
                }
            }

            return LowerFirstCharacter(name);
        }

        /// <summary>
        /// The v12 rule in full: lower-case the first character and leave the rest alone. That is
        /// what turns CTAText into cTAText instead of v13's ctaText.
        /// </summary>
        private static string LowerFirstCharacter(string name)
        {
            if (string.IsNullOrEmpty(name) || !char.IsUpper(name[0]))
            {
                return name;
            }

            var chars = name.ToCharArray();
            chars[0] = char.ToLowerInvariant(chars[0]);
            return new string(chars);
        }
    }
}
