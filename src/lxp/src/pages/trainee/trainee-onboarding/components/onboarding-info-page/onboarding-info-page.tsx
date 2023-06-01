import { ContentTypeEnum, LanguageDto, useDialog } from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Button,
  DialogPosition,
  Divider,
  StepItem,
  Steps,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LanguageSelector from '../../../../../components/language-selector/language-selector';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { ContentService } from '@services/ContentService';
import { useAppDispatch } from '@store';
import { authSelectors } from '@store/auth';
import { progressTrackingThunkActions } from '@store/progress-tracking';

const MOCKED_INCOMPLETE_DATA = {
  visit: {
    title: 'First site visit',
    subTitle: 'By 10 April 2020',
  },
  alert: {
    title: 'SmartSpace Licence received',
    subTitle: 'By 13 December 2021',
  },
  steps: [
    {
      title: 'Sign start-up support agreement',
      subTitle: '22 Feb 2020',
      type: 'todo',
      showActionButton: true,
      actionButtonText: 'Sign',
      actionButtonTextColor: 'primary',
      actionButtonIcon: 'PencilAltIcon',
      actionButtonClassName: 'border-primary',
      actionButtonColor: 'primary',
      actionButtonType: 'outlined',
      actionButtonIconStartPosition: true,
    },
  ] as StepItem[],
};

const MOCKED_COMPLETE_DATA = {
  visit: {
    title: 'First site visit',
    subTitle: 'By 10 April 2020',
  },
  alert: {
    title: 'SmartSpace Licence received',
    subTitle: '10 March 2020',
  },
  steps: [
    {
      title: 'Attended day 1 of start-up training',
      subTitle: '22 Feb 2020',
      type: 'completed',
    },
  ] as StepItem[],
};

interface OnboardingInfoProps {
  setShowInfo: any;
}

export const OnboardingInfoPage: React.FC<OnboardingInfoProps> = ({
  setShowInfo,
}) => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);

  const getDataByLanguage = async (language: LanguageDto) => {
    const hasTranslations = await new ContentService(
      userAuth?.auth_token ?? ''
    ).hasContentTypeBeenTranslated(
      ContentTypeEnum.ProgressTrackingCategory,
      language.id ?? ''
    );

    if (hasTranslations) {
      await appDispatch(
        progressTrackingThunkActions.getProgressTrackingCategories({
          locale: language.locale,
        })
      ).unwrap();
      await appDispatch(
        progressTrackingThunkActions.getProgressTrackingSubCategories({
          locale: language.locale,
        })
      ).unwrap();
      await appDispatch(
        progressTrackingThunkActions.getProgressTrackingSkills({
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
    <BannerWrapper
      onBack={history.goBack}
      size={'normal'}
      renderBorder={true}
      showBackground={false}
      color={'primary'}
      title={'Onboarding'}
      backgroundColour={'white'}
      displayOffline={!isOnline}
    >
      <LanguageSelector
        currentLocale={'en-za'}
        selectLanguage={getDataByLanguage}
        className="bg-uiBg"
      />
      <div className={'bg-white px-4'}>
        <Typography
          className="mt-4"
          text={'How to complete your onboarding journey'}
          type="h2"
        />
        <Typography
          className="mt-4"
          text={'To start a section, tap the item.'}
          type="body"
          color="textMid"
        />
        <div className="py-4 pt-4">
          <Steps
            items={MOCKED_INCOMPLETE_DATA.steps}
            typeColor={{ completed: 'successMain', todo: 'primaryAccent2' }}
          />
          <Typography
            className="-mt-4"
            color={'textMid'}
            type={'body'}
            text={`When you a finish a step, a green circle and a tick will appear next to the step.`}
          />
        </div>
        <Divider dividerType="dashed" />
        <div className="py-4 pt-4">
          <Steps
            items={MOCKED_COMPLETE_DATA.steps}
            typeColor={{ completed: 'successMain' }}
          />
          <Typography
            className="-mt-4"
            color={'textMid'}
            type={'body'}
            text={`When you a finish a step, a green circle and a tick will appear next to the step.`}
          />
        </div>
      </div>
      <div className="mt-4 -mb-4 flex w-full justify-center self-end">
        <Button
          size="normal"
          className="mb-4 w-11/12"
          type="filled"
          color="primary"
          text="Start"
          textColor="white"
          icon="ArrowCircleRightIcon"
          onClick={() => setShowInfo(false)}
        />
      </div>
    </BannerWrapper>
  );
};

export default OnboardingInfoPage;
