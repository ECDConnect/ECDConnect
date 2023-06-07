using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.FileIO;
using System;
using System.Linq;
using System.Reflection;
using static DotLiquid.Variable;

namespace ECDLink.DataAccessLayer.Helpers
{
    public static class PaginationHelper
    {
        // These are custom filters that are handled seperately from the rest of the filters
        private static readonly string[] _customFilterTypes = new string[] { nameof(SiteAddress.Province).ToLowerInvariant(), Roles.ADMINISTRATOR.ToLowerInvariant() };


        public static IQueryable<T> AddFiltering<T>(IFilterByField[] inputFilter, in IQueryable<T> usersQuery)
        {
            IQueryable<T> newUsersQuery = usersQuery.AsQueryable();

            if (inputFilter is null || !inputFilter.Any())
                return newUsersQuery;

            foreach (var filter in inputFilter)
            {
                var fieldType = typeof(T).GetProperty(filter?.FieldName)?.PropertyType;

                // This filter is not actually a field type and was handled seperately.
                if (_customFilterTypes.Contains(fieldType?.Name?.ToLowerInvariant()))
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

                            /// TODO: Do I still need this? Does above work as expected?
                            //if (filter.Value is null)
                            //{
                            //    newUsersQuery = newUsersQuery.Where(u => EF.Property<object>(u, filter.FieldName) == null);
                            //}
                            //else if (fieldType.Equals(typeof(DateTime)))
                            //{
                            //    if (!DateTime.TryParse(filter.Value, out var date))
                            //        throw new ArgumentException($"Filter value {filter.Value} is not a valid date time.");
                            //    newUsersQuery = newUsersQuery.Where(u => EF.Property<DateTime?>(u, filter.FieldName) == date);
                            //}
                            //else if (fieldType.Equals(typeof(Guid)))
                            //{
                            //    if (!Guid.TryParse(filter.Value, out var guid))
                            //        throw new ArgumentException($"Filter value {filter.Value} is not a valid Guid.");
                            //    newUsersQuery = newUsersQuery.Where(u => guid == EF.Property<Guid>(u, filter.FieldName));
                            //}
                            //else if (fieldType.Equals(typeof(int)))
                            //{
                            //    int.TryParse(filter.Value, out var @int);
                            //    newUsersQuery = newUsersQuery.Where(u => @int == EF.Property<int?>(u, filter.FieldName));
                            //}
                            //else if (fieldType.Equals(typeof(decimal)))
                            //{
                            //    decimal.TryParse(filter.Value, out var @decimal);
                            //    newUsersQuery = newUsersQuery.Where(u => @decimal == EF.Property<decimal?>(u, filter.FieldName));
                            //}
                            //else if (fieldType.Equals(typeof(bool)))
                            //{
                            //    bool.TryParse(filter.Value, out var @bool);
                            //    newUsersQuery = newUsersQuery.Where(u => @bool == EF.Property<bool?>(u, filter.FieldName));
                            //}
                            //else // string
                            //{
                            //    //var a = newUsersQuery.Where(u => EF.Property<string>(u, filter.FieldName) == filter.Value).Select(a => a).ToList();
                            //    newUsersQuery = newUsersQuery.Where(u => EF.Property<string>(u, filter.FieldName) == filter.Value);
                            //}
                        }
                        break;
                    case InputFilterComparer.Contains:
                        newUsersQuery = newUsersQuery.Where(u => EF.Property<string>(u, filter.FieldName).Contains(filter.Value));
                        break;
                    case InputFilterComparer.GreaterThan:
                        {
                            if (fieldType.Equals(typeof(DateTime))
                                && DateTime.TryParse(filter.Value, out var date))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<DateTime?>(u, filter.FieldName) > date);
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
                            else if (fieldType.Equals(typeof(int))
                                && int.TryParse(filter.Value, out int intGt))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<int?>(u, filter.FieldName) < intGt);
                        }
                        break;
                    case InputFilterComparer.GreaterThanOrEqual:
                        {
                            if (fieldType.Equals(typeof(DateTime))
                                && DateTime.TryParse(filter.Value, out var dateGte))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<DateTime?>(u, filter.FieldName) >= dateGte);
                            else if (fieldType.Equals(typeof(int))
                                && int.TryParse(filter.Value, out int intGte))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<int?>(u, filter.FieldName) >= intGte);
                        }
                        break;
                    case InputFilterComparer.LessThanOrEqual:
                        {
                            if (fieldType.Equals(typeof(DateTime))
                                && DateTime.TryParse(filter.Value, out var dateLte))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<DateTime?>(u, filter.FieldName) <= dateLte);
                            else if (fieldType.Equals(typeof(int))
                                && int.TryParse(filter.Value, out int intLte))
                                newUsersQuery = newUsersQuery.Where(u => EF.Property<int?>(u, filter.FieldName) <= intLte);
                        }
                        break;
                }
            }

            return newUsersQuery;
        }

        public static object CastInputToFieldType(in object inputValue, in Type castToType)
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

        public static IQueryable<T> AddSorting<T>(ISortByField[] sortBy, in IQueryable<T> usersQuery, ISortByField[] defaultSortFields = null)
        {
            // Don't mutate the input:
            var newQuery = usersQuery.AsQueryable();

            if (sortBy?.Any() ?? false)
            {
                foreach (var sort in sortBy)
                {
                    var sortByFieldName = sort?.FieldName;

                    if (sort.Descending)
                        return newQuery.OrderByDescending(u => EF.Property<object>(u, sortByFieldName));
                    else
                        return newQuery.OrderBy(u => EF.Property<object>(u, sortByFieldName));
                }
            }
            else
            // Add default sort.
            {
                if (defaultSortFields?.Any() ?? false)
                {
                    foreach (var field in defaultSortFields.Select((value, i) => new { i, value }))
                    {
                        if (field.i == 0)
                            newQuery = newQuery.OrderBy(u => EF.Property<object>(u, field.value.FieldName));

                        else
                        {
                            newQuery = (newQuery as IOrderedQueryable<T>).ThenBy(u => EF.Property<object>(u, field.value.FieldName)).AsQueryable();

                        }
                    }

                    return newQuery;
                }
            }

            return newQuery;
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
