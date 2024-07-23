import { ContentTypeEnum, LanguageDto, useDialog } from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Button,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import {
  programmeRoutineSelectors,
  programmeRoutineThunkActions,
} from '@store/content/programme-routine';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LanguageSelector from '../../../../../../components/language-selector/language-selector';
import { DailyRoutineItemInfo } from './components/daily-routine-item-info/daily-routine-item-info';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { ContentService } from '@services/ContentService';
import { authSelectors } from '@store/auth';
import { useAppDispatch } from '@store';

export const ProgrammePlanningDailyRoutine = () => {
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const routinePlan = useSelector(
    programmeRoutineSelectors.getProgrammeRoutineById(1)
  );

  const userAuth = useSelector(authSelectors.getAuthUser);

  const getDataByLanguage = async (language: LanguageDto) => {
    const hasTranslations = await new ContentService(
      userAuth?.auth_token ?? ''
    ).hasContentTypeBeenTranslated(
      ContentTypeEnum.ProgrammeRoutine,
      language.id ?? ''
    );

    if (hasTranslations) {
      await appDispatch(
        programmeRoutineThunkActions.getProgrammeRoutines({
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
      title={'The daily routine'}
      backgroundColour={'white'}
      displayOffline={!isOnline}
      className="flex h-full flex-col"
    >
      <LanguageSelector
        className="bg-uiBg"
        labelClassName="text-textDark mr-2"
        currentLocale={'en-za'}
        selectLanguage={getDataByLanguage}
      />

      <Typography
        className="mt-2 ml-4"
        color={'primary'}
        type={'h1'}
        text={'The daily routine'}
      />

      <img
        src={routinePlan?.headerBanner}
        className={'w-full'}
        alt="header banner"
      />
      <div className={'px-4 pt-4'}>
        <Typography
          text={'Use daily routine cards in your classroom'}
          type={'body'}
        />

        <ul className={'ml-4 mt-2 list-disc'}>
          <li>
            <Typography
              type={'help'}
              text={
                'Hang daily routine cards up and point to them as you move through the day.'
              }
            />
          </li>
          <li>
            <Typography
              type={'help'}
              text={
                'Children will learn to recognise the different parts of the daily routine, as well as the words and symbols associated with each activity. This is the beginning of reading.'
              }
            />
          </li>
          <li>
            <Typography
              type={'help'}
              text={
                'Encourage children to move the marker as you move through the routine.'
              }
            />
          </li>
        </ul>

        {routinePlan &&
          routinePlan.routineItems?.map((routineItem) => (
            <DailyRoutineItemInfo
              key={routineItem.name}
              routineItem={routineItem}
            />
          ))}
      </div>
      <Button
        className="mx-4 mt-auto mb-4"
        type="filled"
        color="quatenary"
        text="Close"
        icon="XIcon"
        textColor="white"
        onClick={history.goBack}
      />
    </BannerWrapper>
  );
};

export default ProgrammePlanningDailyRoutine;
