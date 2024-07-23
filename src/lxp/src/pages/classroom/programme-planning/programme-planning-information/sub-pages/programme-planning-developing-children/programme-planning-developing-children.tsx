import { ContentTypeEnum, LanguageDto, useDialog } from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Button,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LanguageSelector from '../../../../../../components/language-selector/language-selector';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { ContentService } from '@services/ContentService';
import { useAppDispatch } from '@store';
import { authSelectors } from '@store/auth';
import {
  progressTrackingSelectors,
  progressTrackingThunkActions,
} from '@store/progress-tracking';
import CategoryComponent from '../../components/category-component/category-component';
import * as styles from './programme-planning-developing-children.styles';

export const ProgrammePlanningDevelopingChildren = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories
  );

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
      title={'Developing children holistically'}
      className={styles.bannerContentWrapper}
      backgroundColour={'white'}
      displayOffline={!isOnline}
    >
      <LanguageSelector
        className="bg-uiBg"
        labelClassName="text-textDark pr-2"
        currentLocale={'en-za'}
        selectLanguage={getDataByLanguage}
      />
      <div className={'px-4'}>
        <Typography
          className="mt-4"
          text={
            'All your activities should result in the holistic development of each child.'
          }
          weight="bold"
          type="body"
          lineHeight="snug"
        />
        <Typography
          className="mt-4"
          text={
            'There are four development areas. Here are some ideas for helping children to progress:'
          }
          type="body"
          lineHeight="snug"
        />
      </div>
      <div className={'pb-4'}>
        {categories?.map((category) => (
          <div
            key={`progress-sub-category-card-${category.id}`}
            className="mt-2"
          >
            <CategoryComponent category={category} />
          </div>
        ))}
      </div>
      <Button
        className="mx-4 mt-auto mb-4"
        type="filled"
        color="quatenary"
        text="Close"
        icon="XIcon"
        textColor="white"
        onClick={() => history.goBack()}
      />
    </BannerWrapper>
  );
};

export default ProgrammePlanningDevelopingChildren;
