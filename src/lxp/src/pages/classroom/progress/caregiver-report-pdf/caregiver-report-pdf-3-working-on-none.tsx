import { Card, Divider, Typography } from '@ecdlink/ui';
import { format } from 'date-fns';
import lightbulbEmoji from '@/assets/ECD_Connect_lightbulb.png';
import pinkFaceImg from '@/assets/progress-reports/pink-face.png';
import yellowFaceImg from '@/assets/progress-reports/yellow-face.png';
import backgroundImg from '@/assets/progress-reports/background.png';

export type ProgressCaregiverReportWorkingOnNonePageProps = {
  childFirstName: string;
  pageNumber: number;
  totalPages: number;
  reportingPeriodEndDate: Date;
  howToSupport: string;
  ageGroupName: string;
};

export const ProgressCaregiverReportWorkingOnNonePage: React.FC<
  ProgressCaregiverReportWorkingOnNonePageProps
> = ({
  childFirstName,
  pageNumber,
  totalPages,
  reportingPeriodEndDate,
  howToSupport,
  ageGroupName,
}) => {
  return (
    <div
      className={'flex flex-col px-4 pb-4 pt-4'}
      style={{ height: '1100px', position: 'relative', overflow: 'hidden' }}
    >
      <div className="mb-4 flex flex-row">
        <img src={pinkFaceImg} className="mr-4 h-20 w-20" />
        <Typography
          type="h1"
          color="textDark"
          text={`We can help ${childFirstName} to improve in these areas over the next few months`}
          className="mb-2"
        />
        <div
          className={`bg-quatenary mt-3 ml-auto mt-6 flex flex-shrink-0 flex-row items-center justify-between rounded-full px-3 py-1`}
          style={{ height: 'fit-content', width: 'fit-content' }}
        >
          <Typography
            type="small"
            weight="bold"
            color="white"
            text={`${format(reportingPeriodEndDate, 'MMM yyy')}`}
            lineHeight={4}
            className="pb-3 text-center"
          />
        </div>
      </div>
      <Divider dividerType="dashed" className="mb-4" />
      <img
        src={yellowFaceImg}
        className="mr-auto ml-auto mt-40 mb-10 h-40 w-40"
      />
      <Typography
        type="h1"
        color="textDark"
        text={`${childFirstName} is developing well!`}
        className="mb-2 text-center"
      />
      <Typography
        type="body"
        color="textDark"
        text={`${childFirstName} can do all of the things in the ${ageGroupName} age range!`}
        lineHeight={4}
        className="pb-3 text-center"
      />
      <Card className="bg-textDark mb-4 mt-8 flex flex-col rounded-2xl p-4">
        <div className="flex flex-row">
          <img src={lightbulbEmoji} className="mr-4 h-14 w-14" />
          <Typography
            type="h2"
            color="white"
            text={`Together, we can support ${childFirstName} by:`}
          />
        </div>
        <Typography type="body" color="white" text={howToSupport} />
      </Card>
      <p
        className="font-body text-textDark mt-auto ml-auto"
        style={{ fontSize: '12px', fontWeight: 'bold' }}
      >
        {`Page ${pageNumber} of ${totalPages}`}
      </p>

      <img
        src={backgroundImg}
        className="m-4 w-full"
        style={{ position: 'absolute', bottom: 0, left: 0 }}
      />
    </div>
  );
};
