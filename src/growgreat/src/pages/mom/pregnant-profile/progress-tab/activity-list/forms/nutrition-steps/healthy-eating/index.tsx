import { Alert, Divider, renderIcon, Typography } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { ReactComponent as PollyShock } from '@/assets/pollyShock.svg';
import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { ReactComponent as PollyInformational } from '@/assets/pollyInformational.svg';
import { Header } from '@/pages/infant/infant-profile/components';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { Video } from '../../components/video';
import { useSelector } from 'react-redux';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import NutritionCare from '@/assets/nutritionCare.svg';
import { getGroupColor } from '../nutrition-eating';
import { noneOption } from '../nutrition-eating/options';
import { getPregnancyDay } from '@/utils/mom/pregnant.utils';
import { ResourcesStep } from '../resources';
import { DownloadResource } from '../resources/download-resource';

export const HealthyEatingStep = ({
  mother,
  setIsTip,
  isTipPage,
  sectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);
  const videoSection = 'Healthy eating';

  const nutritionAnswers = sectionQuestions?.[0]?.questions?.[0]
    ?.answer as string[];

  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );

  const isFirstVisit = !previousVisit?.visitDataStatus?.length;
  const pregnancyDay = getPregnancyDay(mother?.expectedDateOfDelivery!);
  const showVideo = pregnancyDay >= 98 && pregnancyDay <= 168;

  const renderMedia = useMemo(() => {
    if (isFirstVisit && showVideo) {
      return (
        <>
          <Alert
            type="warning"
            title={`Watch the video on Nutrition During Pregnancy with Lethabo and answer any questions.`}
            titleColor="textDark"
            customIcon={
              <div className="rounded-full">
                <PollyNeutral className="h-14 w-14" />
              </div>
            }
          />
          <Video section={videoSection} />
        </>
      );
    } else {
      return (
        <div>
          <ResourcesStep setIsTip={setIsTip} name={name} />
        </div>
      );
    }
  }, [isFirstVisit, name, setIsTip, showVideo]);

  const renderHealthyFoodAlerts = useMemo(() => {
    if (nutritionAnswers.length <= 1) {
      return (
        <div className="flex flex-col gap-4 p-4">
          <Alert
            className="mt-4"
            type="error"
            title={`Find out why ${name} has not eaten anything`}
            customIcon={
              <div className="rounded-full">
                {renderIcon(
                  'ExclamationCircleIcon',
                  'text-errorMain w-10 h-10'
                )}
              </div>
            }
            list={[
              `Help ${name} to find something to eat or check if Lethabo is feeling sick.`,
            ]}
          />
        </div>
      );
    }

    if (nutritionAnswers.length > 1 && nutritionAnswers.length < 4) {
      return (
        <div className="flex flex-col gap-4 p-4">
          <Alert
            type="warning"
            title={`${name} needs help with healthy eating!`}
            titleColor="textDark"
            customIcon={
              <div className="rounded-full">
                <PollyShock className="h-14 w-14" />
              </div>
            }
          />
        </div>
      );
    }

    if (nutritionAnswers.length >= 4 && nutritionAnswers.length < 5) {
      return (
        <div className="flex flex-col gap-4 p-4">
          <Alert
            type="warning"
            title={`${name} needs help with healthy eating!`}
            titleColor="textDark"
            customIcon={
              <div className="rounded-full">
                <PollyInformational className="h-14 w-14" />
              </div>
            }
          />
        </div>
      );
    }

    if (nutritionAnswers.length >= 5 && nutritionAnswers.length < 7) {
      return (
        <div className="flex flex-col gap-4 p-4">
          <Alert
            type="warning"
            title={`${name} is eating lots of different foods!`}
            titleColor="textDark"
            customIcon={
              <div className="rounded-full">
                <PollyHappy className="h-14 w-14" />
              </div>
            }
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 p-4">
        <Alert
          type="warning"
          title={`${name} is eating food from all the groups!`}
          titleColor="textDark"
          customIcon={
            <div className="rounded-full">
              <PollyImpressed className="h-14 w-14" />
            </div>
          }
        />
      </div>
    );
  }, [name, nutritionAnswers.length]);

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  const renderFoodGroupsNumber = useMemo(() => {
    if (!!nutritionAnswers.length && !nutritionAnswers.includes(noneOption)) {
      return (
        <div className="flex gap-2 px-4">
          <div
            className={`text-14 flex h-5 w-5 rounded-full bg-${getGroupColor(
              nutritionAnswers.length
            )} items-center justify-center font-bold text-white`}
          >
            {nutritionAnswers.includes(noneOption)
              ? 0
              : nutritionAnswers.length}
          </div>
          <Typography
            type="h4"
            color={getGroupColor(nutritionAnswers.length)}
            text={'Food groups'}
          />
        </div>
      );
    } else {
      return <></>;
    }
  }, [nutritionAnswers]);

  const renderDietarySentence = useMemo(() => {
    if (nutritionAnswers.length > 1 && nutritionAnswers.length < 4) {
      return (
        <>
          <Typography
            color="textDark"
            text="Not enough dietary diversity."
            type={'body'}
            weight="semibold"
            className={'p-4'}
          />
          <ul className={'text-uiMidDark mb-4 list-disc pl-8'}>
            <li>
              <Typography
                type={'help'}
                hasMarkup
                text={`Remind ${name} to try to eat all the food groups`}
                className={'text-sm font-normal'}
                color={'textDark'}
              />
            </li>
          </ul>
        </>
      );
    }

    if (nutritionAnswers.length > 3 && nutritionAnswers.length < 6) {
      return (
        <>
          <Typography
            color="textDark"
            text="Dietary diversity can be improved."
            weight="bold"
            type={'body'}
            className={'p-4'}
          />
          <ul className={'text-uiMidDark mb-4 list-disc pl-8'}>
            <li>
              <Typography
                type={'help'}
                hasMarkup
                text={`Remind ${name} to try to eat all the food groups`}
                className={'text-sm font-normal'}
                color={'textDark'}
              />
            </li>
          </ul>
        </>
      );
    }

    if (nutritionAnswers.length > 5 && nutritionAnswers.length < 7) {
      return (
        <Typography
          color="textDark"
          text="Dietary diversity is good, but could be improved."
          type={'body'}
          weight="semibold"
          className={'p-4'}
        />
      );
    }

    if (nutritionAnswers.length > 6) {
      return (
        <Typography
          color="textDark"
          text="Dietary diversity is great!"
          type={'body'}
          weight="semibold"
          className={'p-4'}
        />
      );
    }

    return <></>;
  }, [nutritionAnswers.length, name]);

  if (isTipPage) {
    return <DownloadResource onClose={() => setIsTip && setIsTip(false)} />;
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={NutritionCare}
        title={videoSection}
      />

      {!!nutritionAnswers.length && renderHealthyFoodAlerts}
      {!!nutritionAnswers.length && renderFoodGroupsNumber}
      {!!nutritionAnswers.length && renderDietarySentence}

      <Divider dividerType="dashed" />

      <div className="flex flex-col gap-4 p-4">{renderMedia}</div>
    </>
  );
};
