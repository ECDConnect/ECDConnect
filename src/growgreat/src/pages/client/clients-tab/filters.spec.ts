import { filterBySort } from './filters';

describe('filterBySort', () => {
  const list = [
    {
      alertSeverity: 'success',
      extraData: {
        nextVisitDate: new Date('2022-12-30'),
        age: 45,
        user: { firstName: 'bob', surname: 'Smith' },
      },
    },
    {
      alertSeverity: 'none',
      extraData: {
        nextVisitDate: new Date('2023-02-30'),
        age: 25,
        user: { firstName: 'alice', surname: 'Brown' },
      },
    },
    {
      alertSeverity: 'warning',
      extraData: {
        nextVisitDate: new Date('2022-01-20'),
        age: 35,
        user: { firstName: 'charlie', surname: 'Miller' },
      },
    },
  ];

  it('should sort list by firstName in ascending order', () => {
    const sort = [{ value: 'firstName' }];

    // @ts-ignore
    const result = filterBySort(list, sort);

    const firstNames = result.map((item) => item?.extraData?.user?.firstName);
    expect(firstNames).toEqual(['alice', 'bob', 'charlie']);
  });

  it('should sort list by surname in ascending order', () => {
    const sort = [{ value: 'surname' }];

    // @ts-ignore
    const result = filterBySort(list, sort);
    const surnames = result.map((item) => item?.extraData?.user?.surname);
    expect(surnames).toEqual(['Brown', 'Miller', 'Smith']);
  });

  it('should sort list by priority in descending order', () => {
    const sort = [{ value: 'priority' }];

    // @ts-ignore
    const result = filterBySort(list, sort);

    const alertSeverityList = result.map((item) => item.alertSeverity);
    expect(alertSeverityList).toEqual(['warning', 'success', 'none']);
  });

  it('should sort list by age in ascending order', () => {
    const sort = [{ value: 'age' }];

    // @ts-ignore
    const result = filterBySort(list, sort);

    const ageList = result.map((item) => item.extraData?.age);
    expect(ageList).toEqual([25, 35, 45]);
  });

  it('should sort list by next visit date in ascending order', () => {
    const sort = [{ value: 'visitDate' }];

    // @ts-ignore
    const result = filterBySort(list, sort);

    const ageList = result.map((item) => item.extraData?.nextVisitDate);
    expect(ageList).toEqual([
      new Date('2022-01-20'),
      new Date('2022-12-30'),
      new Date('2023-02-30'),
    ]);
  });
});
