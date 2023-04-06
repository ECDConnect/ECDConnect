import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { DynamicFormProps } from '../../../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { Alert, Button, Divider, renderIcon, Typography } from '@ecdlink/ui';
import { ReactComponent as PollyShock } from '@/assets/pollyShock.svg';
import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import imgMocked from './mocked.png';
import { alerts } from './alerts';
import { replaceBraces } from '@ecdlink/core';
import { dietFormQuestion, getGroupColor } from '../alcohol-use';
import { noneOption } from '../alcohol-use/options';
import { DownloadResource } from './download-resource';

interface DescriptionProps {
  value: number;
  title: string;
  list: string[];
  clientName: string;
}

const Description = ({ value, title, list, clientName }: DescriptionProps) => (
  <>
    <div className="flex items-center gap-2">
      <div
        className={`text-14 flex h-5 w-5 rounded-full bg-${getGroupColor(
          value
        )} items-center justify-center font-bold text-white`}
      >
        {value}
      </div>
      <Typography type="h4" color={getGroupColor(value)} text={'Food groups'} />
    </div>

    <Typography type="h4" color="textDark" text={title} />
    {list.map((item) => (
      <li key={item} className="text-textMid">
        {replaceBraces(item, clientName)}
      </li>
    ))}
  </>
);

export const ResourcesStep = ({
  infant,
  sectionQuestions: questions,
  isTipPage,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant]
  );

  const answers = questions
    ?.flatMap((section) => section.questions)
    .find((question) => question.question === dietFormQuestion)
    ?.answer as string[];

  const count = answers?.includes(noneOption) ? 0 : answers?.length;

  const renderAlert = useMemo(() => {
    if (!count) {
      return (
        <Alert
          type="error"
          title={`Find out why ${name} has not eaten anything`}
          titleColor="errorDark"
          message={`Help ${caregiverName} to feed ${name} now or check if ${name} is sick.`}
          customIcon={
            <div>
              {renderIcon('ExclamationCircleIcon', 'w-9 h-9 text-errorMain')}
            </div>
          }
        />
      );
    }

    if (count < 4) {
      return (
        <>
          <Alert
            type="warning"
            title={`${caregiverName} needs help with feeding ${name} food from all the groups!`}
            titleColor="textDark"
            customIcon={
              <div className="rounded-full">
                <PollyShock className="h-14 w-14" />
              </div>
            }
          />
          <Description
            value={count}
            title={alerts.dietNotEnough.title}
            list={alerts.dietNotEnough.list}
            clientName={caregiverName}
          />
        </>
      );
    }

    if (count < 6) {
      return (
        <>
          <Alert
            type="warning"
            title={`${caregiverName} needs help with feeding ${name} food from all the groups!`}
            titleColor="textDark"
            customIcon={
              <div className="bg-tertiary h-14 w-14 rounded-full">
                <Polly className="h-14 w-14" />
              </div>
            }
          />
          <Description
            value={count}
            title={alerts.dietCanBeImproved.title}
            list={alerts.dietCanBeImproved.list}
            clientName={caregiverName}
          />
        </>
      );
    }

    return (
      <>
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
        <Description
          value={count}
          title={alerts.dietIsGood.title}
          list={alerts.dietIsGood.list}
          clientName={caregiverName}
        />
      </>
    );
  }, [caregiverName, count, name]);

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return <DownloadResource onClose={() => setIsTip && setIsTip(false)} />;
  }

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title="Complementary feeding"
        subTitle="Resources"
      />
      <div className="flex flex-col gap-4 p-4">
        {renderAlert}
        <Divider dividerType="dashed" />
        <Typography
          type="h4"
          color="black"
          text={`Show ${caregiverName} the food groups infographic:`}
        />
        <div className="flex items-center gap-8">
          <img
            alt="infographic"
            className="h-32 w-32 rounded-2xl object-cover"
            src={imgMocked}
          />
          <Button
            type="filled"
            color="secondaryAccent2"
            text="Share this image"
            icon="DownloadIcon"
            textColor="secondary"
            iconPosition="end"
            className="h-8"
            onClick={() => setIsTip && setIsTip(true)}
          />
        </div>
        <Divider dividerType="dashed" />
        <Typography
          type="h4"
          color="black"
          text={`Show ${caregiverName} the egg infographic:`}
        />
        <div className="flex items-center gap-8">
          <img
            alt="infographic"
            className="h-32 w-32 rounded-2xl object-cover"
            src={imgMocked}
          />
          <Button
            type="filled"
            color="secondaryAccent2"
            text="Share this image"
            icon="DownloadIcon"
            textColor="secondary"
            iconPosition="end"
            className="h-8"
            onClick={() => setIsTip && setIsTip(true)}
          />
        </div>
      </div>
    </>
  );
};
