import { useMutation, useQuery } from '@apollo/client';
import {
  AddPermissionToRole,
  CreateRole,
  PermissionGroupList,
  RemovePermissionToRole,
  UpdateRole,
} from '@ecdlink/graphql';
import { NOTIFICATION, useNotifications } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import AlertError from '../../../../components/alerts/error';
import AlertInfo from '../../../../components/alerts/info';
import Pagination from '../../../../components/pagination/pagination';

export interface RolePanelProps {
  role?: any;
  closeDialog: (value: boolean) => void;
}

export default function RolePanel(props: RolePanelProps) {
  const { setNotification } = useNotifications();
  const [tableData, setTableData] = useState<any[]>([]);
  const { data: dataPermissionGroups } = useQuery(PermissionGroupList, {
    fetchPolicy: 'cache-and-network',
  });
  const [addPermissionToRole] = useMutation(AddPermissionToRole);
  const [removePermissionToRole] = useMutation(RemovePermissionToRole);

  const defaultPermissions = [
    { id: `${1}${new Date().getTime()}`, name: 'Create' },
    { id: `${2}${new Date().getTime()}`, name: 'Update' },
    { id: `${3}${new Date().getTime()}`, name: 'Delete' },
    { id: `${4}${new Date().getTime()}`, name: 'View' },
  ];

  const [isEdit, setEdit] = useState(props.role ? true : false);
  const [currentRole, setCurrentRole] = useState(props.role);

  const roleSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name too short')
      .max(50, 'Name too long')
      .required('Name is Required'),
    normalizedName: Yup.string()
      .min(2, 'Normalized name too short')
      .max(50, 'Normalized name too long')
      .required('Normalized name is Required'),
  });

  const initialValues = {
    name: '',
    normalizedName: '',
  };

  const { register, handleSubmit, setValue, formState } = useForm({
    resolver: yupResolver(roleSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });
  const { errors, isValid, isSubmitted } = formState;

  useEffect(() => {
    if (props.role) {
      console.log(props.role);
      setValue('name', props.role.name, { shouldValidate: true });
      setValue('normalizedName', props.role.normalizedName, {
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.role]);

  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };

  const [addRole] = useMutation(CreateRole);
  const [editRole] = useMutation(UpdateRole);

  const getErrors = () => {
    const currentErrors = [];
    if (errors.name?.message) currentErrors.push(errors.name?.message);
    if (errors.normalizedName?.message)
      currentErrors.push(errors.normalizedName?.message);
    return currentErrors;
  };

  const onSubmit = async (values: any) => {
    console.log(isValid);
    if (isValid) {
      if (!isEdit) {
        await addRole({
          variables: {
            name: values.name,
            normalizedName: values.normalizedName,
          },
        })
          .then((response) => {
            setNotification({
              title: 'Successfully Created Role!',
              variant: NOTIFICATION.SUCCESS,
            });

            if (response.data && response.data.addRole) {
              setEdit(true);
              setCurrentRole(Object.assign({}, response.data.addRole));
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        await editRole({
          variables: {
            id: currentRole.id,
            name: values.name,
            normalizedName: values.normalizedName,
          },
        })
          .then((response) => {
            setNotification({
              title: 'Successfully Updated Role!',
              variant: NOTIFICATION.SUCCESS,
            });
            console.log(response);
            emitCloseDialog(true);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  const handleRolePermissionChange = async (
    permissionId: number[],
    included: boolean
  ) => {
    if (included) {
      await removePermissionToRole({
        variables: {
          roleId: currentRole.id,
          permissionIds: [permissionId],
        },
      })
        .then((response: any) => {
          console.log(currentRole);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await addPermissionToRole({
        variables: {
          roleId: currentRole.id,
          permissionIds: [permissionId],
        },
      })
        .then((response: any) => {
          console.log(currentRole);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 divide-y divide-gray-200"
    >
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="pt-8">
          <div className="grid grid-cols-2">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Role Information
            </h3>
            <div className="flex justify-end">
              <button
                onClick={() => emitCloseDialog(false)}
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {!isEdit ? <span> Save & Continue </span> : <span> Save </span>}
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  {...register('name')}
                  name="name"
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="normalizedName"
                className="block text-sm font-medium text-gray-700"
              >
                Normalized Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  {...register('normalizedName')}
                  name="normalizedName"
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isSubmitted && !isValid ? (
        <div className="pt-8">
          <AlertError alertMessage="Form Errors" errors={getErrors()} />
        </div>
      ) : null}

      {!isEdit ? (
        <div className="pt-8">
          <AlertInfo message="After a valid entry, Save & Continue will allow you to add permissions to this role." />
        </div>
      ) : null}

      {isEdit ? (
        <div className="py-8 align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {dataPermissionGroups && dataPermissionGroups.permissionGroups ? (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Content
                      </th>

                      {defaultPermissions.map((permission: any) => (
                        <th
                          key={permission.id}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {permission.name}
                        </th>
                      ))}

                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="z-10 bg-white divide-y divide-gray-200">
                    {tableData &&
                      tableData.map((permissionGroup: any) => (
                        <tr key={permissionGroup.groupName}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {permissionGroup.groupName}
                                </div>
                              </div>
                            </div>
                          </td>

                          {permissionGroup &&
                            permissionGroup.permissions.map(
                              (permission: any) => {
                                const checked =
                                  currentRole && currentRole.permissions
                                    ? currentRole.permissions.some(
                                        (x: any) => x.name === permission.name
                                      )
                                    : false;
                                return (
                                  <td
                                    key={permission.id}
                                    className="px-6 py-4 whitespace-nowrap"
                                  >
                                    <div className="flex items-center">
                                      <div className="text-sm font-medium text-gray-900">
                                        <input
                                          defaultChecked={checked}
                                          type="checkbox"
                                          className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                                          onChange={(e) =>
                                            handleRolePermissionChange(
                                              permission.id,
                                              !e.target.checked
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </td>
                                );
                              }
                            )}
                        </tr>
                      ))}
                  </tbody>
                </table>

                <Pagination
                  recordsPerPage={8}
                  items={dataPermissionGroups.permissionGroups}
                  responseData={setTableData}
                />
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </form>
  );
}
