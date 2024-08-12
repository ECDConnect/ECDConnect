import { BannerWrapper, Button, Card, Dropdown, Typography } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useState } from 'react';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';
import LanguageSelector from '@/components/language-selector/language-selector';
import { ReactComponent as EmojiYellowSmile } from '@/assets/ECD_Connect_emoji3.svg';

export type ProgressShareReportState = {
  childId: string;
  reportId?: string;
  showCelebration?: boolean;
};

export const ProgressShareReport: React.FC = () => {
  const history = useHistory();

  const { state: routeState } = useLocation<ProgressShareReportState>();

  const { child, completedReports } = useObserveProgressForChild(
    routeState.childId
  );

  const [selectedReport, setSelectedReport] = useState<string | undefined>(
    routeState.reportId
  );

  return (
    <BannerWrapper
      size={'small'}
      title={'Share caregiver report'}
      onBack={() => history.goBack()}
    >
      <div className="mt-2 flex flex-col p-4">
        <Typography
          color="textDark"
          text={'Share a report'}
          type={'h2'}
          className="mb-4"
        />
        <Card className="bg-successMain mb-4 flex items-center gap-4 rounded-2xl p-4">
          <EmojiYellowSmile className="h-16 w-12" />
          <div className="flex flex-col">
            <Typography
              type="h3"
              weight="bold"
              color="white"
              text={`Great, you've created ${child?.user?.firstName}'s report!`}
            />
            <Typography
              type="h3"
              weight="bold"
              color="white"
              text={
                'You can share the report with caregivers or send it to yourself.'
              }
            />
          </div>
        </Card>
        <Dropdown<string>
          label={'Which report would you like to share?'}
          textColor="textMid"
          placeholder={'Tap to choose report'}
          labelColor="textDark"
          list={completedReports.map((x) => ({
            label: `Report ${x.reportingPeriodNumber} - ${new Date(
              x.reportingPeriodEndDate
            ).getFullYear()}`,
            value: x.id,
          }))}
          selectedValue={selectedReport}
          onChange={(item) => setSelectedReport(item)}
          className="my-2"
        />
        <LanguageSelector
          labelText="Choose report language"
          labelClassName="font-medium font-body text-textDark pr-2"
          currentLocale="en-za"
          selectLanguage={(data) => {}}
        />
        <Typography
          color="textDark"
          text={'Tips for sharing the report'}
          type={'body'}
          className="mt-4"
        />
        <div className="ml-2">
          <ul className={'text-textMid ml-4 mt-2 list-disc'}>
            <li key={'tip_1'}>
              <Typography
                className="mt-2"
                type={'body'}
                text={`Send a voice note with a short summary of what makes ${child?.user?.firstName} special, how ${child?.user?.firstName} is growing, and the activities that ${child?.user?.firstName} enjoys.`}
                color={'textMid'}
              />
            </li>
            <li key={'tip_2'}>
              <Typography
                className="mt-2"
                type={'body'}
                text={`Have a meeting with caregivers to explain the report and share what they can do to help ${child?.user?.firstName} grow.`}
                color={'textMid'}
              />
            </li>
          </ul>
        </div>
        <Button
          onClick={() => {}}
          className="mt-4 w-full"
          size="small"
          color="quatenary"
          textColor="white"
          type="filled"
          icon={'ShareIcon'}
          text={'Share report'}
          disabled={true}
        />
      </div>
    </BannerWrapper>
  );
};
