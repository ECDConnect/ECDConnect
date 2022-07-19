import { LocalStorageKeys, CoachDto, useTheme } from '@ecdlink/core';
import { FileTypeEnum } from '@ecdlink/graphql';
import * as styles from './coach-about.styles';
import {
  ActionListDataItem,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  FormInput,
  ProfileAvatar,
  renderIcon,
  StackedList,
  // StatusChip,
  Typography,
} from '@ecdlink/ui';
import {
  initialCoachAboutValues,
  CoachAboutModel,
  coachAboutModelSchema,
} from '@schemas/coach/coach-about';
import { PhotoPrompt } from '../../../components/photo-prompt/photo-prompt';
import { DialogFormInput } from '@models/practitioner/DialogFormInput';
import { setStorageItem } from '@utils/common/local-storage.utils';
import { practitionerSelectors } from '@/store/practitioner';
import { coachActions, coachSelectors } from '@store/coach';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { yupResolver } from '@hookform/resolvers/yup';
import { analyticsActions } from '@store/analytics';
import { useDocuments } from '@hooks/useDocuments';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@store';
import ROUTES from '@routes/routes';

export const CoachAbout: React.FC = () => {
  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);
  const [listItems, setListItems] = useState<ActionListDataItem[]>([]);
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [editFieldVisible, setEditFieldVisible] = useState(false);
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { theme } = useTheme();
  const {
    createNewDocument,
    deleteDocument,
    updateDocument,
    userProfilePicture,
  } = useDocuments();

  const pictureStorageKey = LocalStorageKeys.coachProfilePicture;

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Coach About',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  // const authUser = useSelector(authSelectors.getAuthUser);
  const coach = useSelector(coachSelectors.getCoach);
  // const practitioners = useSelector(practitionerSelectors.getPractitioners);
  // console.log(practitioners);

  useEffect(() => {
    if (coach) setNewStackListItems(coach);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coach]);

  const getDefaultFormvalues = () => {
    if (coach) {
      const tmpCoach: CoachAboutModel = {
        name: coach.user?.firstName || '',
        surname: coach.user?.surname || '',
        cellphone: coach.user?.phoneNumber || '',
        email: coach.user?.email || '',
        signature: coach.signature || '',
        address: coach.siteAddressId || '',
      };

      return tmpCoach;
    } else {
      return initialCoachAboutValues;
    }
  };

  const {
    register: coachAboutRegister,
    formState: coachAboutFormState,
    getValues: coachAboutFormGetValues,
  } = useForm({
    resolver: yupResolver(coachAboutModelSchema),
    defaultValues: getDefaultFormvalues(),
    mode: 'onChange',
  });

  const formatSiteAddressAsText = (user: CoachDto): string => {
    if (!user || !user.siteAddressId || !user.siteAddress)
      return 'Add a work address';

    const address = user.siteAddress.ward?.length
      ? `${user.siteAddress.ward}<br/>`
      : '';

    return address.concat(`
      ${user.siteAddress.addressLine1}<br/>
      ${user.siteAddress.addressLine2}, ${user.siteAddress.addressLine3} ${user.siteAddress.postalCode}
      <br/>${user.siteAddress.province?.description}`);
  };

  const setNewStackListItems = (currentUser: CoachDto) => {
    const list: ActionListDataItem[] = [
      {
        title: 'First Name',
        subTitle: currentUser?.user?.firstName,
        actionName: 'Edit',
        actionIcon: 'PencilIcon',
        switchTextStyles: true,
        onActionClick: () => {
          editField({
            label: 'First Name',
            formFieldName: 'name',
            value: coachAboutFormGetValues().name,
          });
        },
      },
      {
        title: 'Surname',
        subTitle: currentUser?.user?.surname,
        actionName: 'Edit',
        actionIcon: 'PencilIcon',
        switchTextStyles: true,
        onActionClick: () => {
          editField({
            label: 'Surname',
            formFieldName: 'surname',
            value: coachAboutFormGetValues().surname,
          });
        },
      },
      {
        title: 'Cellphone Number',
        subTitle: currentUser?.user?.phoneNumber || 'Add an Cellphone Number',
        switchTextStyles: true,
        actionName: currentUser?.user?.phoneNumber ? 'Edit' : 'Add',
        actionIcon: currentUser?.user?.phoneNumber ? 'PencilIcon' : 'PlusIcon',
        buttonType: currentUser?.user?.phoneNumber ? 'outlined' : 'filled',
        onActionClick: () => {
          editField({
            label: 'Cellphone Number',
            formFieldName: 'cellphone',
            value: coachAboutFormGetValues().cellphone,
          });
        },
      },
      {
        title: 'Email address',
        subTitle: currentUser?.user?.email || 'Add an Email Address',
        switchTextStyles: true,
        actionName: currentUser?.user?.email ? 'Edit' : 'Add',
        actionIcon: currentUser?.user?.email ? 'PencilIcon' : 'PlusIcon',
        buttonType: currentUser?.user?.email ? 'outlined' : 'filled',
        onActionClick: () => {
          editField({
            label: 'Email Address',
            formFieldName: 'email',
            value: coachAboutFormGetValues().email,
          });
        },
      },
      {
        title: 'Signature',
        subTitle: 'Add your signature',
        switchTextStyles: true,
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        onActionClick: () => {
          history.push(ROUTES.COACH.ABOUT.SIGNATURE);
        },
      },
      {
        title: 'Work address',
        subTitle: formatSiteAddressAsText(currentUser),
        switchTextStyles: true,
        hasMarkup: true,
        actionName: currentUser?.siteAddressId ? 'Edit' : 'Add',
        actionIcon: currentUser?.siteAddressId ? 'PencilIcon' : 'PlusIcon',
        buttonType: currentUser?.siteAddressId ? 'outlined' : 'filled',
        onActionClick: () => {
          history.push(ROUTES.COACH.ABOUT.ADDRESS);
        },
      },
    ];
    setListItems(list);
  };

  const editField = (formInputToLoad: DialogFormInput<CoachAboutModel>) => {
    setDialogFormInput(formInputToLoad);
    setEditFieldVisible(true);
  };

  const saveEdit = async () => {
    if (coachAboutFormState.errors[dialogFormInput.formFieldName]) {
      setDisplayError(true);
    } else {
      setEditFieldVisible(false);
      saveCoachUserData();
    }
  };

  const [dialogFormInput, setDialogFormInput] = useState<
    DialogFormInput<CoachAboutModel>
  >({
    label: '',
    formFieldName: 'name',
    value: '',
  });

  const displayProfilePicturePrompt = () => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
  };

  const closeEditField = () => {
    setEditFieldVisible(false);
  };

  const deleteProfilePicture = () => {
    if (userProfilePicture) deleteDocument(userProfilePicture);

    const copy = Object.assign({}, coach);
    if (copy) {
      copy.user!.profileImageUrl = '';
      appDispatch(coachActions.updateCoach(copy));
    }

    setEditProfilePictureVisible(!editProfilePictureVisible);
  };

  const picturePromptOnAction = async (imageBaseString: string) => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
    setStorageItem(imageBaseString, pictureStorageKey);

    const copy = Object.assign({}, coach);
    if (copy) {
      const tmpUser = Object.assign({}, copy.user);
      tmpUser.profileImageUrl = imageBaseString;
      copy.user = tmpUser;

      appDispatch(coachActions.updateCoach(copy));
    }

    if (!userProfilePicture) {
      await createNewDocument({
        data: imageBaseString,
        userId: coach!.user?.id || '',
        fileType: FileTypeEnum.ProfileImage,
        fileName: `ProfilePicture_${coach!.user?.id}.png`,
      });
    } else {
      updateDocument(userProfilePicture, imageBaseString);
    }
  };

  const saveCoachUserData = () => {
    const coachForm = coachAboutFormGetValues();
    const copy = Object.assign({}, coach);
    if (copy) {
      const tmpUser = Object.assign({}, copy.user);
      tmpUser.firstName = coachForm.name;
      tmpUser.surname = coachForm.surname;
      tmpUser.phoneNumber = coachForm.cellphone;
      tmpUser.email = coachForm.email;

      copy.user = tmpUser;

      appDispatch(coachActions.updateCoach(copy));
      setNewStackListItems(copy);
    }
  };

  return (
    <div className={styles.container}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        title={'About me'}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.push(ROUTES.COACH.PROFILE.ROOT)}
        displayOffline={!isOnline}
      >
        <div className={'w-full inline-flex justify-center pt-8'}>
          <ProfileAvatar
            dataUrl={userProfilePicture?.file || ''}
            size={'header'}
            onPressed={displayProfilePicturePrompt}
            hasConsent={true}
          />
        </div>
        <div className="flex my-4 justify-center">
          {/* <StatusChip
            className="mr-2"
            backgroundColour="infoDark"
            textColour={'white'}
            borderColour="infoDark"
            text={'22 Practitioners'}
          />
          <StatusChip
            className={'ml-2'}
            backgroundColour="primary"
            textColour={'white'}
            borderColour="primary"
            text={'4 Children'}
          /> */}
        </div>
        <StackedList
          className={'bg-uiBg'}
          listItems={listItems}
          type={'ActionList'}
        ></StackedList>
      </BannerWrapper>

      <Dialog
        stretch={true}
        borderRadius="normal"
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
          <FormInput<CoachAboutModel>
            visible={true}
            nameProp={dialogFormInput.formFieldName}
            register={coachAboutRegister}
            disabled={false}
            className={!displayError ? 'mb-6' : ''}
          />
          {displayError && (
            <div className={'mt-2'}>
              <Typography
                type="help"
                color="errorMain"
                text={
                  coachAboutFormState.errors[dialogFormInput.formFieldName]
                    ?.message || ''
                }
                className={'mb-6'}
              ></Typography>
            </div>
          )}
          <Button
            type="filled"
            color="primary"
            className={'w-full'}
            onClick={saveEdit}
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
      <Dialog
        visible={editProfilePictureVisible}
        position={DialogPosition.Bottom}
      >
        <div className={'p-4'}>
          <PhotoPrompt
            title="Profile Photo"
            onClose={displayProfilePicturePrompt}
            onAction={picturePromptOnAction}
            onDelete={userProfilePicture ? deleteProfilePicture : undefined}
          ></PhotoPrompt>
        </div>
      </Dialog>
    </div>
  );
};
