import { yupResolver } from '@hookform/resolvers/yup';
import {
  BannerWrapper,
  Button,
  Dialog,
  PasswordInput,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { ActionListDataItem, DialogPosition } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DialogFormInput } from '@models/practitioner/DialogFormInput';
import { useAppDispatch } from '@store';
import { userSelectors, userThunkActions } from '@store/user';
import { UserResetPasswrodParams } from '@store/user/user.types';
import * as styles from './practitioner-account.styles';
import {
  initialPractitionerAccountValues,
  PractitionerAccountModel,
  practitionerAccountModelSchema,
} from '@schemas/practitioner/practitioner-account';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { analyticsActions } from '@store/analytics';

export default function PractitionerAccount() {
  const user = useSelector(userSelectors.getUser);
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const [editFieldVisible, setEditFieldVisible] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Practitioner Account',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const [dialogFormInput, setDialogFormInput] = useState<
    DialogFormInput<PractitionerAccountModel>
  >({ label: '', formFieldName: 'password', value: '' });
  const {
    register: practitionerAccountRegister,
    formState: practitionerAccountFormState,
    getValues: practitionerAccountFormGetValues,
  } = useForm({
    resolver: yupResolver(practitionerAccountModelSchema),
    defaultValues: initialPractitionerAccountValues,
    mode: 'onChange',
  });
  const { isValid } = practitionerAccountFormState;
  const stackedActionList: ActionListDataItem[] = [
    {
      title: 'Password',
      switchTextStyles: false,
      actionName: 'Edit',
      actionIcon: 'PencilIcon',
      onActionClick: () => {
        editField({
          label: 'Password',
          formFieldName: 'password',
          value: practitionerAccountFormGetValues().password,
        });
      },
    } as ActionListDataItem,
  ];

  const editField = (
    formInputToLoad: DialogFormInput<PractitionerAccountModel>
  ) => {
    setDialogFormInput(formInputToLoad);
    setEditFieldVisible(true);
  };

  const saveNewPassword = async () => {
    if (isValid) {
      setEditFieldVisible(false);
      await savePractitionerUserData();
    }
  };

  const savePractitionerUserData = async () => {
    if (user) {
      const practitionerForm = practitionerAccountFormGetValues();

      const resetModel: UserResetPasswrodParams = {
        newPassword: practitionerForm.password,
      };

      appDispatch(userThunkActions.resetUserPassword(resetModel));
    }
  };

  const closeEditField = () => {
    setEditFieldVisible(false);
  };

  return (
    <div>
      <BannerWrapper
        size={'normal'}
        renderBorder={true}
        title={'Account Details'}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
      >
        <StackedList
          listItems={stackedActionList}
          type={'ActionList'}
          className={'px-4'}
        ></StackedList>
      </BannerWrapper>
      <Dialog
        borderRadius="normal"
        stretch={true}
        visible={editFieldVisible}
        position={DialogPosition.Bottom}
      >
        <div className={'p-4'}>
          <div className={styles.labelContainer}>
            <Typography
              type="body"
              className=""
              color="textDark"
              text={dialogFormInput.label}
              weight="bold"
            ></Typography>
            <div onClick={closeEditField}>
              {renderIcon('XIcon', 'h-6 w-6 text-uiLight')}
            </div>
          </div>
          <PasswordInput<PractitionerAccountModel>
            visible={true}
            strengthMeterVisible={true}
            nameProp={dialogFormInput.formFieldName}
            register={practitionerAccountRegister}
            disabled={false}
            className={'mb-6'}
            value={practitionerAccountFormGetValues().password}
          />
          <Button
            type="filled"
            color="primary"
            className={'w-full'}
            onClick={saveNewPassword}
          >
            {renderIcon('SaveIcon', styles.buttonIcon)}
            <Typography
              type="help"
              className="mr-2"
              color="white"
              text={'Save'}
            ></Typography>
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
