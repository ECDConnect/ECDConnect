/* This example requires Tailwind CSS v2.0+ */
import { useMutation, useQuery } from '@apollo/client';
import {
  initialNavigationValues,
  NavigationDto,
  navigationSchema,
  NOTIFICATION,
  PermissionDto,
  useNotifications,
} from '@ecdlink/core';
import {
  AddPermissionToNavigation,
  CreateNavigation,
  NavigationInput,
  PermissionGroupList,
  RemovePermissionFromNavigation,
  UpdateNavigation,
} from '@ecdlink/graphql';
import { Typography } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormField from '../../../../../../components/form-field/form-field';
import Editor from '../../../../../../components/form-markdown-editor/form-markdown-editor';
import Pagination from '../../../../../../components/pagination/pagination';

/* eslint-disable-next-line */
export interface NavigationPanelProps {
  item?: NavigationDto;
  closeDialog: (value: boolean) => void;
}

export default function NavigationPanel(props: NavigationPanelProps) {
  const { setNotification } = useNotifications();
  const [isEdit, setEdit] = useState(props.item ? true : false);
  const [create] = useMutation(CreateNavigation);
  const [update] = useMutation(UpdateNavigation);
  const [addPermissionsToNavigation] = useMutation(AddPermissionToNavigation);
  const [removePermissionFromNavigation] = useMutation(
    RemovePermissionFromNavigation
  );
  const [tableData, setTableData] = useState<any[]>([]);
  const { data: dataPermissionGroups } = useQuery(PermissionGroupList, {
    fetchPolicy: 'cache-and-network',
  });

  const defaultPermissions = [
    { id: `${1}${new Date().getTime()}`, name: 'View' },
    { id: `${2}${new Date().getTime()}`, name: 'Add' },
    { id: `${3}${new Date().getTime()}`, name: 'Update' },
    { id: `${4}${new Date().getTime()}`, name: 'Delete' },
  ];

  const { register, handleSubmit, getValues, setValue, formState } = useForm({
    resolver: yupResolver(navigationSchema),
    defaultValues: initialNavigationValues,
    mode: 'onChange',
  });
  const { errors, isValid } = formState;

  useEffect(() => {
    if (props.item) {
      setValue('sequence', props.item.sequence, {
        shouldValidate: true,
      });
      setValue('name', props.item.name, {
        shouldValidate: true,
      });
      setValue('icon', props.item.icon, {
        shouldValidate: true,
      });
      setValue('route', props.item.route, {
        shouldValidate: true,
      });
      setValue('description', props.item.description, {
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item]);

  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };

  const onSubmit = async () => {
    if (isValid) {
      const formValues = getValues();
      const inputModel: NavigationInput = {
        Id: props.item?.id ?? undefined,
        Name: formValues.name,
        Icon: formValues.icon,
        Route: formValues.route,
        Sequence: formValues.sequence,
        Description: formValues.description,
        IsActive: true,
      };

      if (!isEdit) {
        await create({
          variables: {
            input: { ...inputModel },
          },
        })
          .then((response) => {
            if (response.data) {
              setNotification({
                title: 'Successfully Created a Navigation item!',
                variant: NOTIFICATION.SUCCESS,
              });
              setEdit(true);
            }
            emitCloseDialog(true);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        await update({
          variables: {
            id: props.item?.id,
            input: { ...inputModel },
          },
        })
          .then((response) => {
            setNotification({
              title: 'Successfully Updated a Navigation item!',
              variant: NOTIFICATION.SUCCESS,
            });
            emitCloseDialog(true);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  const onDescriptionChange = (state: any) => {
    setValue('description', state);
  };

  const handlePermissionChange = async (
    permission: PermissionDto,
    included: boolean
  ) => {
    if (included) {
      await removePermissionFromNavigation({
        variables: {
          navigationId: props.item.id,
          permissionIds: [permission.id],
        },
      })
        .then((response: any) => {})
        .catch((error) => {
          console.log(error);
        });
    } else {
      await addPermissionsToNavigation({
        variables: {
          navigationId: props.item.id,
          permissionIds: [permission.id],
        },
      })
        .then((response: any) => {})
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
            <span className="text-lg leading-6 font-medium text-gray-900"></span>
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
              <FormField
                label={'Sequence'}
                nameProp={'sequence'}
                type="number"
                register={register}
                error={errors.sequence?.message}
              />
            </div>
            <div className="sm:col-span-3">
              <FormField
                label={'Name'}
                nameProp={'name'}
                register={register}
                error={errors.name?.message}
              />
            </div>
            <div className="sm:col-span-3">
              <FormField
                label={'Hero Icon'}
                nameProp={'icon'}
                register={register}
                error={errors.icon?.message}
              />
            </div>
            <div className="sm:col-span-3">
              <FormField
                label={'Route'}
                nameProp={'route'}
                register={register}
                error={errors.route?.message}
              />
            </div>
          </div>

          <div className="sm:col-span-12 mt-6">
            <Editor
              label={'Description'}
              currentValue={props.item ? props.item.description : undefined}
              onStateChange={(data) => onDescriptionChange(data)}
            />
          </div>
          <div className="sm:col-span-12 mt-3">
            <Typography
              type={'body'}
              weight={'bold'}
              color={'textMid'}
              text={'Required Permissions'}
            />

            {dataPermissionGroups && dataPermissionGroups.permissionGroups ? (
              <>
                <table className="min-w-full divide-y divide-gray-200 mt-3">
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
                              (permission: PermissionDto) => {
                                const checked =
                                  props.item && props.item.permissions
                                    ? props.item.permissions.some(
                                        (x) => x.id === permission.id
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
                                            handlePermissionChange(
                                              permission,
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
      </div>
    </form>
  );
}
