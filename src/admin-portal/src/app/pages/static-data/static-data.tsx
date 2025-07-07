import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UiTable from '../../components/ui-table';
import { usePanel } from '@ecdlink/core';
import { EditStaticData } from './sub-pages/edit-static-data/edit-static-data';
import { SearchIcon } from '@heroicons/react/solid';
import debounce from 'lodash.debounce';
import { useTenant } from '../../hooks/useTenant';

export declare enum SiteDataSections {
  Sex = 'Sex',
  Race = 'Race',
  ChildAttendingReasons = 'Child Attending Reasons',
  Languages = 'Languages',
  Provinces = 'Provinces',
  Grants = 'Grants',
  EducationLevels = 'Education Levels',
  RelationshipToChild = 'Relationship to child',
  ReasonsForLeaving = 'Reasons for leaving',
}

const navigation = [
  // {
  //   name: 'Sex',
  //   section: 'Child registration',
  //   href: '/data/sex',
  //   query: 'GetAllGender',
  // },
  {
    name: 'Race',
    section: 'Child registration',
    href: '/data/race',
    query: 'GetAllRace',
  },
  {
    name: 'Older child attending reasons',
    section: 'Child registration',
    href: '/data/attending-reasons',
    query: 'GetAllProgrammeAttendanceReason',
  },
  {
    name: 'Languages',
    section: 'Child registration',
    href: '/data/languages',
    query: 'GetAllLanguage',
  },
  // {
  //   name: 'Provinces',
  //   href: '/data/provinces',
  //   query: 'GetAllProvince',
  // },
  {
    name: 'Grants',
    section: 'Child registration',
    href: '/data/grants',
    query: 'GetAllGrant',
  },
  {
    name: 'Education levels',
    section: 'Child registration',
    href: '/data/education-levels',
    query: 'GetAllEducation',
  },
  {
    name: 'Relationship to child',
    section: 'Child registration',
    href: '/data/relations',
    query: 'GetAllRelation',
  },
  {
    name: 'Child reasons for leaving',
    section: 'Remove child',
    href: '/data/reasons-for-leaving',
    query: 'GetAllReasonForLeaving',
  },
];

export function StaticData() {
  const history = useHistory();
  const tenant = useTenant();
  const panel = usePanel();
  const [sectionName, setSectionName] = useState('');
  useEffect(() => {
    // GO TO DEFAULT ROUTE
    async function init() {
      history.push(navigation[0].href);
    }

    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSection = (section: any, onCancel: () => void) => {
    switch (section?.name) {
      default:
        return (
          <EditStaticData
            query={section?.query}
            onCancel={onCancel}
            section={section}
          />
        );
    }
  };

  const openEditDialog = (section: any) => {
    setSectionName(section?.name);
    panel({
      render: (onSubmit, onCancel) => {
        return renderSection(section, onCancel);
      },
    });
  };
  const [searchValue, setSearchValue] = useState('');

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  return (
    <div>
      <div className=" -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="relative w-6/12 py-8">
            {searchValue === '' && (
              <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
              </span>
            )}
            <input
              className="bg-adminPortalBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
              placeholder="      Search by field or app section..."
              onChange={search}
            />
          </div>
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <UiTable
              columns={[
                { field: 'name', use: 'Field' },
                { field: 'section', use: 'App section' },
              ]}
              rows={navigation}
              component={'cms'}
              viewRow={openEditDialog}
              searchInput={searchValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaticData;
