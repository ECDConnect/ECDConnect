import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTenant } from '@/hooks/useTenant';
import { useTenantModules } from '@/hooks/useTenantModules';
import { PermissionsNames } from '@/pages/principal/components/add-practitioner/add-practitioner.types';
import PermissionsService from '@/services/PermissionsService/PermissionsService';
import { useAppDispatch } from '@/store';
import { authSelectors } from '@/store/auth';
import { classroomsSelectors } from '@/store/classroom';
import { practitionerThunkActions } from '@/store/practitioner';
import { staticDataSelectors } from '@/store/static-data';
import { PractitionerDto } from '@ecdlink/core';
import { UpdateUserPermissionInputModelInput } from '@ecdlink/graphql';
import { BannerWrapper, Button, CheckboxGroup, Typography } from '@ecdlink/ui';
import {
  AcademicCapIcon,
  ClipboardCheckIcon,
  PresentationChartLineIcon,
  UserAddIcon,
  UserIcon,
} from '@heroicons/react/solid';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const EditPractitionerPermissions = ({
  setEditPractitionerModal,
  setEditPractitionerPermissions,
  practitioner,
  isFromProfileSection,
}: {
  setEditPractitionerModal: (item: boolean) => void;
  setEditPractitionerPermissions: (item: boolean) => void;
  practitioner?: PractitionerDto;
  isFromProfileSection?: boolean;
}) => {
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();
  const tenant = useTenant();
  const isWhiteLabel = tenant?.isWhiteLabel;
  const appName = tenant?.tenant?.applicationName;
  const { attendanceEnabled, classroomActivitiesEnabled, progressEnabled } =
    useTenantModules();
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const permissions = useSelector(staticDataSelectors.getPermissions);

  const premissionsFilteredByTenantModules = permissions
    ?.filter((item) =>
      !attendanceEnabled && isWhiteLabel
        ? item?.name !== PermissionsNames?.take_attendance
        : item
    )
    ?.filter((item2) =>
      !progressEnabled && isWhiteLabel
        ? item2?.name !== PermissionsNames?.create_progress_reports
        : item2
    )
    ?.filter((item3) =>
      !classroomActivitiesEnabled && isWhiteLabel
        ? item3?.name !== PermissionsNames?.plan_classroom_actitivies
        : item3
    );
  const [permissionsAdded, setPermissionsAdded] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateArray = useCallback(
    (checkbox: any, id: string) => {
      if (checkbox.checked) {
        setPermissionsAdded([...permissionsAdded, id]);
      } else {
        const filteredPermissions = permissionsAdded?.filter(
          (item) => item !== id
        );
        setPermissionsAdded(filteredPermissions);
      }
    },
    [permissionsAdded]
  );

  const handleUpdatePermissions = useCallback(async () => {
    setIsLoading(true);
    const updatePermissionInput: UpdateUserPermissionInputModelInput = {
      userId: practitioner?.userId,
      permissionIds: permissionsAdded,
    };

    const updatePermissions = await new PermissionsService(
      userAuth?.auth_token!
    ).UpdateUserPermission(updatePermissionInput);

    await appDispatch(
      practitionerThunkActions.getAllPractitioners({})
    ).unwrap();
    setIsLoading(false);
    setEditPractitionerPermissions(false);
    setEditPractitionerModal(false);
  }, [
    appDispatch,
    permissionsAdded,
    practitioner?.userId,
    setEditPractitionerModal,
    setEditPractitionerPermissions,
    userAuth?.auth_token,
  ]);

  useEffect(() => {
    if (practitioner?.permissions?.some((item) => item?.isActive === true)) {
      const userPermissions = practitioner?.permissions
        ?.filter((item) => item?.isActive === true)
        .map((perm) => perm?.permissionId!);
      if (userPermissions) {
        setPermissionsAdded(userPermissions);
      }
    }
  }, [practitioner?.permissions]);

  const renderPermissionIcon = (name: string) => {
    switch (name) {
      case PermissionsNames.take_attendance:
        return (
          <ClipboardCheckIcon className="bg-quatenary full ml-2 h-10 w-12 rounded-full py-2 text-white" />
        );
      case PermissionsNames.create_progress_reports:
        return (
          <PresentationChartLineIcon className="bg-quatenary full ml-2 h-10 w-12 rounded-full py-2 text-white" />
        );
      case PermissionsNames.plan_classroom_actitivies:
        return (
          <AcademicCapIcon className="bg-quatenary full ml-2 h-10 w-12 rounded-full py-2 text-white" />
        );
      default:
        return (
          <UserAddIcon className="bg-quatenary full ml-2 h-10 w-12 rounded-full py-2 text-white" />
        );
    }
  };

  const renderPermissionName = (name: string) => {
    switch (name) {
      case PermissionsNames.take_attendance:
        return 'Take attendance for their class(es)';
      case PermissionsNames.create_progress_reports:
        return 'Create progress reports to share with caregivers';
      case PermissionsNames.plan_classroom_actitivies:
        return 'Plan their own classroom activities';
      default:
        return `Add, edit, or remove children from ${classroom?.name}`;
    }
  };

  return (
    <div>
      <BannerWrapper
        title={'Change app rules'}
        size={'normal'}
        onBack={() => setEditPractitionerPermissions(false)}
        color={'primary'}
        renderBorder={true}
        showBackground={false}
        displayOffline={!isOnline}
      />
      <div className="p-4">
        <Typography
          type={'h2'}
          text={`What would you like ${
            practitioner?.user?.firstName || practitioner?.user?.userName
          } to do on ${appName}?`}
          color={'textDark'}
          className="mt-2"
        />
        {isFromProfileSection && (
          <Typography
            type={'body'}
            text={`You can edit this in future by going to the Business then Staff tab.`}
            color={'textMid'}
          />
        )}
      </div>
      <div className="w-full p-4">
        {premissionsFilteredByTenantModules?.map((item, index) => (
          <CheckboxGroup
            id={item.id}
            key={item.id}
            title={renderPermissionName(item?.name)}
            checked={permissionsAdded?.some((option) => option === item.id)}
            value={item.id}
            onChange={(event) => {
              updateArray(event, item?.id!);
            }}
            className="mb-1"
            icon={renderPermissionIcon(item?.name)}
            isIconFullWidth
            checkboxColor="primary"
          />
        ))}
      </div>
      <div className="flex w-full justify-center">
        <Button
          size="normal"
          className="mb-4 w-11/12"
          type="filled"
          color="quatenary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          disabled={isLoading}
          isLoading={isLoading}
          onClick={handleUpdatePermissions}
        />
      </div>
    </div>
  );
};
