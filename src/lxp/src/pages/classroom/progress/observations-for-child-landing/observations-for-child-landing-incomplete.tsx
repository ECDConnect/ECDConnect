import {
  ActionModal,
  Alert,
  Button,
  Card,
  DialogPosition,
  Divider,
  ImageWithFallback,
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
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store';
import {
  progressTrackingActions,
  progressTrackingSelectors,
  progressTrackingThunkActions,
} from '@/store/progress-tracking';
import { useAppContext } from '@/walkthrougContext';
import { useMemo, useState } from 'react';
import { ChildProgressDetailedReport } from '@/models/progress/child-progress-report';
import { ProgressSkillValues } from '@/enums/ProgressSkillValues';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';

export type ObservationsForChildLandingIncompleteProps = {
  childId: string;
  currentAgeGroup: ProgressTrackingAgeGroupDto;
  doNotKnowPercentage: number;
  doNotKnowCount: number;
  childFirstName: string;
  currentReport?: ChildProgressDetailedReport;
  ageInMonths: number;
};

export const ObservationsForChildLandingIncomplete: React.FC<
  ObservationsForChildLandingIncompleteProps
> = ({
  childId,
  currentAgeGroup,
  doNotKnowPercentage,
  doNotKnowCount,
  childFirstName,
  currentReport,
  ageInMonths,
}) => {
  const history = useHistory();
  const {
    setState,
    state: { run: isWalkthrough },
  } = useAppContext();

  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const [showDetails, setShowDetails] = useState(false);
  const { isOnline } = useOnlineStatus();

  const showOfflineDialog = () => {
    return dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      blocking: true,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit} />;
      },
    });
  };

  const changeLanguage = async (language: LanguageDto) => {
    if (!language?.locale) return;

    const hasTranslations = await appDispatch(
      progressTrackingThunkActions.hasContentTypeBeenTranslated({
        id: ContentTypeEnum.ProgressTrackingSkill,
        ageGroup: currentAgeGroup?.id ?? 0,
        localeId: language.id ?? '',
      })
    ).unwrap();

    if (hasTranslations) {
      await appDispatch(
        progressTrackingThunkActions.getProgressTrackingContent({
          locale: language.locale,
        })
      ).unwrap();
      appDispatch(
        progressTrackingActions.setLocale({ localeId: language.locale })
      );
    } else {
      presentUnavailableAlert();
    }
  };

  const currentReportLocale = useSelector(
    progressTrackingSelectors?.getCurrentLocaleForReport
  );

  const presentUnavailableAlert = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, close) => {
        return (
          <ActionModal
            className={'bg-white'}
            title="No content found"
            detailText={
              'Could not find any content for the selected language, please select another.'
            }
            icon={'InformationCircleIcon'}
            iconColor={'infoDark'}
            iconBorderColor={'infoBb'}
            actionButtons={[
              {
                text: 'Close',
                colour: 'quatenary',
                onClick: () => {
                  appDispatch(
                    progressTrackingActions.setLocale({ localeId: 'en-za' })
                  );
                  close();
                },
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

  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories()
  );
  const subCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingSubCategories()
  );

  const doNotKnowSkills = useMemo(() => {
    return currentReport?.skillObservations.filter(
      (x) => x.value === ProgressSkillValues.DoNotKnow
    );
  }, [currentReport]);

  const doNotKnowSkillsByCategory = useMemo(() => {
    const doNotKnowSubCategories = subCategories.filter((x) =>
      doNotKnowSkills?.some((y) => y.subCategoryId === x.id)
    );

    return categories
      .filter((x) => doNotKnowSkills?.some((y) => y.categoryId === x.id))
      .map((category) => {
        const subCats = doNotKnowSubCategories.filter((x) =>
          category.subCategories.some((y) => y.id === x.id)
        );

        return {
          ...category,
          subCategories: subCats.map((x) => ({
            ...x,
            skills: doNotKnowSkills?.filter((y) => y.subCategoryId === x.id),
          })),
        };
      });
  }, [categories, subCategories, doNotKnowSkills]);

  return (
    <>
      {doNotKnowPercentage >= 25 ? (
        <div className="mt-4">
          <Alert
            className="mb-4"
            type={'info'}
            messageColor="textDark"
            title={`You answered "Don't know" for ${doNotKnowCount} skills.`}
            message={`Spend more time watching ${childFirstName} so that you can share more information about them.`}
          />
        </div>
      ) : (
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
          <LanguageSelector
            labelText="Progress tracker language:"
            labelClassName="font-medium font-body text-textDark pr-2"
            currentLocale={currentReportLocale}
            selectLanguage={(data) => {
              if (!isOnline) {
                showOfflineDialog();
              } else {
                changeLanguage(data);
              }
            }}
          />
        </>
      )}

      {doNotKnowPercentage < 25 && (
        <div className="mt-4">
          {currentAgeGroup?.startAgeInMonths < 36 && (
            <Alert
              type={'info'}
              messageColor="textDark"
              title={
                "This progress tracker has been adapted from the Caregiver-Reported Early Development Instruments (CREDI) developed by the Harvard Graduate School of Education and is aligned with South Africa's National Curriculum Framework for Children from Birth to Four (NCF)."
              }
            />
          )}
          {currentAgeGroup?.startAgeInMonths > 35 &&
            currentAgeGroup?.startAgeInMonths < 61 && (
              <Alert
                type={'info'}
                title="This progress tracker is based on South Africa's National Curriculum Framework for Children from Birth to Four (NCF) developed by the Department of Basic Education (DBE)."
                messageColor="textDark"
              />
            )}
          {currentAgeGroup?.startAgeInMonths > 60 && (
            <Alert
              type={'info'}
              title="This progress tracker has been adapted from the ChildSteps tool which was created using South Africa's School Based Assessment for Grade R."
              messageColor="textDark"
            />
          )}
        </div>
      )}
      {!isWalkthrough && doNotKnowPercentage >= 25 ? (
        <>
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
            icon="ArrowCircleRightIcon"
            text="Keep tracking progress"
            textColor="white"
          />
          <Button
            onClick={() => {
              if (!isWalkthrough) setShowDetails(!showDetails);
            }}
            className="mb-4 w-full"
            size="normal"
            color="quatenary"
            type="outlined"
            icon={showDetails ? 'EyeOffIcon' : 'EyeIcon'}
            text={showDetails ? 'Hide detail' : 'See detail'}
            textColor="quatenary"
          />
        </>
      ) : (
        <div id="startObservationsButton" className="mt-auto mb-4">
          <Button
            onClick={() => {
              if (isWalkthrough) {
                setState({ stepIndex: 2 });
              }
              history.push(ROUTES.PROGRESS_OBSERVATIONS, {
                childId: childId,
              });
            }}
            className="w-full"
            size="normal"
            color="quatenary"
            type="filled"
            icon="PencilIcon"
            text="Start"
            textColor="white"
          />
        </div>
      )}
      {!isWalkthrough && showDetails && (
        <div className="pb-4">
          <LanguageSelector
            labelText="Progress tracker language:"
            labelClassName="font-medium font-body text-textDark pr-2"
            currentLocale={currentReportLocale}
            selectLanguage={(data) => {
              changeLanguage(data);
            }}
          />
          {/* Do not know skills */}
          {currentReport?.skillObservations.some(
            (x) => x.value === ProgressSkillValues.DoNotKnow
          ) && (
            <>
              <Divider dividerType="dashed" className="mb-4" />
              <Typography
                type="h3"
                color="textDark"
                className="mb-4"
                text={'You chose “Don’t know” for these skills'}
              />
              {doNotKnowSkillsByCategory.map((category) => (
                <div key={category.id}>
                  <Card className="bg-uiBg mb-4 rounded-2xl p-4">
                    <div className="flex flex-row items-center">
                      <ImageWithFallback
                        src={category.imageUrl}
                        alt="category"
                        className="mr-2 h-12 w-12"
                      />
                      <Typography
                        type="h3"
                        color="textDark"
                        text={category.name}
                      />
                    </div>
                    {category.subCategories.map((subCategory) => (
                      <div key={subCategory.id}>
                        <Divider dividerType="dashed" className="mt-2 mb-2" />
                        <div className="flex flex-row items-center">
                          <ImageWithFallback
                            src={subCategory.imageUrl}
                            alt="category"
                            className="mr-2 h-8 w-8"
                          />
                          <Typography
                            type="h4"
                            color="textDark"
                            text={subCategory.name.toUpperCase()}
                          />
                        </div>
                        {subCategory?.skills?.map((skill) => (
                          <div key={skill.skillId}>
                            <Typography
                              type="body"
                              color="textDark"
                              className="mt-4"
                              text={skill.skillName}
                            />
                            <Button
                              onClick={() =>
                                history.push(ROUTES.PROGRESS_OBSERVATIONS, {
                                  childId: childId,
                                  jumpToSkillId: skill.skillId,
                                })
                              }
                              className="mt-2"
                              size="normal"
                              color="quatenary"
                              type="filled"
                              icon="PencilIcon"
                              text="Edit"
                              textColor="white"
                              iconPosition="end"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </Card>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
};
