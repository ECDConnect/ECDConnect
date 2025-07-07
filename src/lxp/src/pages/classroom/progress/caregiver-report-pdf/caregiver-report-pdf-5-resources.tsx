import { Divider, Typography } from '@ecdlink/ui';
import { format } from 'date-fns';
import lightbulbEmoji from '@/assets/ECD_Connect_lightbulb.png';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import resourceLink from '@/assets/resource-link.png';

export type ProgressCaregiverReportResourcesPageProps = {
  childFirstName: string;
  pageNumber: number;
  totalPages: number;
  reportingPeriodEndDate: Date;
};

export const ProgressCaregiverResourcesPage: React.FC<
  ProgressCaregiverReportResourcesPageProps
> = ({ childFirstName, pageNumber, totalPages, reportingPeriodEndDate }) => {
  const links = useSelector(progressTrackingSelectors.getResourceLinks());

  return (
    <div
      className={'flex flex-col px-4 pb-4 pt-4'}
      style={{ height: '1100px' }}
    >
      <div className="mb-4 flex flex-row">
        <img src={lightbulbEmoji} className="mr-4 h-20 w-20" alt="bulb" />
        <Typography
          type="h1"
          color="textDark"
          text={`Resources to help ${childFirstName} learn & grow`}
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
      {links.map((x) => (
        <div
          key={x.id}
          className="border-infoMain bg-infoBb mt-6 mb-4 flex flex-col rounded-sm rounded-2xl border-2 p-4 pb-6 shadow-sm"
        >
          <div className="flex flex-row">
            <img src={resourceLink} className="mr-4 h-14 w-14" alt="link" />
            <Typography
              type="h3"
              color="textDark"
              text={x.title || 'some text'}
              className="mb-2"
            />
          </div>
          <Typography
            type="body"
            color="textDark"
            text={x.description || ''}
            className="mb-2"
          />
          <a className="text-quatenary" href={x.link || ''}>
            {x.link || ''}
          </a>
        </div>
      ))}
      <p
        className="font-body text-textDark mt-auto ml-auto"
        style={{ fontSize: '12px', fontWeight: 'bold' }}
      >
        {`Page ${pageNumber} of ${totalPages}`}
      </p>
    </div>
  );
};
