import {
  ActionModal,
  Alert,
  Button,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import {
  ContentTypeEnum,
  LanguageDto,
  ProgressTrackingAgeGroupDto,
  useDialog,
} from '@ecdlink/core';
import LanguageSelector from '@/components/language-selector/language-selector';
import { ContentService } from '@/services/ContentService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { useAppDispatch } from '@/store';
import { progressTrackingThunkActions } from '@/store/progress-tracking';

export type ProgressLandingNoObservationsProps = {
  childId: string;
  currentAgeGroup: ProgressTrackingAgeGroupDto;
};

export const ProgressLandingNoObservations: React.FC<
  ProgressLandingNoObservationsProps
> = ({ childId, currentAgeGroup }) => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();

  const userAuth = useSelector(authSelectors.getAuthUser);

  // TODO - ADD online check and add check to see if already fetched
  // TODO hasTranslations seems to always return true
  const changeLanguage = async (language: LanguageDto) => {
    const hasTranslations = await new ContentService(
      userAuth?.auth_token ?? ''
    ).hasContentTypeBeenTranslated(
      ContentTypeEnum.ProgressTrackingCategory,
      language.id ?? ''
    );

    if (hasTranslations) {
      await appDispatch(
        progressTrackingThunkActions.getProgressTrackingContent({
          locale: language.locale,
        })
      ).unwrap();
    } else {
      presentUnavailableAlert();
    }
  };

  const presentUnavailableAlert = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, close) => {
        return (
          <ActionModal
            className={'mx-4'}
            title="No content found"
            paragraphs={[
              'Could not find any content for the selected language, please select another.',
            ]}
            icon={'InformationCircleIcon'}
            iconColor={'infoDark'}
            iconBorderColor={'infoBb'}
            actionButtons={[
              {
                text: 'Close',
                colour: 'primary',
                onClick: close,
                type: 'filled',
                textColour: 'white',
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  };

  return (
    <>
      <div
        className={`mt-4 mb-4 flex flex-shrink-0 flex-row items-center justify-between rounded-full px-3 py-1 bg-${
          currentAgeGroup?.color || 'secondary'
        }`}
        style={{ height: 'fit-content', width: 'fit-content' }}
      >
        <Typography
          type="buttonSmall"
          weight="bold"
          color="white"
          text={`${currentAgeGroup?.description} progress tracker`}
          lineHeight={4}
          className="text-center"
        />
      </div>
      {/* TODO - handle switching language, including fetching and storing extra language */}
      <LanguageSelector
        labelText="Progress tracker language:"
        labelClassName="font-medium font-body text-textDark pr-2"
        currentLocale="en-za"
        selectLanguage={(data) => {
          changeLanguage(data);
        }}
      />
      <div className="mt-4">
        {currentAgeGroup.startAgeInMonths < 36 && (
          <Alert
            type={'info'}
            messageColor="textDark"
            title={
              "This progress tracker has been adapted from the Caregiver-Reported Early Development Instruments (CREDI) developed by the Harvard Graduate School of Education and is aligned with South Africa's National Curriculum Framework for Children from Birth to Four (NCF)."
            }
          />
        )}
        {currentAgeGroup.startAgeInMonths > 35 && (
          <Alert
            type={'info'}
            title="This progress tracker is based on South Africa's National Curriculum Framework for Children from Birth to Four (NCF) developed by the Department of Basic Education (DBE)."
            messageColor="textDark"
          />
        )}
      </div>
      <Button
        onClick={() =>
          history.push(ROUTES.PROGRESS_OBSERVATIONS, {
            childId: childId,
          })
        }
        className="mt-auto mb-4 w-full"
        size="normal"
        color="quatenary"
        type="filled"
        icon="PencilIcon"
        text="Start"
        textColor="white"
      />
    </>
  );
};
