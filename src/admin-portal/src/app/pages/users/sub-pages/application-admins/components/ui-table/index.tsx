import {
  Button,
  DialogPosition,
  LoadingSpinner,
  Typography,
  classNames,
} from '@ecdlink/ui';
import Fuse from 'fuse.js';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Table from 'react-tailwind-table';
import { useMutation } from '@apollo/client';
import {
  sentInviteToMultipleUsers,
  deleteMultipleUsers,
} from '@ecdlink/graphql';
import { PaperAirplaneIcon, TrashIcon } from '@heroicons/react/solid';
import { NOTIFICATION, useDialog, useNotifications } from '@ecdlink/core';
import { ContentTypes } from '../../../../../../constants/content-management';
import { UiTableProps } from './type';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import { useUserRole } from '../../../../../../hooks/useUserRole';

export default function UiTable({
  columns = [],
  rows = [],
  options = {},
  urlRow,
  searchInput,
  component,
  viewRow,
  isLoading,
  onBulkActionCallback,
  languages,
  noBulkSelection,
  refetchData,
}: UiTableProps) {
  const [inviteRows, setInviteRows] = useState<boolean>(false);
  const { setNotification } = useNotifications();
  const { isAdministrator, isSuperAdmin } = useUserRole();

  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [searchValue, setSearchValue] = useState('');
  const [confirmationTitle, setConfirmTitle] = useState(
    'Are you sure you want to delete this content?'
  );
  const [confirmationMessage, setConfirmMessage] = useState(
    'You will not be able to recover this content if you delete it now. This will change what practitioners see on the app and might change items they have edited previously.'
  );
  const [confirmationTrue, setConfirmTrue] = useState('Delete');
  const [confirmationFalse, setConfirmFalse] = useState('Keep editing');

  const [searchRows, setSearchRows] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const searchKeys = useRef(columns.map(({ field }) => field));
  const fuseOptions = {
    keys: searchKeys.current,
    shouldSort: false,
    threshold: 0,
    distance: 0,
  };
  const fuse = useRef(new Fuse(rows, fuseOptions));

  const dialog = useDialog();

  const [sendInvitations, { loading: invitationsLoading }] = useMutation(
    sentInviteToMultipleUsers,
    {
      variables: {
        userIds: [],
      },
      fetchPolicy: 'network-only',
    }
  );
  const [deactivateUsers, { loading: deactivating }] = useMutation(
    deleteMultipleUsers,
    {
      variables: {
        ids: [],
      },
      fetchPolicy: 'network-only',
    }
  );

  const inviteUsers = useCallback(() => {
    sendInvitations({
      variables: {
        userIds: selectedRows,
      },
    })
      .then((res) => {
        if (res.data?.sendBulkInviteToPortal?.success.length > 0) {
          setNotification({
            title: ` Successfully Sent ${res.data?.sendBulkInviteToPortal?.success.length} Invites!`,
            variant: NOTIFICATION.SUCCESS,
          });
          setSearchRows([]);
        }
        if (res.data?.sendBulkInviteToPortal?.failed.length > 0) {
          setNotification({
            title: ` Failed to Send to ${res.data?.sendBulkInviteToPortal?.failed.length} Users!`,
            variant: NOTIFICATION.ERROR,
          });
          setSearchRows([]);
        }
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to send invitations',
          variant: NOTIFICATION.ERROR,
        });
      });
  }, [selectedRows, sendInvitations, setNotification]);

  const deactivateUser = useCallback(() => {
    deactivateUsers({
      variables: {
        ids: selectedRows,
      },
    })
      .then((res) => {
        if (res.data?.bulkDeleteUser?.success.length > 0) {
          setNotification({
            title: ` Successfully Deactivated ${res.data?.bulkDeleteUser?.success.length} Users!`,
            variant: NOTIFICATION.SUCCESS,
          });
          refetchData();
          setSelectedRows([]);
        }
        if (res.data?.bulkDeleteUser?.failed.length > 0) {
          setNotification({
            title: ` Failed to Deactivate ${res.data?.bulkDeleteUser?.failed.length} Users!`,
            variant: NOTIFICATION.ERROR,
          });
          setSelectedRows([]);
        }
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to deactivate',
          variant: NOTIFICATION.ERROR,
        });
      });
  }, [deactivateUsers, refetchData, selectedRows, setNotification]);

  const handleBulkDelete = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title={`Deactivate ${selectedRows?.length} Administrators?`}
          message={`Are you sure you want to deactivate these Administrators? Administrators will lose their access immediately. Make sure you have communicated this to Administrators before deactivating them.`}
          btnText={['Yes, deactivate Administrators', 'No, Cancel']}
          onCancel={() => {
            onCancel();
            setSelectedRows([]);
          }}
          onSubmit={() => {
            deactivateUser();
            onSubmit();
          }}
        />
      ),
    });
  }, [deactivateUser, dialog, selectedRows?.length]);

  const handleBulkInvitation = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title={`Resend invitation to ${selectedRows?.length} Administrators?`}
          message={`Are you sure you want to send the invitation to the Administrators selected?`}
          btnText={['Yes, resend', 'No, Cancel']}
          onCancel={() => {
            onCancel();
            setSelectedRows([]);
          }}
          onSubmit={() => {
            inviteUsers();
            onSubmit();
          }}
        />
      ),
    });
  }, [inviteUsers, dialog, selectedRows?.length]);

  useEffect(() => {
    fuse.current = new Fuse(rows, fuseOptions);
    setSearchRows(getSearchResults());
    setLastUpdate(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const getSearchResults = useCallback(() => {
    if (!searchValue) {
      return rows;
    }
    return fuse.current.search(searchValue).map((result) => result.item);
  }, [rows, searchValue]);

  useEffect(() => {
    setSearchRows(getSearchResults());
    setLastUpdate(Date.now());
    if (searchInput) {
      setSearchValue(searchInput);
    }
  }, [getSearchResults, searchInput]);

  const makeColumns = (cols: any[] = []) => {
    const selectColumn = {
      field: 'select',
      use: '',
      Header: 'Select',
      accessor: '', // Set the accessor value based on your data structure
      Cell: null,
    };

    if (noBulkSelection) {
      return columns;
    }
    if (component === 'cms' || component === 'roles') {
      return [...columns];
    }
    const columnsWithSelect = [selectColumn, ...cols];
    return [...columnsWithSelect, ...columns];
  };

  const handleRowSelect = (
    event: ChangeEvent<HTMLInputElement>,
    row: { id: any }
  ) => {
    const selectedRowId = row.id;
    const isChecked = event.target.checked;

    if (selectedRows.length === 0) {
      setInviteRows(!inviteRows);
    }

    setSelectedRows((prevSelectedRows) => {
      if (isChecked) {
        return [...prevSelectedRows, selectedRowId];
      } else {
        return prevSelectedRows.filter(
          (selectedRow) => selectedRow !== selectedRowId
        );
      }
    });
  };

  const makeRows = () => {
    if ((!searchRows?.length && searchValue) || !rows.length) {
      return [{ [columns[0]?.field]: 'No entries found' }];
    }

    return ((searchRows as any[]) || []).map((row: any) => {
      let rowKey = 1;

      ++rowKey;

      return row;
    });
  };

  const formatDate = (value: string | number | Date) => {
    try {
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());
      return `${day}/${month}/${year}`;
    } catch (e) {
      return '';
    }
  };

  const renderFormat = (row: any, column: any, display_value: any) => {
    if ((!searchRows?.length && searchValue) || !rows.length) {
      return column.field === columns[0].field ? display_value : <></>;
    }
    let rowValue: any;

    const checkboxCell = (
      <input
        type="checkbox"
        className="form-checkbox text-primary border-gray-30 focus:border-secondary focus:outline h-5 w-5 rounded "
        checked={selectedRows.includes(row.id)}
        onChange={(event) => handleRowSelect(event, row)}
      />
    );
    if (
      column.field === 'select' &&
      component !== 'cms' &&
      component !== 'roles'
    ) {
      return checkboxCell;
    } else if (typeof display_value === 'boolean') {
      rowValue = (
        <div className="ml-1 flex cursor-pointer">
          {display_value ? (
            <p className="text-successMain ">Active</p>
          ) : (
            <p className="text-errorMain text-normal">Inactive</p>
          )}
        </div>
      );
    } else if (
      column.field.match(/created|createdAt|updated|insertedDate|updatedAt/) &&
      column.field !== 'createdByName'
    ) {
      rowValue = (
        <span
          className="cursor-pointer overflow-ellipsis"
          onClick={() => {
            viewRow(row);
          }}
        >
          {formatDate(display_value)}
        </span>
      );
    } else if (column.field === 'roles') {
      rowValue = (
        <div className="ml-0 flex cursor-pointer items-center">
          {display_value?.map((item: any) => {
            const chipColor = (role?: string) => {
              switch (role) {
                case 'Administrator':
                  return 'bg-infoMain';
                case 'SuperAdmin':
                  return 'bg-infoMain';
                case 'ContentManager':
                  return 'bg-tertiary';
                case 'DesignManager':
                  return 'bg-secondary';
                default:
                  return 'bg-primary';
              }
            };
            return (
              <div
                key={`role_` + item?.id}
                className={
                  `${chipColor(item?.name)}` +
                  ' m-1 rounded-full py-1 px-3 text-xs text-white'
                }
              >
                {item?.name}
              </div>
            );
          })}
        </div>
      );
    } else if (column.type === 'workflowStatus') {
      rowValue = (
        <span
          className={classNames(
            'inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-white ',
            display_value && display_value[0].statusColor
          )}
        >
          {display_value && display_value[0].statusValue}
        </span>
      );
    } else {
      rowValue =
        typeof display_value === 'string' ? (
          <div className="inline-block overflow-ellipsis ">
            <span>{display_value}</span>
          </div>
        ) : (
          <div>{display_value}</div>
        );
    }

    return (
      <div
        onClick={() => {
          viewRow(row);
        }}
        className={'cursor-pointer'}
      >
        {rowValue}{' '}
      </div>
    );
  };

  useEffect(() => {
    if (component === ContentTypes.COACHING_CIRCLE_TOPICS) {
      setConfirmTitle(
        'Are you sure you want to delete ' + selectedRows.length + ' items?'
      );
      setConfirmMessage(
        'Coaches will no longer be able to see this content in the app.'
      );
      setConfirmTrue('Yes, delete');
      setConfirmFalse('No, cancel');
    }
  }, [component, selectedRows.length]);

  const deleteDialog = useCallback(() => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title={confirmationTitle}
          message={confirmationMessage}
          onCancel={onClose}
          btnText={[`${confirmationTrue}`, `${confirmationFalse}`]}
          onSubmit={() => {
            onClose();
          }}
        />
      ),
    });
  }, [
    confirmationFalse,
    confirmationMessage,
    confirmationTitle,
    confirmationTrue,
    dialog,
  ]);

  const renderBulkActions = useMemo(() => {
    if (component === ContentTypes.COACHING_CIRCLE_TOPICS) {
      return (
        <Button
          className="rounded-2xl px-2"
          type="filled"
          color="errorBg"
          textColor="tertiary"
          text="Delete"
          icon="TrashIcon"
          iconPosition="end"
          onClick={deleteDialog}
        />
      );
    }

    return (
      <>
        <Button
          className="mr-4 rounded-xl px-6 py-0"
          type="filled"
          isLoading={invitationsLoading}
          disabled={invitationsLoading}
          color="secondary"
          onClick={handleBulkInvitation}
        >
          <PaperAirplaneIcon color="white" className="mr-2 h-4 w-4" />
          <Typography type="help" color="white" text="Resend Invitations" />
        </Button>
        {isSuperAdmin && (
          <Button
            className="rounded-xl px-6 py-0"
            type="outlined"
            isLoading={deactivating}
            disabled={deactivating}
            color="tertiary"
            onClick={handleBulkDelete}
          >
            <TrashIcon color="tertiary" className="mr-2 h-4 w-4">
              {' '}
            </TrashIcon>
            <Typography
              type="help"
              color="tertiary"
              text={'Deactivate User'}
            ></Typography>
          </Button>
        )}
      </>
    );
  }, [
    component,
    handleBulkDelete,
    deactivating,
    deleteDialog,
    invitationsLoading,
    handleBulkInvitation,
  ]);

  if (isLoading) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor="infoMain"
        backgroundColor="uiBg"
        className="my-4"
      />
    );
  }

  return (
    <div className="table-top w-full overflow-hidden rounded-lg shadow-lg">
      {selectedRows?.length >= 1 && (
        <div className="bg-infoMain flex w-full flex-row items-center justify-between py-2 px-4">
          <div className="w-4/12">
            <p className="text-md text-white">
              {selectedRows?.length} Selected
            </p>
          </div>
          <div className="flex w-6/12 flex-row items-center justify-end">
            {renderBulkActions}
          </div>
        </div>
      )}

      <Table
        key={`table-${lastUpdate}`}
        row_render={renderFormat}
        should_export={options.should_export || false}
        show_search={options.show_search || false}
        styling={{
          base_bg_color: 'white',
          base_text_color: 'text-gray-900',
          top: options.top || {
            elements: {
              main: 'hidden',
            },
          },
          main: 'rounded-lg',
          table_head: {
            table_row: ` mb-10 border-b-2 border-secondary bg-blue-50 `,
            table_data: `px-6 py-8 pl-6 pr-6 pt-4 pb-4 bg-quaternary text-left text-xs font-medium text-gray-500 uppercase tracking-wider leading-none bg-D2F1F9`,
          },
          table_body: {
            main: ``,
            // table_row: 'border-none bg-secondary ',
            table_row: 'border-none py-6 bg-white',

            table_data:
              'truncate w-20 px-6 pt-2 pb-2 text-sm font-medium text-gray-900 border-b border-gray-100',
          },
          footer: options.footer || {
            main: `${rows.length < 10 ? 'hidden' : ''} mt-8 mx-5 table-footer`,
            statistics: {
              main: `${
                rows.length < 10 ? 'hidden' : ''
              } text-gray-600 table-stats md:w-auto md:flex-row`,
              bold_numbers: `text-gray-900 font-bold`,
            },
            page_numbers: ` text-secondary page-numbers z-10 relative inline-flex items-center px-4 py-2 text-sm font-medium w-4`,
          },
        }}
        columns={makeColumns()}
        rows={makeRows()}
        per_page={20}
        no_content_text="-"
        striped={false}
        bordered
      />
    </div>
  );
}
