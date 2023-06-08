import { useQuery } from '@apollo/client';
import { FranchisorDto, PermissionEnum, usePanel } from '@ecdlink/core';
import { GetAllFranchisor } from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import FranchisorPanelCreate from './franchisor-panel-create/franchisor-panel-create';
import FranchisorPanelEdit from './franchisor-panel-edit/franchisor-panel-edit';
import { SearchIcon } from '@heroicons/react/solid';
import debounce from 'lodash.debounce';

export default function Franchisors() {
  const { hasPermission } = useUser();
  const { data, refetch } = useQuery(GetAllFranchisor, {
    fetchPolicy: 'cache-and-network',
  });

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.GetAllFranchisor) {
      const copyItems = data.GetAllFranchisor.filter(
        (v) => v.user !== null && v.user.isActive === true
      ).map((item: FranchisorDto) => ({
        ...item,
        fullName: `${item.user?.firstName} ${item.user?.surname}`,
        isActive: item.user?.isActive,
        idNumber: item.user?.idNumber,
        _view: undefined,
        _edit: undefined,
        _url: undefined,
      }));
      setTableData(copyItems);
    }
  }, [data]);

  const panel = usePanel();
  const displayPanel = () => {
    panel({
      noPadding: true,
      title: 'Create Franchisor',
      render: (onSubmit: any) => (
        <FranchisorPanelCreate
          key={`franchisorPanelCreate`}
          closeDialog={(userCreated: boolean) => {
            onSubmit();

            if (userCreated) {
              refetch();
            }
          }}
        />
      ),
    });
  };

  const displayEditPanel = (franchisor: FranchisorDto) => {
    panel({
      noPadding: true,
      title: 'Edit Franchisor',
      render: (onSubmit: any) => (
        <FranchisorPanelEdit
          franchisor={franchisor}
          key={`franchisorPanelEdit`}
          closeDialog={(userCreated: boolean) => {
            onSubmit();

            if (userCreated) {
              refetch();
            }
          }}
        />
      ),
    });
  };

  const [searchValue, setSearchValue] = useState('');

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <span className="text-lg font-medium leading-6 text-gray-900"></span>
            <div className="relative w-full">
              <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
              </span>
              <input
                onClick={search}
                className="bg-uiBg focus:outline-none sm:text-md block w-6/12 rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                placeholder="      Search"
              />
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              {hasPermission(PermissionEnum.create_user) && (
                <button
                  onClick={displayPanel}
                  type="button"
                  className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  Create Franchisor
                </button>
              )}
            </div>
          </div>

          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'idNumber', use: 'id / Passport' },
                    { field: 'fullName', use: 'name' },
                    { field: 'isActive', use: 'Active' },
                  ]}
                  rows={tableData}
                  editRow={
                    hasPermission(PermissionEnum.update_user) &&
                    displayEditPanel
                  }
                  searchInput={searchValue}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
