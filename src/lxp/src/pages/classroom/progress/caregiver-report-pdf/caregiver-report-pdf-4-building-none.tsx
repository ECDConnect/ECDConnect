import { Divider, Typography } from '@ecdlink/ui';
import { format } from 'date-fns';
import blueFaceImg from '@/assets/progress-reports/blue-face.png';
import backgroundImg from '@/assets/progress-reports/background.png';
import yellowFaceImg from '@/assets/progress-reports/yellow-face.png';

export type ProgressCaregiverReportPdfBuildingNonePageProps = {
  childFirstName: string;
  pageNumber: number;
  totalPages: number;
  reportingPeriodEndDate: Date;
  ageGroupName: string;
};

export const ProgressCaregiverReportBuildingNonePage: React.FC<
  ProgressCaregiverReportPdfBuildingNonePageProps
> = ({
  childFirstName,
  pageNumber,
  totalPages,
  reportingPeriodEndDate,
  ageGroupName,
}) => {
  return (
    <div
      className={'flex flex-col px-4 pb-4 pt-4'}
      style={{ height: '1100px', position: 'relative' }}
    >
      <div className="mb-4 flex flex-row">
        <img src={blueFaceImg} className="mr-4 h-20 w-20" />
        <Typography
          type="h1"
          color="textDark"
          text={`Looking ahead, ${childFirstName} will build these skills`}
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
      <img src={yellowFaceImg} className="mr-auto ml-auto mt-40 h-40 w-40" />
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
      <p
        className="font-body text-textDark mt-auto ml-auto"
        style={{ fontSize: '12px', fontWeight: 'bold' }}
      >
        {`Page ${pageNumber} of ${totalPages}`}
      </p>

      <img
        src={backgroundImg}
        className=""
        style={{ position: 'absolute', bottom: 0, left: 0 }}
      />
    </div>
  );
};
