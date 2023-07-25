using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Security;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace ECDLink.DataAccessLayer.Helpers
{
    public static class PaginationHelper
    {
        // These are custom filters that are handled seperately from the rest of the filters
        private static readonly string[] _customFilterTypes = new string[] { nameof(SiteAddress.Province).ToLowerInvariant(), Roles.ADMINISTRATOR.ToLowerInvariant() };


        public static IQueryable<T> AddFiltering<T>(IEnumerable<FilterByField> inputFilter, in IQueryable<T> usersQuery)
        {
            IQueryable<T> newUsersQuery = usersQuery.AsQueryable();

            if (inputFilter is null || !inputFilter.Any())
                return newUsersQuery;

            foreach (var filter in inputFilter)
            {
                var fieldType = typeof(T).GetProperty(filter?.FieldName)?.PropertyType;

                // This filter is not actually a field type and was handled seperately.
                if (_customFilterTypes.Contains(filter?.FieldName?.ToLowerInvariant()))
                    continue;

                // If field does not exist on this type, ignore it
                if (fieldType is null)
                    throw new ArgumentException($"Filter field {filter?.FieldName} does not exist on type {typeof(T).Name}.");

                var input = CastInputToFieldType(filter.Value, fieldType);
                switch (filter.FilterType)
                {
                    case null:
                    case InputFilterComparer.Equals:
                        {
                            newUsersQuery = newUsersQuery.Where(u => EF.Property<object>(u, filter.FieldName) == input);
                        }
                        break;
                    case InputFilterComparer.Contains:
                        newUsersQuery = newUsersQuery.Where(u => EF.Functions.ILike(EF.Property<string>(u, filter.FieldName), $"%{input}%"));
                        break;
                    case InputFilterComparer.ContainedBy:
                        newUsersQuery = newUsersQuery.Where(u => filter.Value.Contains(EF.Property<string>(u, filter.FieldName)));
                        break;
                    case InputFilterComparer.GreaterThan:
                        {
                            if (fieldType.Equals(typeof(DateTime))
                                && DateTime.TryParse(filter.Value, out var date))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<DateTime?>(u, filter.FieldName) > date);
                            else if (fieldType.Equals(typeof(decimal))
                                && decimal.TryParse(filter.Value, out decimal decimalGt))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<decimal?>(u, filter.FieldName) > decimalGt);
                            else if (fieldType.Equals(typeof(int))
                                && int.TryParse(filter.Value, out int intGt))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<int?>(u, filter.FieldName) > intGt);
                        }
                        break;
                    case InputFilterComparer.LessThan:
                        {
                            if (fieldType.Equals(typeof(DateTime))
                                && DateTime.TryParse(filter.Value, out var date))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<DateTime?>(u, filter.FieldName) < date);
                            else if (fieldType.Equals(typeof(decimal))
                                && decimal.TryParse(filter.Value, out decimal decimalLt))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<decimal?>(u, filter.FieldName) < decimalLt);
                            else if (fieldType.Equals(typeof(int))
                                && int.TryParse(filter.Value, out int intLt))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<int?>(u, filter.FieldName) < intLt);
                        }
                        break;
                    case InputFilterComparer.GreaterThanOrEqual:
                        {
                            if (fieldType.Equals(typeof(DateTime))
                                && DateTime.TryParse(filter.Value, out var dateGte))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<DateTime?>(u, filter.FieldName) >= dateGte);
                            else if (fieldType.Equals(typeof(decimal))
                               && decimal.TryParse(filter.Value, out decimal decimalGt))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<decimal?>(u, filter.FieldName) >= decimalGt);
                            else if (fieldType.Equals(typeof(int))
                                && int.TryParse(filter.Value, out int intGt))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<int?>(u, filter.FieldName) >= intGt);
                        }
                        break;
                    case InputFilterComparer.LessThanOrEqual:
                        {
                            if (fieldType.Equals(typeof(DateTime))
                                && DateTime.TryParse(filter.Value, out var dateLte))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<DateTime?>(u, filter.FieldName) <= dateLte);
                            else if (fieldType.Equals(typeof(decimal))
                                && decimal.TryParse(filter.Value, out decimal decimalLt))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<decimal?>(u, filter.FieldName) <= decimalLt);
                            else if (fieldType.Equals(typeof(int))
                                && int.TryParse(filter.Value, out int intLt))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<int?>(u, filter.FieldName) <= intLt);
                        }
                        break;
                }
            }

            return newUsersQuery;
        }

        private static object CastInputToFieldType(in object inputValue, in Type castToType)
        {
            if (inputValue is null)
            {
                return inputValue;
            }

            if (inputValue is string 
                && inputValue is not null 
                && inputValue.ToString().ToLowerInvariant().Equals("null"))
            {
                return null;
            }

            if (castToType == typeof(bool) && inputValue is string)
            {
                if (inputValue.Equals("1") || inputValue.Equals("true"))
                    return true;
                else if (inputValue.Equals("0") || inputValue.Equals("false"))
                    return false;
            }
            
            if (castToType.Equals(typeof(DateTime)))
            {
                DateTime.TryParse(inputValue?.ToString(), out var result);
                return result;
            }
            
            if (castToType.Equals(typeof(Guid)))
            {
                Guid.TryParse(inputValue?.ToString(), out var result);
                return result;
            }
            
            if (castToType.Equals(typeof(int)))
            {
                int.TryParse(inputValue?.ToString(), out var result);
                return result;
            }
            
            if (castToType.Equals(typeof(decimal)))
            {
                decimal.TryParse(inputValue?.ToString(), out var result);
                return result;
            }
            
            if (castToType.Equals(typeof(bool)))
            {
                bool.TryParse(inputValue?.ToString(), out var result);
                return result;
            }

            if (typeof(IConvertible).IsAssignableFrom(castToType))
            {
                return Convert.ChangeType(inputValue, castToType);
            }

            // string
            return inputValue?.ToString();
        }

        public static IQueryable<T> AddPaging<T>(int skip, int take, in IQueryable<T> usersQuery)
        {
            if (skip < 0 || take < 0)
                return usersQuery;

            return usersQuery
                .Skip(skip)
                .Take(take);
        }
    }
}
