import { InfantDto, MotherDto } from '@ecdlink/core';
import { SearchDropDownOption, UserAlertListDataItem } from '@ecdlink/ui';

const coloursOrder = {
  error: 1,
  warning: 2,
  success: 3,
  none: 4,
};

export type SortBy = 'priority' | 'visitDate' | 'firstName' | 'surname' | 'age';

interface SortOptions {
  id: string;
  label: string;
  value: SortBy;
}

interface ExtraData {
  under6Months: boolean;
  age?: string;
}

export type ExtraMotherData = MotherDto & ExtraData;
export type ExtraInfantData = InfantDto & ExtraData;

export const clientTypeOptions = [
  {
    id: '01',
    label: 'Pregnant mom',
    value: 'pregnant',
  },
  {
    id: '02',
    label: 'Child',
    value: 'child',
  },
];

export const ageOptions = [
  {
    id: '01',
    label: 'Under 6 months',
    value: 'under',
  },
  {
    id: '02',
    label: 'Over 6 months',
    value: 'over',
  },
];

export const sortOptions: SortOptions[] = [
  {
    id: '01',
    label: 'Priority',
    value: 'priority',
  },
  {
    id: '02',
    label: 'Visit date',
    value: 'visitDate',
  },
  {
    id: '03',
    label: 'First name',
    value: 'firstName',
  },
  {
    id: '04',
    label: 'Surname',
    value: 'surname',
  },
  {
    id: '05',
    label: 'Age',
    value: 'age',
  },
];

export const filterByClientType = (
  list: (
    | UserAlertListDataItem<ExtraMotherData>
    | UserAlertListDataItem<ExtraInfantData>
  )[],
  motherList: UserAlertListDataItem<ExtraMotherData>[],
  infantList: UserAlertListDataItem<ExtraInfantData>[],
  clientType: SearchDropDownOption<string>[]
) => {
  switch (clientType[0]?.value) {
    case 'pregnant':
      return motherList;
    case 'child':
      return infantList;
    default:
      return list;
  }
};

export const filterByAge = (
  list: (
    | UserAlertListDataItem<ExtraMotherData>
    | UserAlertListDataItem<ExtraInfantData>
  )[],
  age: SearchDropDownOption<string>[]
) => {
  if (!age[0]?.value) return list;
  return list.filter((item) =>
    age[0].value === 'under'
      ? !!item?.extraData?.under6Months
      : !item?.extraData?.under6Months
  );
};

export const filterBySort = (
  list: (
    | UserAlertListDataItem<ExtraMotherData>
    | UserAlertListDataItem<ExtraInfantData>
  )[],
  sort: SearchDropDownOption<SortBy>[]
) => {
  switch (sort[0]?.value) {
    case 'firstName':
      return list.sort((a, b) =>
        (a?.extraData?.user?.firstName || '')?.localeCompare(
          b?.extraData?.user?.firstName || '',
          'es',
          { sensitivity: 'base' }
        )
      );
    case 'surname':
      return list.sort((a, b) =>
        (a?.extraData?.user?.surname || '')?.localeCompare(
          b?.extraData?.user?.surname || '',
          'es',
          { sensitivity: 'base' }
        )
      );
    case 'priority':
      return list.sort(
        (a, b) => coloursOrder[a.alertSeverity] - coloursOrder[b.alertSeverity]
      );
    case 'age':
      return list.sort(
        (a, b) => Number(a?.extraData?.age) - Number(b?.extraData?.age)
      );
    case 'visitDate':
      return list.sort((a, b) => {
        if (a?.extraData?.nextVisitDate === null) return 1;
        if (b?.extraData?.nextVisitDate === null) return -1;

        return (
          new Date(a?.extraData?.nextVisitDate || '').getTime() -
          new Date(b?.extraData?.nextVisitDate || '').getTime()
        );
      });
    default:
      return list;
  }
};

export const searchList = (
  list: (
    | UserAlertListDataItem<ExtraMotherData>
    | UserAlertListDataItem<ExtraInfantData>
  )[],
  searchTerm: string
) => {
  const lowerSearch = searchTerm.toLowerCase();
  return list.filter((item) =>
    item?.title?.toLowerCase().includes(lowerSearch)
  );
};
