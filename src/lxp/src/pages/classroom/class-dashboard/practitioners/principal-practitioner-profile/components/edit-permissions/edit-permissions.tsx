import { PermissionDto, PractitionerDto } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Typography,
  renderIcon,
  Card,
  Checkbox,
  RoundIcon,
} from '@ecdlink/ui';
import { useAppDispatch } from '@store/config';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { staticDataSelectors } from '@/store/static-data';
import { useTenant } from '@/hooks/useTenant';
import { practitionerThunkActions } from '@/store/practitioner';
import { classroomsSelectors } from '@/store/classroom';

export type EditPermissionsProps = {
  practitioner: PractitionerDto;
  onClose: () => void;
};

export const EditPermissions: React.FC<EditPermissionsProps> = ({
  practitioner,
  onClose,
}) => {
  const tenant = useTenant();

  const classroom = useSelector(classroomsSelectors.getClassroom);
  const permissions = useSelector(staticDataSelectors.getPermissions);
  const practitionerPermissions = permissions.filter(
    (x) => x.grouping === 'Practitioner'
  );

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    practitioner.permissions
      ?.filter((x) => x.isActive)
      .map((x) => x.permissionId) || []
  );

  const { isOnline } = useOnlineStatus();

  const appDispatch = useAppDispatch();

  const onSave = async () => {
    appDispatch(
      practitionerThunkActions.updatePractitionerPermissions({
        userId: practitioner.userId!,
        permissionsIds: selectedPermissions,
      })
    );

    onClose();
  };

  const onPermissionClick = (permissionId: string) => {
    const index = selectedPermissions.indexOf(permissionId);
    if (index > -1) {
      setSelectedPermissions(
        selectedPermissions.filter((x) => x !== permissionId)
      );
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const getPermissionDescription = (permission: PermissionDto) => {
    switch (permission.name) {
      case 'take_attendance':
        return 'Take attendance for their class(es)';
      case 'create_progress_reports':
        return 'Create progress reports to share with caregivers';
      case 'plan_classroom_activities':
        return 'Plan their own classroom activies';
      case 'manage_children':
        return `Register new children from ${classroom?.name}`;
      default:
        return permission.normalizedName;
    }
  };

  const getPermissionIcon = (permission: PermissionDto) => {
    switch (permission.name) {
      case 'take_attendance':
        return 'ClipboardCheckIcon';
      case 'create_progress_reports':
        return 'PresentationChartBarIcon';
      case 'plan_classroom_activities':
        return 'AcademicCapIcon';
      case 'manage_children':
        return 'UserAddIcon';
      default:
        return 'SaveIcon';
    }
  };

  return (
    <>
      <BannerWrapper
        size={'small'}
        renderBorder={true}
        title={'Change app rules'}
        color={'primary'}
        onBack={onClose}
        displayOffline={!isOnline}
      >
        <Typography
          type={'h1'}
          text={`What would you like ${practitioner.user?.firstName} to do on ${tenant.tenant?.organisationName}?`}
          color={'primary'}
          className={'px-4 pt-1'}
        />
        <div className="flex flex-wrap justify-center">
          {practitionerPermissions.map((permission) => {
            const selected = selectedPermissions.some(
              (x) => x === permission.id
            );
            return (
              <>
                <Card
                  className={`mt-4 flex w-11/12 flex-row gap-4 rounded-xl p-4 ${
                    selected
                      ? 'bg-quatenaryBg border-quatenary border-2'
                      : 'bg-uiBg'
                  }`}
                  onClick={() => onPermissionClick(permission.id)}
                >
                  <Checkbox checked={selected} />
                  <RoundIcon
                    icon={getPermissionIcon(permission)}
                    backgroundColor="quatenary"
                    iconColor="white"
                  />
                  <Typography
                    type={'body'}
                    text={getPermissionDescription(permission)}
                    color={'primary'}
                    className={'pt-3'}
                  />
                </Card>
              </>
            );
          })}
        </div>
        <div className="flex w-full justify-center">
          <Button
            type="filled"
            color="quatenary"
            className={'mt-6 mb-6 w-11/12'}
            onClick={onSave}
          >
            {renderIcon('SaveIcon', 'w-5 h-5 color-white text-white mr-2')}
            <Typography
              type="body"
              className="mr-4"
              color="white"
              text={'Save'}
            />
          </Button>
        </div>
      </BannerWrapper>
    </>
  );
};

export default EditPermissions;
