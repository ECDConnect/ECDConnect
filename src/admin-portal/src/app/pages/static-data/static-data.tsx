import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StaticDataRoutes } from '../../app.routes';
import SubNavigationLink from '../../components/sub-navigation-link/sub-navigation-link';
import UiTable from '../../components/ui-table';
import AttendingReasonPanel from './sub-pages/attending-reasons/components/attending-reason-panel/attending-reason-panel';
import { DialogPosition } from '@ecdlink/ui';
import { useDialog } from '@ecdlink/core';
import AttendingReasonsView from './sub-pages/attending-reasons/attending-reasons';
import GenderView from './sub-pages/gender/gender';
import RaceView from './sub-pages/race/race';
import LanguageView from './sub-pages/language/language';
import ProvinceView from './sub-pages/provinces/provinces';
import GrantView from './sub-pages/grants/grants';
import EducationLevelView from './sub-pages/education-levels/education-levels';
import RelationsView from './sub-pages/relations/relations';
import ReasonForLeavingView from './sub-pages/reason-for-leaving/reason-for-leaving';
import { EditStaticData } from './sub-pages/edit-static-data/edit-static-data';

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
  {
    name: 'Sex',
    section: 'Child registration',
    href: '/data/sex',
    query: 'GetAllGender',
  },
  {
    name: 'Race',
    section: 'Child registration',
    href: '/data/race',
    query: 'GetAllRace',
  },
  {
    name: 'Child Attending Reasons',
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
  {
    name: 'Provinces',
    href: '/data/provinces',
    query: 'GetAllProvince',
  },
  {
    name: 'Grants',
    section: 'Child registration',
    href: '/data/grants',
    query: 'GetAllGrant',
  },
  {
    name: 'Education Levels',
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
    name: 'Reasons for leaving',
    section: 'Child registration',
    href: '/data/reasons-for-leaving',
    query: 'GetAllReasonForLeaving',
  },
];

export function StaticData() {
  const history = useHistory();
  const dialog = useDialog();
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

  const showCompleteProfileBlockingDialog = (section: any) => {
    console.log({ section });
    setSectionName(section?.name);
    dialog({
      color: 'bg-white',
      position: DialogPosition.Full,
      render: (onSubmit, onCancel) => {
        return renderSection(section, onCancel);
      },
    });
  };

  return (
    // <div className="shadow flex-1 min-w-0 bg-white xl:flex rounded bg-white">
    //   <div className="border-b border-gray-200 xl:border-b-0 xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-uiMidDark ">
    //     {navigation.map((item) => (
    //       <SubNavigationLink
    //         key={`${item.name}-${new Date().getTime()}`}
    //         item={item}
    //       ></SubNavigationLink>
    //     ))}
    //   </div>

    //   <div className="bg-uiMidDark lg:min-w-0 lg:flex-1">
    //     <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
    //       <div className="relative h-full" style={{ minHeight: '36rem' }}>
    //         <StaticDataRoutes />
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div>
      <div className=" -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <UiTable
              columns={[
                { field: 'name', use: 'Field' },
                { field: 'section', use: 'App section' },
              ]}
              rows={navigation}
              component={'cms'}
              viewRow={
                showCompleteProfileBlockingDialog
                // hasPermission(PermissionEnum.update_static) &&
                // viewSelectedRow
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaticData;
